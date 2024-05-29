package com.viettel.ontap_thay_cuong.controller;

import com.viettel.ontap_thay_cuong.entities.SiteEntity;
import com.viettel.ontap_thay_cuong.repository.SiteRepository;
import com.viettel.ontap_thay_cuong.service.SiteService;
import com.viettel.ontap_thay_cuong.service.dto.SiteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api/v1")
public class SiteController {

    @Autowired
    SiteService siteService;

    @Autowired
    SiteRepository siteRepository;

    @PostMapping(value = "/sites/add")
    public Object createSite(HttpServletRequest request, @RequestBody SiteDTO siteDTO) {
        return new ResponseEntity<>(this.siteService.createSite(siteDTO), HttpStatus.CREATED);
    }

    @GetMapping("/sites")
    public ResponseEntity<List<SiteEntity>> getAllSites(@RequestParam(required = false) String keyword) {
        try {
            List<SiteEntity> sites = new ArrayList<SiteEntity>();

            if (keyword == null)
                siteRepository.findAll().forEach(sites::add);
            else
                siteRepository.findAllByNameContaining(keyword).forEach(sites::add);

            if (sites.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(sites, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/apps/{id}")
    public ResponseEntity<SiteEntity> getSiteById(@PathVariable("id") String id) {
        Optional<SiteEntity> siteData = siteRepository.findById(id);

        if (siteData.isPresent()) {
            return new ResponseEntity<>(siteData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/apps/{id}")
    public ResponseEntity<HttpStatus> deleteTutorial(@PathVariable("id") String id) {
        try {
            siteRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
