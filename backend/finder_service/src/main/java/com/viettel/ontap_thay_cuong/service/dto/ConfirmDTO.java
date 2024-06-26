package com.viettel.ontap_thay_cuong.service.dto;

import java.util.List;

public class ConfirmDTO {
    List<DocumentItemDTO> confirmQuestions;
    List<String> features;
    List<String> exploredFeatures;
    String question;
    boolean rejected;

    public List<DocumentItemDTO> getConfirmQuestions() {
        return confirmQuestions;
    }

    public void setConfirmQuestions(List<DocumentItemDTO> confirmQuestions) {
        this.confirmQuestions = confirmQuestions;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }

    public List<String> getExploredFeatures() {
        return exploredFeatures;
    }

    public void setExploredFeatures(List<String> exploredFeatures) {
        this.exploredFeatures = exploredFeatures;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public boolean isRejected() {
        return rejected;
    }

    public void setRejected(boolean rejected) {
        this.rejected = rejected;
    }
}
