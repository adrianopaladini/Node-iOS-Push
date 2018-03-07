
notify = function(pem_or_key, payload) {    
    let exec = require('child_process').exec;
    var args = "";
    if (pem_or_key.indexOf('.pem')==-1) {
        let sendData = {"registration_ids":payload.to,"notification":payload.notification,"data":payload.data}
        args = "https://fcm.googleapis.com/fcm/send -H 'Content-Type: application/json' -H 'Authorization: key="+pem_or_key+"' -d '"+JSON.stringify(sendData)+"'";
    } else {
        let fs = require('fs');
        let pem = fs.readFileSync(pem_or_key,'ascii');
        let bundle = pem.split('UID=')[1].split('/CN=')[0];

        let sendData = payload.data;
        sendData["aps"] = {
            alert: payload.notification,
            sound: payload.sound,
            badge: payload.badge
        };
        args = " -v -d '"+JSON.stringify(sendData)+"' -H \"apns-topic: "+bundle+"\" -H \"apns-priority: 10\" --http2 --cert "+pem_or_key+" https://api.development.push.apple.com/3/device/"+payload.to;
    }
    exec('curl ' + args, function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        } else {
            console.log('APNS successfully send');
        }
    });
};
module.exports = notify;
