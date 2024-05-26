package com.viettel.ontap_thay_cuong.service;

import com.viettel.ontap_thay_cuong.service.dto.DocumentDTO;

public interface DocumentService {
    Object checkAndSaveDocument(DocumentDTO documentDTO);
}
