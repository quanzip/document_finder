package com.viettel.ontap_thay_cuong.service;

import com.viettel.ontap_thay_cuong.service.dto.ConfirmDTO;
import com.viettel.ontap_thay_cuong.service.dto.MessageDTO;
import com.viettel.ontap_thay_cuong.service.dto.MessageSlimDTO;

import java.util.List;

public interface MessageService {
    void saveMessageDTO(MessageSlimDTO messageSlimDTO);

    List<MessageSlimDTO> responseClient(MessageDTO messageDTO);

    Object receiveUserQuestionThatNotAcceptAnyConfirmQuestion(ConfirmDTO confirmDTO);
}
