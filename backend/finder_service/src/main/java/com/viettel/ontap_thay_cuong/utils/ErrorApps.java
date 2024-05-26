package com.viettel.ontap_thay_cuong.utils;

public enum ErrorApps {
    REQUEST_INVALID_PARAM(400,I18n.getMessage("request.invalid.param")),
    ENTITY_NOT_FOUND(4004,I18n.getMessage("entity.not_found")),
    OBJECT_CAN_NOT_BE_NULL(4000,I18n.getMessage("object.can_not_be_null")),
    ROLE_EXISTED(4001,I18n.getMessage("role.existed")),
    SITE_NOT_FOUND(4002,I18n.getMessage("SITE.NOT.FOUND")),
    SORRY_NOT_FOUND_ANSWER(4003,I18n.getMessage("SORRY.NOT.FOUND.ANSWER"));

    private int status;
    private String message;

    ErrorApps(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
