package com.viettel.ontap_thay_cuong.utils;

public class Constants {
    public interface Status {
        short ACTIVE = 1;
        short INACTIVE = 0;
    }

    public static String avatarIdentify = "_ava_";
    public static String apiPrefixV1 = "/api/v1";

    public static Integer MESSAGE_TYPE_TEXT = 1;
    public static Integer MESSAGE_TYPE_CONFIRM = 30;
    public static Integer MESSAGE_TYPE_SAVE_USER_UNSATISFIED_QUESTION = 31;
    public static Integer MESSAGE_TYPE_CUS_SUGGEST_TO_ADD = 32;
}
