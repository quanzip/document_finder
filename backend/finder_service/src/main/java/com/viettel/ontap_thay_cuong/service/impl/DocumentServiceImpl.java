package com.viettel.ontap_thay_cuong.service.impl;

import com.viettel.ontap_thay_cuong.entities.DocumentEntity;
import com.viettel.ontap_thay_cuong.entities.SiteEntity;
import com.viettel.ontap_thay_cuong.repository.DocumentRepository;
import com.viettel.ontap_thay_cuong.repository.SiteRepository;
import com.viettel.ontap_thay_cuong.service.DocumentService;
import com.viettel.ontap_thay_cuong.service.dto.DocumentDTO;
import com.viettel.ontap_thay_cuong.utils.CustomException;
import com.viettel.ontap_thay_cuong.utils.ErrorApps;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentServiceImpl implements DocumentService {
    @Value(value = "${application.documentFolder}")
    String documentFolder;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private SiteRepository siteRepository;

    @Override
    public Object checkAndSaveDocument(DocumentDTO documentDTO) {
        String siteCode = documentDTO.getSiteCode();
        if (siteCode == null || siteCode.isEmpty())
            throw new CustomException(ErrorApps.REQUEST_INVALID_PARAM.getMessage());
        else {
            List<SiteEntity> sites =  this.siteRepository.findAllByCodeAndStatus(siteCode, (short) 1);
            if (sites.isEmpty()) {
                throw new CustomException(ErrorApps.SITE_NOT_FOUND.getMessage());
            }

            File folder = new File(documentFolder);
            if (!folder.exists() || !folder.isDirectory()) {
                folder.mkdir();
            }

            try {
                MultipartFile multipartFile = documentDTO.getMultipartFile();

                if (multipartFile != null && !multipartFile.isEmpty() && !multipartFile.getName().isEmpty()) {
                    File fullFilePath = new File(folder, System.currentTimeMillis() + multipartFile.getName());
                    documentDTO.setDocumentUrl(fullFilePath.getPath());

                    FileOutputStream fileOutputStream = new FileOutputStream(fullFilePath);
                    fileOutputStream.write(multipartFile.getBytes());
                }
            } catch (IOException e) {
                e.printStackTrace();
                throw new CustomException(ErrorApps.REQUEST_INVALID_PARAM.getMessage());
            }

            DocumentEntity documentEntity = new DocumentEntity();
            BeanUtils.copyProperties(documentDTO, documentEntity);
            documentEntity.setId(UUID.randomUUID().toString());
            documentRepository.save(documentEntity);
        }
        return null;
    }

    @Override
    public List<DocumentEntity> getDocumentsBySiteCode(String siteCode) {
        return documentRepository.findAllBySiteCode(siteCode);
    }
}
