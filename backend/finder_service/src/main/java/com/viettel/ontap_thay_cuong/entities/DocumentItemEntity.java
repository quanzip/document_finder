package com.viettel.ontap_thay_cuong.entities;

import javax.persistence.*;

@Entity
@Table(name = "document_item")
public class DocumentItemEntity {

    @Id
    @Column(name = "id")
    String id;

    @Column(name = "question")
    String question;

    @Column(name = "answer")
    String answer;

    @Column(name = "feature")
    String feature;

    @Column(name = "site_code")
    String siteCode;

    @ManyToOne()
    DocumentEntity document;

    @Column(name = "status")
    Short status;

    @Column(name = "selected_count")
    Integer selectedCount;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public DocumentEntity getDocument() {
        return document;
    }

    public void setDocument(DocumentEntity document) {
        this.document = document;
    }

    public String getFeature() {
        return feature;
    }

    public void setFeature(String feature) {
        this.feature = feature;
    }

    public Short getStatus() {
        return status;
    }

    public void setStatus(Short status) {
        this.status = status;
    }

    public String getSiteCode() {
        return siteCode;
    }

    public void setSiteCode(String siteCode) {
        this.siteCode = siteCode;
    }

    public Integer getSelectedCount() {
        return selectedCount;
    }

    public void setSelectedCount(Integer selectedCount) {
        this.selectedCount = selectedCount;
    }
}
