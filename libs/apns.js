class APNS {
    constructor(options) {
        const fs = require('fs');
        this.key = options.key ? fs.readFileSync(options.key) : null;
        this.cert = options.cert ? fs.readFileSync(options.cert) : null;
        this.p12 = options.p12 ? fs.readFileSync(options.p12) : null;
        this.password = options.password;
        this.bundle = options.bundle;
        this.production = options.production ? options.production : false;
    }
    send(notifications) {
        if (!Array.isArray(notifications)) {
             return this._sendToApns(notifications);
         }
         var promises =  notifications.map((notification) => this._sendToApns(notification).catch((err) => err));
         return Promise.all(promises);
    }
    _sendToApns(notification) {
        if(!notification.to) return Promise.reject(new Error ("Device token missing"));
        const options = {};
        if (this.key) {
            options.key = this.key;
        }
        if (this.cert) {
            options.cert = this.cert;
        }
        if (this.p12) {
            options.pfx = this.p12;
        }
        if (this.password) {
            options.passphrase = this.password;
        }
        options.path = '/3/device/'+notification.to;
        options.method = 'POST';
        options.headers = {};
        if (this.bundle) {
            options.headers['apns-topic'] = this.bundle; 
        }
        if (notification.priority) {
            options.headers['apns-priority'] = notification.priority;
        }
        if (notification.expiration != undefined) {
            options.headers['apns-expiration'] = notification.expiration;
        }
        return this.post(options, notification);
    }
    post(options,notification) {
        const http2 = require('http2');
        if (!options) return Promise.reject(new Error ('Options can not be empty'));
        options.method = 'POST';
        if (this.production) {
            options.host = 'api.push.apple.com';
        } else {
            options.host = 'api.development.push.apple.com';
        }
        options.port = 443;
        const body = {};
        body['aps'] = notification.aps ? notification.aps : {badge:0,sound:"default"};
        body['aps']['alert'] = notification.notification;
        for (const key in notification.data) {
            if (key != 'to') {
                body[key] = notification.data[key];
            }
        }
        return new Promise ((resolve, reject) => {
                const req = http2.request(options, res => {
                const data = [];
                res.on('data', (chunks) => {
                    data.push(chunks.toString('utf8'));
                });
                res.on('end', () => {
                    res.body = data.join('');
                    var result = {};
                    result.status = res.statusCode;
                    if (res.body != '') {
                        result.body = res.body;
                    };
                    resolve(result);
                })
            });
            req.on('error', (err) => {
                reject(err);
            });
            if (body) {
                req.write(JSON.stringify(body));
            }
            req.end();
        });
    }
}
module.exports = APNS;
