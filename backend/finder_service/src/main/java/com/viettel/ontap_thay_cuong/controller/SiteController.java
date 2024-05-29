package com.viettel.ontap_thay_cuong.controller;

import com.viettel.ontap_thay_cuong.entities.SiteEntity;
import com.viettel.ontap_thay_cuong.service.SiteService;
import com.viettel.ontap_thay_cuong.service.dto.SiteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController()
@RequestMapping(value = "/api/v1")
public class SiteController {
    @Autowired
    private SiteService siteService;

    @GetMapping("/sites")
    public List<SiteEntity> getSites(@RequestParam(value = "siteName", required = false) String siteName) {
        if (siteName == null || siteName.isEmpty()) {
            return this.siteService.findAllSiteByStatus((short)1);
        }
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

//    @DeleteMapping("/sites/{id}")
//    public ResponseEntity<HttpStatus> deleteTutorial(@PathVariable("id") String id) {
//       return siteService.deleteSite(id);
//    }

    @GetMapping(value = "/sites/gen-script/{siteCode}")
    public String getScript(@PathVariable(value = "siteCode") String siteCode) {
        return this.siteService.genScriptBySiteCode(siteCode);
    }
}
