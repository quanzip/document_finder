package com.viettel.ontap_thay_cuong.service.impl;

import com.viettel.ontap_thay_cuong.entities.DocumentItemEntity;
import com.viettel.ontap_thay_cuong.entities.MessageEntity;
import com.viettel.ontap_thay_cuong.repository.DocumentItemRepository;
import com.viettel.ontap_thay_cuong.repository.MessageRepository;
import com.viettel.ontap_thay_cuong.service.MessageService;
import com.viettel.ontap_thay_cuong.service.dto.*;
import com.viettel.ontap_thay_cuong.utils.Constants;
import com.viettel.ontap_thay_cuong.utils.ErrorApps;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.function.Consumer;

@Service
public class MessageServiceImpl implements MessageService {

//    @Autowired
//    private SimpMessageSendingOperations operations;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private DocumentItemRepository documentItemRepository;

    @Override
    public void saveMessageDTO(MessageSlimDTO messageSlimDTO) {
        MessageEntity messageEntity = new MessageEntity();
        BeanUtils.copyProperties(messageSlimDTO, messageEntity);
        messageEntity.setId(UUID.randomUUID().toString());
        this.messageRepository.save(messageEntity);
    }

    @Override
    public List<MessageSlimDTO> responseClient(MessageDTO input) {
        MessageSlimDTO inputData = input.getMessageSlimDTO();

        // save question from user
        this.saveMessageDTO(inputData);

        // response user;
        List<MessageSlimDTO> result = new ArrayList<>();
        String id = inputData.getId().trim();
        String siteCode = inputData.getSiteCode().trim();

        List<ContentDTO> contentDTOS = new ArrayList<>();
        if (id.isEmpty()) {
            // user do not ask by suggestions => lay cac feature xuat hien trong cau hori, lay cac cau hoi ok nhat cua cac feature do
            List<String> closeFeatures = this.documentItemRepository.findFeatureByInput(inputData.getContent().toLowerCase(), inputData.getSiteCode());
            if (closeFeatures.isEmpty()) {
                return handleNotFoundAnswer(result, siteCode);
            } else {
                // lay cac question trong cac feature lien quan de nguoi dung chon cau hoi phu hop y ho
                return handleConfirmationByUnknownQuestion(inputData, result, siteCode, closeFeatures);
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
                subMessage.setContentExtra(inputData.getContentExtra());
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
        ConfirmDTO confirmDTO = new ConfirmDTO();
        confirmDTO.setConfirmQuestions(confirmQuestions);
        confirmDTO.setFeatures(closeFeatures);

        MessageSlimDTO subMessage = createNewAgentTypeMessage(siteCode, Constants.MESSAGE_TYPE_CONFIRM);
        subMessage.setConfirmDTO(confirmDTO);
        subMessage.setContentExtra(inputData.getContentExtra());
        result.add(subMessage);

        docs.forEach(docConsumer);
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
