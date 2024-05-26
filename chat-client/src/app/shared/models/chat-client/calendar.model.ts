import {CalendarDetailModel} from "./calendar-detail.model";

export class CalendarModel{
    calendarId = '-1';
    calendarName = '-1';
    description = '-1';
    createTime = -1;
    createBy = '-1';
    updateTime = -1;
    updateBy = '-1';
    status = -1;
    realmName = '-1';
    calendarType = -1;
    sourceId = '-1';
    channelId = -1;
    listCalendarTime: CalendarDetailModel[] = [];
}