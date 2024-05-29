package com.viettel.ontap_thay_cuong.service;

import com.viettel.ontap_thay_cuong.entities.SiteEntity;
import com.viettel.ontap_thay_cuong.service.dto.SiteDTO;

import java.util.List;

public interface SiteService {
    List<SiteEntity> getSites(String siteName);
    SiteEntity getSiteById(String id);
    SiteEntity createSite(SiteDTO siteDTO);
    SiteEntity updateSite(SiteDTO siteDTO);
}
