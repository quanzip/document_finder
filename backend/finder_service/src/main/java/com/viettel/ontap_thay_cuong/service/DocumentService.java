package com.viettel.ontap_thay_cuong.service;

import com.viettel.ontap_thay_cuong.entities.DocumentEntity;
import com.viettel.ontap_thay_cuong.service.dto.DocumentDTO;

import java.util.List;

public interface DocumentService {
    Object checkAndSaveDocument(DocumentDTO documentDTO);
    List<DocumentEntity> getDocumentsBySiteCode(String siteCode);
}
