package com.viettel.ontap_thay_cuong.utils;

public class CustomException extends RuntimeException{
    String message;
    int code;

    public CustomException(int code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    public CustomException(String message) {
        super(message);
        this.message = message;
    }

    public CustomException() {
        super(ErrorApps.REQUEST_INVALID_PARAM.getMessage());
    }
}
