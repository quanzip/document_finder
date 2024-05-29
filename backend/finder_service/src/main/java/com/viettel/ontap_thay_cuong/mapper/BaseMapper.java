package com.viettel.ontap_thay_cuong.mapper;

import com.viettel.ontap_thay_cuong.entities.SiteEntity;
import com.viettel.ontap_thay_cuong.service.dto.SiteDTO;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;

@Mapper
@Component
public interface BaseMapper {
    SiteDTO mapEntityToDTO(SiteEntity siteEntity);
    SiteEntity mapDTOToEntity(SiteDTO siteDTO);
}
