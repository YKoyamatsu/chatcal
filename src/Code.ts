//ChatWorkのAPIトークン
const API_TOKEN: string = '1d5b3bba800c684b4853d1c747281e88';

//Googleカレンダーのパラメータ
const MY_CAL: Object = CalendarApp.getCalendarById("koyamatsuyuki@gmail.com");
const NS_CAL: Object = CalendarApp.getCalendarById("0e99rnvtc9voa7sam8qrnnh96g@group.calendar.google.com");
const G1_CAL: Object = CalendarApp.getCalendarById("aebkrthci3qfbh7p4lcis4vrg4@group.calendar.google.com");


function doPost(e) {
    try {
        //チャットワークからメッセージをjsonにparseする
        let json: any = JSON.parse(e.postData.contents);
        let roomId: any = json.webhook_event.room_id;
        let jsonBody: any = json.webhook_event.body;

        if (jsonBody.slice(0, 1) !== "[") {
            let accountId: any = json.webhook_event.account_id;
            let messagesId: any = json.webhook_event.message_id;

            //メッセージを配列に
            let bodyArray: any = jsonBody.split(',');

            //カレンダーにイベントを登録する際に使用するパラメータ
            let title:string = bodyArray[0];
            let startDay:string = bodyArray[1];
            let endDay:string = bodyArray[2];
            let place:string = bodyArray[3];

            //カレンダーにイベントを登録するためのオブジェクを生成
            let myCal = new Calender(MY_CAL);
            //let NACal = new Calender(NS_CAL);
            //let G1Cal = new Calender(G1_CAL);

            myCal.createSchedule(title, startDay, endDay, place);

            let chatwork = new ChatWork(roomId);
            chatwork.sendMessege(accountId, messagesId, '正常に登録できました');

        }
    } catch (ex) {
        console.log('error');
    }
}

//カレンダークラス(googleカレンダーでできる機能をここに詰め込む)
class Calender {
    constructor(private calId: any) {
        this.calId = calId;
    }
    public createSchedule(title: string, SDay: string, EDay: string, place: string) {
        //開始日の再定義GMT -04:00になってしまっていた。
        let startday = new Date(SDay);
        let startYear = startday.getFullYear();
        let startDate = startday.getDate();
        let startMonth = startday.getMonth();
        let startHour = startday.getHours() - 13;
        let startMinute = startday.getMinutes()
        let startSecond = startday.getSeconds();
        let startDay = new Date(startYear,startMonth,startDate,startHour,startMinute,startSecond);
        console.log(startDay);

        //終了日の再定義GMT -04:00になってしまっていた。
        let endday = new Date(EDay);
        let endYear = endday.getFullYear();
        let endDate = endday.getDate();
        let endMonth = endday.getMonth();
        let endHour = endday.getHours() - 13;
        let endMinute = endday.getMinutes()
        let endSecond = endday.getSeconds();
        let endDay = new Date(endYear,endMonth,endDate,endHour,endMinute,endSecond);
        console.log(endDay);

        let option = {
            location: place
        };
        this.calId.createEvent(title, startDay, endDay, option);
    }
}

//チャットワーククラス(チャットワークでできる機能をここに詰め込む)
class ChatWork {
    static url: string = "https://api.chatwork.com/v2";
    constructor(private roomID: string) {
        this.roomID = roomID;
    }
    public createUrl() {
        let chatWorkUrl: string = "";
        let sendBody: string = "";
        chatWorkUrl = `${ChatWork.url}/rooms/${this.roomID}/messages`;
        return chatWorkUrl;
    }
    public sendMessege(accountid: string, messageid: string, str: string): void {
        let chatWorkUrl: string = this.createUrl();
        let sendBody: string = "";
        let options = {
            'method': 'post',
            'headers': { 'X-ChatWorkToken': API_TOKEN },
            'payload': { 'body': str }
        };
        sendBody = `[rp aid=${accountid} to=${this.roomID}-${messageid}][info]${str}[/info]`;
        options.payload = { body: sendBody }
        UrlFetchApp.fetch(chatWorkUrl, options);
    }
}