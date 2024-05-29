package com.viettel.ontap_thay_cuong.service;

import com.viettel.ontap_thay_cuong.entities.SiteEntity;
import com.viettel.ontap_thay_cuong.service.dto.SiteDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

public interface SiteService {
    List<SiteEntity> getSites(String siteName);
    SiteEntity getSiteById(String id);
    SiteEntity createSite(SiteDTO siteDTO);
    SiteEntity updateSite(SiteDTO siteDTO);

    void genScriptBySiteCode(String siteCode, HttpServletResponse response);

    ResponseEntity<HttpStatus> deleteSite(String id);

    List<SiteEntity> findAllSiteByStatus(short i);
}
