package com.viettel.ontap_thay_cuong.controller;

import com.viettel.ontap_thay_cuong.service.SiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import javax.servlet.http.HttpServletResponse;

@Controller
public class ScriptController {

    @Autowired
    private SiteService siteService;

    @GetMapping(value = "/sites/gen-script/{siteCode}")
    public String getScript(@PathVariable(value = "siteCode") String siteCode, HttpServletResponse response) {
         this.siteService.genScriptBySiteCode(siteCode, response);
         return null;
    }
}
