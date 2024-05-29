package com.viettel.ontap_thay_cuong.service.impl;

import com.viettel.ontap_thay_cuong.entities.SiteEntity;
import com.viettel.ontap_thay_cuong.mapper.BaseMapper;
import com.viettel.ontap_thay_cuong.repository.SiteRepository;
import com.viettel.ontap_thay_cuong.service.SiteService;
import com.viettel.ontap_thay_cuong.service.dto.SiteDTO;
import com.viettel.ontap_thay_cuong.utils.CustomException;
import com.viettel.ontap_thay_cuong.utils.ErrorApps;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
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
        siteEntity.setType(siteDTO.getType());
        return siteRepository.save(siteEntity);
    }

    @Override
    public SiteEntity updateSite(SiteDTO siteDTO) {
        SiteEntity siteEntity = mapper.mapDTOToEntity(siteDTO);
        return siteRepository.save(siteEntity);
    }

    @Override
    public String genScriptBySiteCode(String siteCode) {
        if (siteCode.trim().isEmpty()) throw new CustomException(ErrorApps.SITE_NOT_FOUND.getMessage());

        List<SiteEntity> sites = siteRepository.findAllByCodeAndStatus(siteCode, (short) 1);
        if (sites.isEmpty()) {
            throw new CustomException(ErrorApps.SITE_NOT_FOUND.getMessage());
        }

        File scriptFile = new File("src/main/resources/script/script");

        try {
            Scanner scanner = new Scanner(scriptFile);
            StringBuilder sb= new StringBuilder();
            while (scanner.hasNext()){
              sb.append(scanner.nextLine());
            }

            String domain_code = "domain_code";
            int siteCodeIndex = sb.indexOf(domain_code);
            if (siteCodeIndex >= 0) {
                sb = sb.replace(siteCodeIndex, siteCodeIndex + domain_code.length(), siteCode);
            }
            return sb.toString();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        return "";
    }
}
