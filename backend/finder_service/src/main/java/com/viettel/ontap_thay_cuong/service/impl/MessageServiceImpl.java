package com.viettel.ontap_thay_cuong.service.impl;

import com.viettel.ontap_thay_cuong.entities.CustomerWaitingQuestionEntity;
import com.viettel.ontap_thay_cuong.entities.DocumentItemEntity;
import com.viettel.ontap_thay_cuong.entities.MessageEntity;
import com.viettel.ontap_thay_cuong.repository.CustomerWaitingQuestionRepository;
import com.viettel.ontap_thay_cuong.repository.DocumentItemRepository;
import com.viettel.ontap_thay_cuong.repository.MessageRepository;
import com.viettel.ontap_thay_cuong.service.MessageService;
import com.viettel.ontap_thay_cuong.service.dto.*;
import com.viettel.ontap_thay_cuong.utils.Constants;
import com.viettel.ontap_thay_cuong.utils.ErrorApps;
import com.viettel.ontap_thay_cuong.utils.I18n;
import javafx.scene.canvas.GraphicsContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {
    private final Logger logger = LoggerFactory.getLogger(MessageServiceImpl.class);

//    @Autowired
//    private SimpMessageSendingOperations operations;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private DocumentItemRepository documentItemRepository;

    @Autowired
    private CustomerWaitingQuestionRepository customerWaitingQuestionRepository;

    @Override
    public void saveMessageDTO(MessageSlimDTO messageSlimDTO) {
        MessageEntity messageEntity = new MessageEntity();
        BeanUtils.copyProperties(messageSlimDTO, messageEntity);
        messageEntity.setId(UUID.randomUUID().toString());
        this.messageRepository.save(messageEntity);
    }

    @Override
    public List<MessageSlimDTO> responseClient(MessageDTO input) {
        MessageSlimDTO userQuestionObj = input.getMessageSlimDTO();

        // save question from user
        this.saveMessageDTO(userQuestionObj);

        // response user;
        List<MessageSlimDTO> result = new ArrayList<>();
        String id = userQuestionObj.getId().trim();
        String siteCode = userQuestionObj.getSiteCode().trim();

        List<ContentDTO> contentDTOS = new ArrayList<>();
        if (id.isEmpty()) {
            // user do not ask by suggestions => lay cac feature xuat hien trong cau hori, lay cac cau hoi ok nhat cua cac feature do
            List<String> closeFeatures = this.documentItemRepository.findFeaturesByInputAndStatus(userQuestionObj.getContent().toLowerCase(), userQuestionObj.getSiteCode(), (short) 1);
            if (closeFeatures.isEmpty()) {
                return handleNotFoundAnswer(result, siteCode);
            } else {
                // lay cac question trong cac feature lien quan de nguoi dung chon cau hoi phu hop y ho
                return handleConfirmationByUnknownQuestion(userQuestionObj, result, siteCode, closeFeatures);
            }
        } else {
            List<DocumentItemEntity> docs = documentItemRepository.findAllByIdAndStatusAndSiteCode(id, (short) 1, siteCode);
            if (docs.isEmpty()) {
                return handleNotFoundAnswer(result, siteCode);
            }

            List<MessageEntity> messageEntities = new ArrayList<>();

            final Consumer<DocumentItemEntity> docConsumer = doc -> {
                contentDTOS.add(ContentDTO.Builder().stepContent(doc.getAnswer()));
                MessageSlimDTO subMessage = createNewAgentTypeMessage(siteCode, Constants.MESSAGE_TYPE_TEXT);
                subMessage.setContents(contentDTOS);
                subMessage.setContentExtra(userQuestionObj.getContentExtra());
                result.add(subMessage);

                MessageEntity message = new MessageEntity();
                BeanUtils.copyProperties(subMessage, message);
                messageEntities.add(message);

                doc.setSelectedCount(doc.getSelectedCount() + 1);
            };
            docs.forEach(docConsumer);
            messageRepository.saveAll(messageEntities);
            documentItemRepository.saveAll(docs);
        }
        return result;
    }

    @Override
    public Object receiveUserQuestionThatNotAcceptAnyConfirmQuestion(ConfirmDTO confirmDTO) {
        Function<DocumentItemDTO, String> docToId = DocumentItemDTO::getId;
        CustomerWaitingQuestionEntity customerWaitingQuestionEntity = new CustomerWaitingQuestionEntity();
        customerWaitingQuestionEntity.setId(UUID.randomUUID().toString());
        customerWaitingQuestionEntity.setQuestion(confirmDTO.getQuestion());
        customerWaitingQuestionEntity.setConfirmOptions(confirmDTO.getConfirmQuestions().stream().map(docToId).collect(Collectors.joining(",")));
        String siteCode = confirmDTO.getConfirmQuestions().get(0).getSiteCode();
        customerWaitingQuestionEntity.setSiteCode(siteCode);
        customerWaitingQuestionEntity.setCreateBy("finder_service");
        customerWaitingQuestionEntity.setCreateDate(LocalDateTime.now().toString());
        customerWaitingQuestionRepository.save(customerWaitingQuestionEntity);
        logger.info("Saved question of customer that are not satisfied by any confirm opts");

        List<MessageSlimDTO> result = new ArrayList<>();
        MessageSlimDTO messageSlimDTO = createNewAgentTypeMessage(siteCode, Constants.MESSAGE_TYPE_TEXT);
        messageSlimDTO.setContents(Collections.singletonList(ContentDTO.Builder().stepContent(I18n.getMessage("chat.thanks-for-ask-new-question"))));
        MessageEntity message = new MessageEntity();
        BeanUtils.copyProperties(messageSlimDTO, message);
        messageRepository.save(message);

        result.add(messageSlimDTO);
        return result;
    }

    private List<MessageSlimDTO> handleConfirmationByUnknownQuestion(MessageSlimDTO inputData, List<MessageSlimDTO> result, String siteCode, List<String> closeFeatures) {
        List<DocumentItemEntity> docs = this.documentItemRepository.findAllByStatusAndSiteCodeAndFeatureInOrderBySelectedCountDesc((short) 1, siteCode, closeFeatures);
        if (docs.isEmpty()) {
            return handleNotFoundAnswer(result, siteCode);
        }

        List<DocumentItemDTO> confirmQuestions = new ArrayList<>();
        Consumer<DocumentItemEntity> docConsumer = doc -> {
            DocumentItemDTO documentItemDTO = new DocumentItemDTO();
            BeanUtils.copyProperties(doc, documentItemDTO);
            confirmQuestions.add(documentItemDTO);
            // vì đây là list câu hỏi để gợi ý cho người dùng chọn tiếp, chưa phải message answer nên không ghi nhận mess mới.
        };
        docs.forEach(docConsumer);
        ConfirmDTO confirmDTO = new ConfirmDTO();
        confirmDTO.setQuestion(inputData.getContent());
        confirmDTO.setConfirmQuestions(confirmQuestions);
        confirmDTO.setRejected(false);
        confirmDTO.setFeatures(closeFeatures);

        MessageSlimDTO subMessage = createNewAgentTypeMessage(siteCode, Constants.MESSAGE_TYPE_CONFIRM);
        subMessage.setConfirmDTO(confirmDTO);
        subMessage.setContents(Collections.EMPTY_LIST);
        subMessage.setContentExtra(inputData.getContentExtra());
        result.add(subMessage);

        return result;
    }

    private List<MessageSlimDTO> handleNotFoundAnswer(List<MessageSlimDTO> result, String siteCode) {
        MessageSlimDTO subMessage = createNewAgentTypeMessage(siteCode, Constants.MESSAGE_TYPE_TEXT);
        subMessage.setContents(Collections.singletonList(ContentDTO.Builder().stepContent(ErrorApps.SORRY_NOT_FOUND_ANSWER.getMessage())));
        result.add(subMessage);
        return result;
    }

    private MessageSlimDTO createNewAgentTypeMessage(String siteCode, Integer messageType) {
        MessageSlimDTO subMessage = new MessageSlimDTO();
        subMessage.setId(UUID.randomUUID().toString());
        subMessage.setType(messageType);
        subMessage.setAuthorId("agent");
        subMessage.setSiteCode(siteCode);
        subMessage.setReceivedAt(System.currentTimeMillis());
        return subMessage;
    }
}
