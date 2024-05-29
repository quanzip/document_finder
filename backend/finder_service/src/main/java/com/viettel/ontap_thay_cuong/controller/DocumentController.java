package com.viettel.ontap_thay_cuong.controller;

import com.viettel.ontap_thay_cuong.entities.DocumentEntity;
import com.viettel.ontap_thay_cuong.service.DocumentService;
import com.viettel.ontap_thay_cuong.service.dto.DocumentDTO;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/api/v1")
public class DocumentController {

    private DocumentService documentService;

    @PostMapping(value = "/input")
    public Object loadDocumentBySiteCode(HttpServletRequest request, @RequestBody DocumentDTO documentDTO) {
        return this.documentService.checkAndSaveDocument(documentDTO);
    }

    @GetMapping(value = "/documents")
    public List<DocumentEntity> getDocumentsBySiteCode(@RequestParam("siteCode") String siteCode) {
        return documentService.getDocumentsBySiteCode(siteCode);
    }
}
