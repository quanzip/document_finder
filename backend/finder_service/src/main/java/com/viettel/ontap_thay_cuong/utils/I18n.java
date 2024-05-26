package com.viettel.ontap_thay_cuong.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.Objects;

@Component
public class I18n {
    private static MessageSource resourceBundleMessageSource;

    @Autowired
    I18n(MessageSource messageSource) {
        I18n.resourceBundleMessageSource = messageSource;
    }

    public static String getMessage(String code) {
        if (Objects.isNull(code) || code.isEmpty()) return "";
        Locale locale = LocaleContextHolder.getLocale();
        String language = locale.getLanguage();
        if (Objects.isNull(language) || language.isEmpty()) {
            locale = new Locale("vi");
        }
        try {
            return resourceBundleMessageSource.getMessage(code, null, locale);
        } catch (Exception exception) {
            return code;
        }
    }

    public static String getMessage(String code, Object... param) {
        if (Objects.isNull(code) || code.isEmpty()) return code;
        Locale locale = LocaleContextHolder.getLocale();
        String language = locale.getLanguage();
        if (Objects.isNull(language) || language.isEmpty()) {
            locale = new Locale("vi");
        }
        try {
            return String.format(resourceBundleMessageSource.getMessage(code, null, locale), param);
        } catch (Exception excpetion) {
            return code;
        }
    }
}
