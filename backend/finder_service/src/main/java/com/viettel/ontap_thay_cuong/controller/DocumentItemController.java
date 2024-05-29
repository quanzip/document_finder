package com.viettel.ontap_thay_cuong.controller;

import com.viettel.ontap_thay_cuong.service.DocumentItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1")
@CrossOrigin(origins = "*")
public class DocumentItemController {
    @Autowired
    private DocumentItemService documentItemService;

    @GetMapping(value = "/suggest")
    public Object suggestQuestions(@RequestParam(value = "input") String input, @RequestParam(value = "siteCode") String siteCode) {
        return this.documentItemService.getSuggestQuestionsByInputAndSiteCode(input, siteCode);
    }
}
