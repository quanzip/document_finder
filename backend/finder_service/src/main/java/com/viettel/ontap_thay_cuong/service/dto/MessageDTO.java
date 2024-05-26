package com.viettel.ontap_thay_cuong.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MessageDTO {
    @JsonProperty(value = "data")
    MessageSlimDTO messageSlimDTO;

    public MessageSlimDTO getMessageSlimDTO() {
        return messageSlimDTO;
    }

    public void setMessageSlimDTO(MessageSlimDTO messageSlimDTO) {
        this.messageSlimDTO = messageSlimDTO;
    }
}
