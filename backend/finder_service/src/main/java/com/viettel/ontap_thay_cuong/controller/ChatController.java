package com.viettel.ontap_thay_cuong.controller;

import com.viettel.ontap_thay_cuong.service.MessageService;
import com.viettel.ontap_thay_cuong.service.dto.ConfirmDTO;
import com.viettel.ontap_thay_cuong.service.dto.MessageDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

@RestController()
@CrossOrigin(origins = "*")
@RequestMapping(value = "/basic/api/v1")
public class ChatController {
    private final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private SimpMessageSendingOperations operations;

    @Autowired
    private MessageService messageService;

    @PostMapping(value = "/chat")
    public Object receiveData(@RequestBody MessageDTO message) {
        logger.info("Receive messages from domainCode {}, data: {} ", message.getMessageSlimDTO().getSiteCode(), message);
        return messageService.responseClient(message);
    }

    @PostMapping(value = "/chat/user-confirm-not-accept")
    public Object receiveUserConfirmNotFoundSolutionUnderConfirm(@RequestBody ConfirmDTO confirmDTO) {
        logger.info("Receive user-confirm-not-accept from {} ", confirmDTO.getQuestion());
        return messageService.receiveUserQuestionThatNotAcceptAnyConfirmQuestion(confirmDTO);
    }

    @GetMapping(value = "/")
    public Object testApi() {
        return "quan";
    }
}

