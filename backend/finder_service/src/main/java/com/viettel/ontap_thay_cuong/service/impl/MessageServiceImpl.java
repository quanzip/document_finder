package com.viettel.ontap_thay_cuong.service.impl;

import com.viettel.ontap_thay_cuong.entities.DocumentItemEntity;
import com.viettel.ontap_thay_cuong.entities.MessageEntity;
import com.viettel.ontap_thay_cuong.repository.DocumentItemRepository;
import com.viettel.ontap_thay_cuong.repository.MessageRepository;
import com.viettel.ontap_thay_cuong.service.MessageService;
import com.viettel.ontap_thay_cuong.service.dto.ContentDTO;
import com.viettel.ontap_thay_cuong.service.dto.MessageDTO;
import com.viettel.ontap_thay_cuong.service.dto.MessageSlimDTO;
import com.viettel.ontap_thay_cuong.utils.ErrorApps;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
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
        String id = inputData.getId();

        if (id.isEmpty()) {  // user do not ask by suggestions
            MessageSlimDTO subMessage = createNewAgentTypeMessage();
            subMessage.setContent(Collections.singletonList(ContentDTO.Builder().stepContent(ErrorApps.SORRY_NOT_FOUND_ANSWER.getMessage())));
            result.add(subMessage);
            return result;
        } else {
            List<DocumentItemEntity> docs = documentItemRepository.findAllByIdAndStatusAndSiteCode(id, (short) 1, inputData.getSiteCode());
            if (docs.isEmpty()) {
                MessageSlimDTO subMessage = createNewAgentTypeMessage();
                subMessage.setContent(Collections.singletonList(ContentDTO.Builder().stepContent(ErrorApps.SORRY_NOT_FOUND_ANSWER.getMessage())));
                result.add(subMessage);
                return result;
            }

            List<MessageEntity> messageEntities = new ArrayList<>();
            List<ContentDTO> contentDTOS = new ArrayList<>();

            final Consumer<DocumentItemEntity> docConsumer = doc -> {
                contentDTOS.add(ContentDTO.Builder().stepContent(doc.getAnswer()));
                MessageSlimDTO subMessage = createNewAgentTypeMessage();
                subMessage.setContent(contentDTOS);
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

    private MessageSlimDTO createNewAgentTypeMessage() {
        MessageSlimDTO subMessage = new MessageSlimDTO();
        subMessage.setId(UUID.randomUUID().toString());
        subMessage.setType(1);
        subMessage.setAuthorId("agent");
        subMessage.setReceivedAt(System.currentTimeMillis());
        return subMessage;
    }
}
