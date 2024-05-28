package com.viettel.ontap_thay_cuong.service.impl;

import com.viettel.ontap_thay_cuong.entities.DocumentItemEntity;
import com.viettel.ontap_thay_cuong.entities.MessageEntity;
import com.viettel.ontap_thay_cuong.repository.DocumentItemRepository;
import com.viettel.ontap_thay_cuong.repository.MessageRepository;
import com.viettel.ontap_thay_cuong.service.MessageService;
import com.viettel.ontap_thay_cuong.service.dto.MessageSlimDTO;
import com.viettel.ontap_thay_cuong.utils.ErrorApps;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.function.Consumer;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private SimpMessageSendingOperations operations;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private DocumentItemRepository documentItemRepository;

    @Override
    public void saveMessage(MessageSlimDTO messageSlimDTO) {
        MessageEntity messageEntity = new MessageEntity();
        BeanUtils.copyProperties(messageSlimDTO, messageEntity);
        this.messageRepository.save(messageEntity);
    }

    @Override
    public void responseClient(MessageSlimDTO messageSlimDTO) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                MessageSlimDTO messResponse = new MessageSlimDTO();
                messResponse.setId(UUID.randomUUID().toString());
                messResponse.setType(1);
                messResponse.setAuthorId("agent");
                messResponse.setReceivedAt(System.currentTimeMillis());
                String question = messageSlimDTO.getContent();

                if (question.isEmpty()) {
                    messResponse.setContent(ErrorApps.SORRY_NOT_FOUND_ANSWER.getMessage());
                    operations.convertAndSend("/topic/customer_chat_receive",messResponse);
                } else {
                    List<DocumentItemEntity> docs = documentItemRepository.findAllByQuestionAndStatus(question, (short ) 1);
                    if (docs.isEmpty()) {
                        messResponse.setContent(ErrorApps.SORRY_NOT_FOUND_ANSWER.getMessage());
                        operations.convertAndSend("/topic/customer_chat_receive",messResponse);
                    }
                    List<MessageEntity> messageEntities = new ArrayList<>();
                    final Consumer<DocumentItemEntity> docConsumer = doc -> {
                        MessageEntity message = new MessageEntity();
                        messResponse.setContent(doc.getAnswer());
                        BeanUtils.copyProperties(messResponse, message);

                        messageEntities.add(message);
                        operations.convertAndSend("/topic/customer_chat_receive",messResponse);
                    };
                    messageRepository.saveAll(messageEntities);
                    docs.forEach(docConsumer);

                }

            }
        }).start();
    }
}
