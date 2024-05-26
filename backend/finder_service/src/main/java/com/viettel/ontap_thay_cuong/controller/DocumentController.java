package com.viettel.ontap_thay_cuong.controller;

import com.viettel.ontap_thay_cuong.service.DocumentService;
import com.viettel.ontap_thay_cuong.service.dto.DocumentDTO;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = "/api/v1")
public class DocumentController {

    private DocumentService documentService;

    @PostMapping(value = "/input")
    public Object loadDocumentBySiteCode(HttpServletRequest request, @RequestBody DocumentDTO documentDTO) {
        return this.documentService.checkAndSaveDocument(documentDTO);
    }

}
