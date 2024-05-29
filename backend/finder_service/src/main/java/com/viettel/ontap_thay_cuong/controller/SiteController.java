package com.viettel.ontap_thay_cuong.controller;

import com.viettel.ontap_thay_cuong.entities.SiteEntity;
import com.viettel.ontap_thay_cuong.service.SiteService;
import com.viettel.ontap_thay_cuong.service.dto.SiteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@Controller()
@RequestMapping("/api/v1")
public class SiteController {
    @Autowired
    private SiteService siteService;

    @GetMapping("/sites")
    public List<SiteEntity> getSites(@RequestParam("siteName") String siteName) {
        return siteService.getSites(siteName);
    }
    @GetMapping("/sites/{id}")
    public SiteEntity getSiteById(@PathVariable("id") String id) {
        return siteService.getSiteById(id);
    }
    @PostMapping("/sites/create")
    public SiteEntity createSite(@RequestBody SiteDTO siteDTO) {
        return siteService.createSite(siteDTO);
    }
    @PostMapping("/sites/update")
    public SiteEntity updateSite(@RequestBody SiteDTO siteDTO) {
        return siteService.updateSite(siteDTO);
    }
//    @PostMapping("/sites/delete")
//    public SiteEntity getSiteById(@PathVariable("id") String id) {
//        return siteService.getSiteById(id);
//    }
}
