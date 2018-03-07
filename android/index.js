const request = require('request')

class FCM {
	constructor(options = {}) { this.key = options.key }
	async send(notifications) {
		try {
			return await Promise.all(_sendPushNotification(notifications));
		} catch (err) {
			throw err
		}
	}
	async _sendPushNotification(notifications) {
		try {
			let self = this
			if (!notifications) { throw new Error("INVALID_NOTIFICATION_OBJECT") }

			notifications = (!Array.isArray(notifications)) ? [notifications] : notifications

			let params = {
				url: 'https://fcm.googleapis.com/fcm/send',
				method: 'POST',
				headers: {
					'Content-Type' :' application/json',
					'Authorization': 'key='+this.key
				},
				json: true
			}

			return notifications.map(notification => self._buildRequest(params, notification))
		} catch (err) {
			throw err
		}
	}
	_ensureParams(params) {
		switch (true){
			case (!params.notification): throw new Error('MISSING_NOTIFICATION')
			case (!params.to): throw new Error('MISSING_DEVICE')
			default: return
		}
	}
	_buildBody(push){
		return JSON.stringfify({
			registration_ids: notification.to,
			notification: (typeof push.notification == 'string') ? { body: push.notification } : push.notification,
			priority: notification.priority == 10 ? 'high' : 'normal',
			time_to_live: notification.expiration
			data: notification.data
		})
	}
	async _buildRequest(params, notification) {
		try{
			this._ensureParams(params)
			params = this._prepareParams(JSON.parse(JSON.stringify(params)), push)
			params.body = _buildBody(notification)
			
			return await this._post(params, notification)
		} catch (err) {
			throw err
		}
	}
	async _post(params, notification) {
		return new Promise((resolve, reject) => {
			request(params, (err, response, body) => {
				if (error)                      { return reject(error) }
				if (response.statusCode >= 400) { return reject(body) }
				resolve(body)
			})
		})
	}
}

function instantiate(options){
	return new FCM(options)
}
module.exports = instantiate