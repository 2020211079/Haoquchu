class User {
    constructor(obj) {
        if(obj){
            this.id = obj.id;
            this.username = obj.username;
            this.password = obj.password;
            this.isAdmin = obj.isAdmin;
            this.name = obj.name; //注册后完善
            this.identityType = obj.identityType; //注册后完善
            this.identity = obj.identity; //注册后完善
            this.tel = obj.tel; //注册后完善
            this.isVIP = obj.isVIP;
            this.memo = obj.memo; //注册后选填
            this.city = obj.city;
            this.createTime = obj.createTime;
            this.fixTime = obj.fixTime;
            this.avatar = obj.avatar; //注册后完善
        }
        else {
            this.id = null;
            this.username = null;
            this.password = null;
            this.isAdmin = null;
            this.name = null;
            this.identityType = null;
            this.identity = null;
            this.tel = null;
            this.isVIP = null;
            this.memo = null;
            this.city = null;
            this.createTime = null;
            this.fixTime = null;
            this.avatar = null;
        }
    }
}

class Request {
    constructor(obj) {
        if(obj){
            this.id = obj.id;
            this.userID = obj.userID;
            this.placeType = obj.placeType;
            this.title = obj.title;
            this.detail = obj.detail;
            this.image1 = obj.image1;
            this.image2 = obj.image2;
            this.video = obj.video;
            this.fee = obj.fee;
            this.createTime = obj.createTime;
            this.fixTime = obj.fixTime;
            this.endTime = obj.endTime;
            this.state = obj.state;
        }
        else {
            this.id = null;
            this.userID = null;
            this.placeType = null;
            this.title = null;
            this.detail = null;
            this.image1 = null;
            this.image2 = null;
            this.video = null;
            this.fee = null;
            this.createTime = null;
            this.fixTime = null;
            this.endTime = null;
            this.state = null;
        }
    }
}

class Welcome {
    constructor(obj) {
        if(obj){
            this.id = obj.id;
            this.requestID = obj.requestID;
            this.userID = obj.userID;
            this.detail = obj.detail;
            this.image1 = obj.image1;
            this.image2 = obj.image2;
            this.video = obj.video;
            this.createTime = obj.createTime;
            this.fixTime = obj.fixTime;
            this.state = obj.state;
        }
        else {
            this.id = null;
            this.requestID = null;
            this.userID = null;
            this.detail = null;
            this.image1 = null;
            this.image2 = null;
            this.video = null;
            this.createTime = null;
            this.fixTime = null;
            this.state = null;
        }
    }
}
export {
    User,
    Request,
    Welcome,
}