package com.viettel.ontap_thay_cuong.service.impl;

import com.viettel.ontap_thay_cuong.entities.DocumentItemEntity;
import com.viettel.ontap_thay_cuong.repository.DocumentItemRepository;
import com.viettel.ontap_thay_cuong.service.DocumentItemService;
import com.viettel.ontap_thay_cuong.service.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class DocumentItemServiceImpl implements DocumentItemService {

    @Autowired
    private DocumentItemRepository documentItemRepository;

    @Override
    public Object getSuggestQuestionsByInputAndSiteCode(String input, String siteCode) {
        if (input.isEmpty()) return null;
        String[] sections = input.trim().split(" ");

        if (sections.length > 1) {
            // search for question;
            List<DocumentItemEntity> result = documentItemRepository.findAllByFeatureLikeOrQuestionLikeAndStatusOrderBySelectedCountDesc(input, (short) 1);
            return result;
        } else {
            List<DocumentItemEntity> result = new ArrayList<>();
            final Function<Object, DocumentItemEntity> objToDocF = obj -> {
                DocumentItemEntity res = new DocumentItemEntity();
                res.setQuestion(obj.toString());
                return res;
            };

            List<Object> features = documentItemRepository.findFeaturesByInputAndStatus(input, (short) 1);
            if (features.size() > 0) {
                result.addAll(features.stream().map(objToDocF).collect(Collectors.toList()));
            }

            if (result.size() < 5) {
                List<DocumentItemEntity> result1 = documentItemRepository.findAllByFeatureLikeOrQuestionLikeAndStatusOrderBySelectedCountDesc(input, (short) 1);
                result.addAll(result1);
                return result;
            }
        }

        return null;
    }
}
