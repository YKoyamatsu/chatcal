//ChatWorkのAPIトークン
const API_TOKEN:string = '1d5b3bba800c684b4853d1c747281e88';

//Googleカレンダーのパラメータ
const MY_CAL:Object = CalendarApp.getCalendarById("koyamatsuyuki@gmail.com");
const NS_CAL:Object = CalendarApp.getCalendarById("0e99rnvtc9voa7sam8qrnnh96g@group.calendar.google.com");
const G1_CAL:Object = CalendarApp.getCalendarById("aebkrthci3qfbh7p4lcis4vrg4@group.calendar.google.com");


function doPost(e){
    try{
        //チャットワークからメッセージをjsonにparseする
        let json = JSON.parse(e.postData.contents);
        let roomId = json.webhook_event.room_id;
        let jsonBody = json.webhook_event.body;
        let accountId = json.webhook_event.account_id;
        let messagesId = json.webhook_event.message_id;

        //メッセージを配列に
        let bodyArray = jsonBody.split(',');

        //カレンダーにイベントを登録する際に使用するパラメータ
        let title  = bodyArray[0];
        let startDay = bodyArray[1];
        let endDay = bodyArray[2];
        let location = bodyArray[3];

        //カレンダーにイベントを登録するためのオブジェクを生成
        let myCal = new Calender(MY_CAL);
        //let NACal = new Calender(NS_CAL);
        //let G1Cal = new Calender(G1_CAL);
        
        myCal.createSchedule(title,startDay,endDay,location);

        let chatwork = new ChatWork(roomId);
        chatwork.sendMessege(accountId,messagesId,'正常に登録できました');

    }catch(ex){
        console.log('error');
    }
}

//カレンダークラス(googleカレンダーでできる機能をここに詰め込む)
class Calender{
    constructor(private calId:any){
        this.calId = calId;
    }
    public createSchedule(title:string,startDay:string,endDay:string,location:string,){
        this.calId.createEvent(
            'title',
            new Date(startDay),
            new Date(endDay),
            {
                location:location,
            }
        );
    }
}
//チャットワーククラス(チャットワークでできる機能をここに詰め込む)
class ChatWork {
    static url:string = "https://api.chatwork.com/v2";
    constructor(private roomID:string){
        this.roomID = roomID;
    }
    public createUrl(){
        let chatWorkUrl:string = "";  
        let sendBody:string = ""; 
        chatWorkUrl = `${ChatWork.url}/rooms/${this.roomID}/messages`;
        return chatWorkUrl;
    }
    public sendMessege(accountid:string,messageid:string,str:string):any{
        let sendStr:any = "";  
        let chatWorkUrl:string = this.createUrl();  
        let sendBody:string = "";
        let options = {
            'method': 'post',
            'headers': {'X-ChatWorkToken' : API_TOKEN},
            'payload': {'body' : str}
          };

          sendBody = `[rp aid=${accountid}; to=${this.roomID} - ${messageid} [info]:${str}[/info]`;
          options.payload = {body: sendBody}
        
          sendStr = UrlFetchApp.fetch(chatWorkUrl, options);
        return sendStr.getContentText();
    }
}