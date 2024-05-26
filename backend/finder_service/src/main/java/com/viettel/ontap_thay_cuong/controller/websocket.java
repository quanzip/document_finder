package com.viettel.ontap_thay_cuong.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.Serializable;

@Controller
@CrossOrigin(origins = "*")
public class websocket {

    @Autowired
    SimpMessageSendingOperations simpMessageSendingOperations;

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public Message messageHandler(Message message) {
        String text = message.getText();
        System.out.println("Received: " + message.getFrom() + "-" + text);
        String response = "Nice to meet " + message.getFrom();

        if (text.contains("2")) {
            Message message1 = new Message();
            message1.setFrom("Quanph");
            message1.setText(response + " - special");
            this.simpMessageSendingOperations.convertAndSend("/topic/special", message1);
            return null;
        }

        Message message1 = new Message();
        message1.setFrom("Quanph");
        message1.setText(response);
        return message1;
    }
}
class Message implements Serializable {
    private String from;
    private String text;

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}