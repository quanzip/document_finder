package com.viettel.ontap_thay_cuong.service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;


@JsonInclude(Include.NON_NULL)
public class MessageSlimDTO implements Serializable {

    String id;

    String conversationId;

    String authorType;

    String authorId;

    String authorAvt;

    String authorName;

    Long receivedAt;

    @NotNull
    Integer type;

    List<ContentDTO> content;

    @Size(max = 3000)
    String contentExtra;

    List<Long> fileSize;

    List<String> fileUrl;

    List<String> fileName;

    String serviceId;

    String integrationId;

    String originalMessageId;

    String originalMessageTimestamp;

    boolean deleted;

    String quotedMessage;

    Short channelId;

    String replyTo;

    Long requestTime;

    String ticketId;

    String agentId;

    Short status;

    boolean containChatbotContent = false;

    boolean typing;

    boolean multiChannel = false;

    boolean userDefault = false;

    String chatbotHistory;

    String externalId;

    String surveyClientId;

    Long surveyFrequency;

    Short surveyFrequencyUnit;

    @JsonProperty("domainCode")
    String siteCode;

    public String getSiteCode() {
        return siteCode;
    }

    public void setSiteCode(String siteCode) {
        this.siteCode = siteCode;
    }

    public boolean isFromUser() {
        return (this.authorType != null && this.authorType.contains("user"));
    }

    public boolean isFromAgent() {
        return (this.authorType != null && this.authorType.contains("agent"));
    }

    public boolean isFromSystem() {
        return (this.authorType != null && this.authorType.contains("system"));
    }

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

    public String getAuthorAvt() {
        return authorAvt;
    }

    public void setAuthorAvt(String authorAvt) {
        this.authorAvt = authorAvt;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
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

    public List<ContentDTO> getContent() {
        return content;
    }

    public void setContent(List<ContentDTO> content) {
        this.content = content;
    }

    public String getContentExtra() {
        return contentExtra;
    }

    public void setContentExtra(String contentExtra) {
        this.contentExtra = contentExtra;
    }

    public List<Long> getFileSize() {
        return fileSize;
    }

    public void setFileSize(List<Long> fileSize) {
        this.fileSize = fileSize;
    }

    public List<String> getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(List<String> fileUrl) {
        this.fileUrl = fileUrl;
    }

    public List<String> getFileName() {
        return fileName;
    }

    public void setFileName(List<String> fileName) {
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

    public String getTicketId() {
        return ticketId;
    }

    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }

    public String getAgentId() {
        return agentId;
    }

    public void setAgentId(String agentId) {
        this.agentId = agentId;
    }

    public Short getStatus() {
        return status;
    }

    public void setStatus(Short status) {
        this.status = status;
    }

    public boolean isContainChatbotContent() {
        return containChatbotContent;
    }

    public void setContainChatbotContent(boolean containChatbotContent) {
        this.containChatbotContent = containChatbotContent;
    }

    public boolean isTyping() {
        return typing;
    }

    public void setTyping(boolean typing) {
        this.typing = typing;
    }

    public boolean isMultiChannel() {
        return multiChannel;
    }

    public void setMultiChannel(boolean multiChannel) {
        this.multiChannel = multiChannel;
    }

    public boolean isUserDefault() {
        return userDefault;
    }

    public void setUserDefault(boolean userDefault) {
        this.userDefault = userDefault;
    }

    public String getChatbotHistory() {
        return chatbotHistory;
    }

    public void setChatbotHistory(String chatbotHistory) {
        this.chatbotHistory = chatbotHistory;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getSurveyClientId() {
        return surveyClientId;
    }

    public void setSurveyClientId(String surveyClientId) {
        this.surveyClientId = surveyClientId;
    }

    public Long getSurveyFrequency() {
        return surveyFrequency;
    }

    public void setSurveyFrequency(Long surveyFrequency) {
        this.surveyFrequency = surveyFrequency;
    }

    public Short getSurveyFrequencyUnit() {
        return surveyFrequencyUnit;
    }

    public void setSurveyFrequencyUnit(Short surveyFrequencyUnit) {
        this.surveyFrequencyUnit = surveyFrequencyUnit;
    }

    @Override
    public String toString() {
        return "MessageSlimDTO{" +
                "id='" + id + '\'' +
                ", authorId='" + authorId + '\'' +
                ", authorAvt='" + authorAvt + '\'' +
                ", authorName='" + authorName + '\'' +
                ", receivedAt=" + receivedAt +
                ", type=" + type +
                ", content='" + content + '\'' +
                ", contentExtra='" + contentExtra + '\'' +
                '}';
    }
}
