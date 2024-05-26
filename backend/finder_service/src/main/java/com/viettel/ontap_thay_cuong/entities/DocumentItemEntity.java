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

    @ManyToOne()
    DocumentEntity document;

    @Column(name = "status")
    Short status;

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
}
