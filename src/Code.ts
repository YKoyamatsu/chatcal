//ChatWorkのAPIトークン
const API_TOKEN:string = '1d5b3bba800c684b4853d1c747281e88';

//Googleカレンダーのパラメータ
const MY_CAL:Object = CalendarApp.getCalendarById("koyamatsuyuki@gmail.com");
const NS_CAL:Object = CalendarApp.getCalendarById("0e99rnvtc9voa7sam8qrnnh96g@group.calendar.google.com");
const G1_CAL:Object = CalendarApp.getCalendarById("aebkrthci3qfbh7p4lcis4vrg4@group.calendar.google.com");


function doPost(e){
    try{
        let json = JSON.parse(e.postData.contents);

        let roomId = json.webhook_event.room_id;
        
    }catch(ex){
        console.log('error');
    }
}

class ChatWork {
    static url:string = "https://api.chatwork.com/v2";
    constructor(private roomID:string){
        this.roomID = roomID;
    }
    public createUrl(){
        let chatWorkUrl:string = "";   
        chatWorkUrl = `${ChatWork.url}/rooms/${this.roomID}/messages`;
        return chatWorkUrl;
    }
    public sendMessege(str:string):any{
        let chatWorkUrl:string = "";
        let sendStr:any = "";  
        chatWorkUrl = this.createUrl();  

        let options = {
            'method': 'post',
            'headers': {'X-ChatWorkToken' : API_TOKEN},
            'payload': {'body' : str}
          };
        sendStr = UrlFetchApp.fetch(chatWorkUrl, options);
        return sendStr.getContentText();
    }
}