package com.viettel.ontap_thay_cuong.service.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SiteDTO {
    String id;
    String name;
    String address;
    String code;
}
