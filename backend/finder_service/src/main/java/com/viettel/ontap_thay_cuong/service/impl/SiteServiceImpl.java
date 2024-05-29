package com.viettel.ontap_thay_cuong.service.impl;

import com.viettel.ontap_thay_cuong.entities.SiteEntity;
import com.viettel.ontap_thay_cuong.mapper.BaseMapper;
import com.viettel.ontap_thay_cuong.repository.SiteRepository;
import com.viettel.ontap_thay_cuong.service.SiteService;
import com.viettel.ontap_thay_cuong.service.dto.SiteDTO;
import com.viettel.ontap_thay_cuong.utils.CustomException;
import com.viettel.ontap_thay_cuong.utils.ErrorApps;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;
import java.util.Scanner;
import java.util.UUID;

@Service
public class SiteServiceImpl implements SiteService {
    @Autowired
    private BaseMapper mapper;
    @Autowired
    private SiteRepository siteRepository;

    @Override
    public List<SiteEntity> getSites(String siteName) {
        return siteRepository.findAllByNameLike(siteName);
    }

    @Override
    public SiteEntity getSiteById(String id) {
        return siteRepository.findById(id).orElse(null);
    }

    @Override
    public SiteEntity createSite(SiteDTO siteDTO) {
        SiteEntity siteEntity = mapper.mapDTOToEntity(siteDTO);
//        siteEntity.setId();
        siteEntity.setId(UUID.randomUUID().toString());
        siteEntity.setCode(UUID.randomUUID().toString());
        siteEntity.setAddress(siteDTO.getAddress());
        siteEntity.setName(siteDTO.getName());
        siteEntity.setStatus((short) 1);
        siteEntity.setType(siteDTO.getType());
        return siteRepository.save(siteEntity);
    }

    @Override
    public SiteEntity updateSite(SiteDTO siteDTO) {
        SiteEntity siteEntity = mapper.mapDTOToEntity(siteDTO);
        return siteRepository.save(siteEntity);
    }

    @Override
    public void genScriptBySiteCode(String siteCode, HttpServletResponse response) {
        if (siteCode.trim().isEmpty()) throw new CustomException(ErrorApps.SITE_NOT_FOUND.getMessage());

        List<SiteEntity> sites = siteRepository.findAllByCodeAndStatus(siteCode, (short) 1);
        if (sites.isEmpty()) {
            throw new CustomException(ErrorApps.SITE_NOT_FOUND.getMessage());
        }

        File scriptFile = new File("src/main/resources/script/script");

        try {
            Scanner scanner = new Scanner(scriptFile);
            StringBuilder sb = new StringBuilder();
            while (scanner.hasNext()) {
                sb.append(scanner.nextLine());
            }

            String domain_code = "domain_code";
            int siteCodeIndex = sb.indexOf(domain_code);
            if (siteCodeIndex >= 0) {
                sb = sb.replace(siteCodeIndex, siteCodeIndex + domain_code.length(), siteCode);
            }
//            return sb.toString();
            response.setContentType("application/octet-stream");
            try {

                File file = new File("storage/script/sample.js");
                FileOutputStream fileOutputStream = new FileOutputStream(file);
                fileOutputStream.write(sb.toString().getBytes());

                FileCopyUtils.copy(FileCopyUtils.copyToByteArray(file),
                        response.getOutputStream());
//            File file = new File("storage/script/sample.js");
//            FileWriter fileWriter = new FileWriter(file);
//            fileWriter.write(sb.toString());
//
//
//            Resource resource = new UrlResource(file.getAbsolutePath());
//
//            if (!resource.exists()) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//            }
//
//            String contentType = "application/octet-stream"; // Default type
//
//            return ResponseEntity.ok()
//                    .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
//                    .body(resource);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }

        @Override
        public ResponseEntity<HttpStatus> deleteSite (String id){
            try {
                siteRepository.deleteById(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        @Override
        public List<SiteEntity> findAllSiteByStatus ( short i){
            return siteRepository.findAllByStatus(i);
        }
    }
