package com.viettel.ontap_thay_cuong.controller;

import com.viettel.ontap_thay_cuong.entities.DocumentEntity;
import com.viettel.ontap_thay_cuong.service.DocumentService;
import com.viettel.ontap_thay_cuong.service.dto.DocumentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping(value = "/api/v1")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping(value = "/input")
    public Object loadDocumentBySiteCode(HttpServletRequest request, @ModelAttribute DocumentDTO documentDTO) {
        return this.documentService.checkAndSaveDocument(documentDTO);
    }

    @GetMapping(value = "/documents")
    public List<DocumentEntity> getDocumentsBySiteCode(@RequestParam("siteCode") String siteCode) {
        return documentService.getDocumentsBySiteCode(siteCode);
    }
}
