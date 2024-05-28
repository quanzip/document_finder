package com.viettel.ontap_thay_cuong.service;

import com.sBot.service.dto.SiteDTO;
import com.viettel.ontap_thay_cuong.entities.SiteEntity;

public interface SiteService {
    SiteEntity save(SiteDTO siteDTO);
}
