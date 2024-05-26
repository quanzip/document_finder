package com.viettel.ontap_thay_cuong.entities;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "message")
public class MessageEntity implements Serializable {

    @Id
    @Column(name = "id")
    String id;

    @Basic
    @Column(name = "conversation_id")
    String conversationId;

    @Basic
    @Column(name = "author_type")
    String authorType;

    @Basic
    @Column(name = "author_id")
    String authorId;

    @Basic
    @Column(name = "received_at")
    Long receivedAt;

    @Basic
    @Column(name = "type")
    Integer type;

    @Basic
    @Column(name = "content")
    String content;

    @Basic
    @Column(name = "content_extra")
    String contentExtra;

    @Basic
    @Column(name = "file_size")
    String fileSize;

    @Basic
    @Column(name = "file_url")
    String fileUrl;

    @Basic
    @Column(name = "file_name")
    String fileName;

    @Basic
    @Column(name = "service_id")
    String serviceId;

    @Basic
    @Column(name = "integration_id")
    String integrationId;

    @Basic
    @Column(name = "original_message_id")
    String originalMessageId;

    @Basic
    @Column(name = "original_message_timestamp")
    String originalMessageTimestamp;

    @Basic
    @Column(name = "deleted")
    boolean deleted;

    @Basic
    @Column(name = "quoted_message")
    String quotedMessage;

    @Basic
    @Column(name = "channel_id")
    Short channelId;

    @Basic
    @Column(name = "reply_to")
    String replyTo;

    @Basic
    @Column(name = "request_time")
    Long requestTime;

    @Basic
    @Column(name = "chatbot_history")
    String chatbotHistory;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public String getAuthorType() {
        return authorType;
    }

    public void setAuthorType(String authorType) {
        this.authorType = authorType;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public Long getReceivedAt() {
        return receivedAt;
    }

    public void setReceivedAt(Long receivedAt) {
        this.receivedAt = receivedAt;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContentExtra() {
        return contentExtra;
    }

    public void setContentExtra(String contentExtra) {
        this.contentExtra = contentExtra;
    }

    public String getFileSize() {
        return fileSize;
    }

    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getIntegrationId() {
        return integrationId;
    }

    public void setIntegrationId(String integrationId) {
        this.integrationId = integrationId;
    }

    public String getOriginalMessageId() {
        return originalMessageId;
    }

    public void setOriginalMessageId(String originalMessageId) {
        this.originalMessageId = originalMessageId;
    }

    public String getOriginalMessageTimestamp() {
        return originalMessageTimestamp;
    }

    public void setOriginalMessageTimestamp(String originalMessageTimestamp) {
        this.originalMessageTimestamp = originalMessageTimestamp;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public String getQuotedMessage() {
        return quotedMessage;
    }

    public void setQuotedMessage(String quotedMessage) {
        this.quotedMessage = quotedMessage;
    }

    public Short getChannelId() {
        return channelId;
    }

    public void setChannelId(Short channelId) {
        this.channelId = channelId;
    }

    public String getReplyTo() {
        return replyTo;
    }

    public void setReplyTo(String replyTo) {
        this.replyTo = replyTo;
    }

    public Long getRequestTime() {
        return requestTime;
    }

    public void setRequestTime(Long requestTime) {
        this.requestTime = requestTime;
    }

    public String getChatbotHistory() {
        return chatbotHistory;
    }

    public void setChatbotHistory(String chatbotHistory) {
        this.chatbotHistory = chatbotHistory;
    }
}
