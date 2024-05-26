export class CalendarDetailModel {
    calendarTimeId = -1;
    calendarId = -1;  // doi chieu de truy van trong bang calendar detail
    day = -1; // thu trong tuan
    fromHour = 0;
    fromMinute = 0;
    toHour = 23;
    toMinute = 59;
    status = -1;
    type = 1; // 1 trong gio hanh chinh, 2: ngoai gio hanh chinh
    fromSecond = 0;
    toSecond = 59;
    createTime = -1;
    createBy = "ipcc dev";
    updateTime = -1;
    updateBy = "ipcc test";
}