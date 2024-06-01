package com.viettel.ontap_thay_cuong.service.dto;

public class ContentDTO {
    String stepContent;
    String stepName;
    String stepCode;
    String stepReference;  // to stepCode
    String[] stepFileNames;
    String[] stepFileSize;
    String[] stepFileUrls;

    public String getStepContent() {
        return stepContent;
    }

    public void setStepContent(String stepContent) {
        this.stepContent = stepContent;
    }

    public ContentDTO stepContent(String content) {
        this.stepContent = content;
        return this;
    }

    public static ContentDTO Builder(){
        return new ContentDTO();
    }

    public String getStepName() {
        return stepName;
    }

    public void setStepName(String stepName) {
        this.stepName = stepName;
    }

    public ContentDTO stepName(String stepName) {
        this.stepName = stepName;
        return this;
    }

    public String getStepCode() {
        return stepCode;
    }

    public void setStepCode(String stepCode) {
        this.stepCode = stepCode;
    }

    public ContentDTO stepCode(String stepCode) {
        this.stepCode = stepCode;
        return this;
    }

    public String getStepReference() {
        return stepReference;
    }

    public void setStepReference(String stepReference) {
        this.stepReference = stepReference;
    }

    public ContentDTO stepReference(String stepReference) {
        this.stepReference = stepReference;
        return this;
    }

    public String[] getStepFileNames() {
        return stepFileNames;
    }

    public void setStepFileNames(String[] stepFileNames) {
        this.stepFileNames = stepFileNames;
    }

    public ContentDTO stepFileNames(String[] stepFileNames) {
        this.stepFileNames = stepFileNames;
        return this;
    }

    public String[] getStepFileSize() {
        return stepFileSize;
    }

    public void setStepFileSize(String[] stepFileSize) {
        this.stepFileSize = stepFileSize;
    }

    public ContentDTO stepFileSize(String[] stepFileSize) {
        this.stepFileSize = stepFileSize;
        return this;
    }

    public String[] getStepFileUrls() {
        return stepFileUrls;
    }

    public void setStepFileUrls(String[] stepFileUrls) {
        this.stepFileUrls = stepFileUrls;
    }

    public ContentDTO stepFileUrls(String[] stepFileUrls) {
        this.stepFileUrls = stepFileUrls;
        return this;
    }

    @Override
    public String toString() {
        return "ContentDTO{" +
                "stepContent='" + stepContent + '\'' +
                ", stepName='" + stepName + '\'' +
                ", stepCode='" + stepCode + '\'' +
                ", stepReference='" + stepReference + '\'' +
                '}';
    }
}
