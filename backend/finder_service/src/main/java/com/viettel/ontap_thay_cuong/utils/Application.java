package com.viettel.ontap_thay_cuong.utils;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(ignoreInvalidFields = true, prefix = "application")
public class Application {
    private String imageFolder;

    public String getImageFolder() {
        return imageFolder;
    }

    public void setImageFolder(String imageFolder) {
        this.imageFolder = imageFolder;
    }
}
