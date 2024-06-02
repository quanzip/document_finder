package com.viettel.ontap_thay_cuong.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "customer_waiting_question")
public class CustomerWaitingQuestionEntity {
    @Id
    String id;

    @Column(name = "question")
    String question;

    @Column(name = "confirm_options")
    String confirmOptions;

    @Column(name = "site_code")
    String siteCode;

    @Column(name = "create_date")
    String createDate;

    @Column(name = "update_date")
    String updateDate;

    @Column(name = "update_by")
    String updateBy;

    @Column(name = "create_by")
    String createBy;

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

    public String getConfirmOptions() {
        return confirmOptions;
    }

    public void setConfirmOptions(String confirmOptions) {
        this.confirmOptions = confirmOptions;
    }

    public String getSiteCode() {
        return siteCode;
    }

    public void setSiteCode(String siteCode) {
        this.siteCode = siteCode;
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }

    public String getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(String updateDate) {
        this.updateDate = updateDate;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }
}
