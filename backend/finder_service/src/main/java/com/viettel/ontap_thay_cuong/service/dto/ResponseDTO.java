package com.viettel.ontap_thay_cuong.service.dto;

public class ResponseDTO <T> {
    ResponseType type;
    T data;

    public ResponseDTO(ResponseType type, T data) {
        this.type = type;
        this.data = data;
    }

    public ResponseDTO() {
    }
}

enum ResponseType {
    SUBMIT, NON_SUBMIT
}
