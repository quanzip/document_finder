package com.viettel.ontap_thay_cuong.service.impl;

import com.sBot.service.dto.SiteDTO;
import com.viettel.ontap_thay_cuong.entities.SiteEntity;
import com.viettel.ontap_thay_cuong.service.SiteService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SiteServiceImpl implements SiteService {
    @Override
    public SiteEntity save(SiteDTO siteDTO) {
        SiteEntity res = new SiteEntity();
        res.setId(UUID.randomUUID().toString());
        res.setCode(UUID.randomUUID().toString());
        res.setAddress(siteDTO.getAddress());
        res.setName(siteDTO.getName());
        res.setType(siteDTO.getType());
        return res;
    }
}
