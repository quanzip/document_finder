package com.viettel.ontap_thay_cuong.service.impl;

import com.viettel.ontap_thay_cuong.entities.SiteEntity;
import com.viettel.ontap_thay_cuong.mapper.BaseMapper;
import com.viettel.ontap_thay_cuong.repository.SiteRepository;
import com.viettel.ontap_thay_cuong.service.SiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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
}
