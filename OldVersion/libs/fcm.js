class FCM {
	constructor(options) {
        this.key = options.key;
    }
    send(notifications) {
        if (!Array.isArray(notifications)) {
             return this._sendToFcm(notifications);
         }
         var promises =  notifications.map((notification) => this._sendToFcm(notification).catch((err) => err));
         return Promise.all(promises);
    }
    _sendToFcm(notification) {
        if(!notification.to) return Promise.reject(new Error ("Device token missing"));
        return this.fcmPost(notification);
    }
    fcmPost(notification) {
    	return new Promise ((resolve, reject) => {
    		var request = require('request');
			const body = {};
	        body['registration_ids'] = notification.to;
	        body['notification'] = notification.notification;
	        body['priority'] = notification.priority == 10 ? 'high' : 'normal';
	        body['time_to_live'] = notification.expiration
	        for (const key in notification.data) {
	            if (key != 'to') {
	                body[key] = notification.data[key];
	            }
	        }
    		let options = {
				url: 'https://fcm.googleapis.com/fcm/send',
				method: 'POST',
				headers: {
					'Content-Type' :' application/json',
					'Authorization': 'key='+this.key
				},
	    		body: JSON.stringify(body)
	  		};
	    	request(options, function(error, response, body) {
			    if (error) {
			    	reject(error);
			    }
			    else if (response.statusCode >= 400) { 
			    	reject(body);
			    }
			    else {
			    	resolve(body);
			    }
			})
		});
    }
}
module.exports = FCM;