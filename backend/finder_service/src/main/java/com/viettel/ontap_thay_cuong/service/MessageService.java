package com.viettel.ontap_thay_cuong.service;

import com.viettel.ontap_thay_cuong.service.dto.MessageSlimDTO;

public interface MessageService {
    void saveMessage(MessageSlimDTO messageSlimDTO);

    void responseClient(MessageSlimDTO messageSlimDTO, String siteCode);
}
