const fs = require('fs')
const http2 = require('http2')

class APNS {
	constructor(options = {}) {
		this.options = {
			key: options.key ? fs.readFileSync(options.key) : null,
			cert: options.cert ? fs.readFileSync(options.cert) : null,
			p12: options.p12 ? fs.readFileSync(options.p12) : null,
			password: options.password,
			bundle: options.bundle,
			production: options.production ? options.production : false
		}
	}

	async send(notifications) {
		try {
			console.log(notifications, '16')
			return await Promise.all(_sendPushNotification(notifications, this.options));
		} catch (err) {
			throw err
		}
	}
}

async function _sendPushNotification(notifications, options) {
	try {
		let self = this
		if (!notifications) { throw new Error("INVALID_NOTIFICATION_OBJECT") }

		notifications = (!Array.isArray(notifications)) ? [notifications] : notifications
		let params = {
			method:     'POST',
			host:       (options.production) ? 'api.push.apple.com' : 'api.development.push.apple.com',
			port:       443,
			path:       '/3/device/',
			key:        (options.key) ? options.key : undefined,
			cert:       (options.cert) ? options.cert : undefined,
			pfx:        (options.p12) ? options.p12 : undefined,
			passphrase: (options.password) ? options.password: undefined,
			headers:    {
				'apns-topic': (options.bundle) ? options.bundle : undefined
			}
		}

		notifications = notifications.reduce((array, notification) => _splitNotifications(array, notification), [])

		return notifications.map(notification => _buildRequest(params, notifications))
	} catch (err) {
		console.log(err)
		throw err
	}
}

function _splitNotifications(array, notification) {
	if (!Array.isArray(notification.to)) { array.push(_remapNotification(notification.to, notification)) }
	else {
		for (const device in notification.to) {
			array.push(_remapNotification(device, notification))
		}
	}

	return array
}

function _remapNotification(device, push) {
	return {
		aps: (push.aps) ? push.aps : { badge: 0, sound: "default" },
		notification : (typeof push.notification == 'string') ? { body: push.notification } : push.notification,
		priority : (push.priority == 10) ? push.priority : 5,
		expiration : push.expiration,
		to: device
	}
}

function _prepareParams(params, notification) {
	params.path += notification.to
	params.headers = {
		'apns-priority': (notification.priority) ? notification.priority : 5,
		'apns-expiration': (notification.expiration) ? notification.expiration : 0
	}

	return params
}

function _ensureParams(params) {
	switch (true){
		case (!params.notification): throw new Error('MISSING_NOTIFICATION')
		case (!params.to): throw new Error('MISSING_DEVICE')
		default: return
	}
}

function _buildBody(push){
	const body = { aps: push.aps, data: push.data }
	body.aps.alert = push.notification
}

async function _buildRequest(params, notifications) {
	try{
		let pushs = []
		for (const notification of notifications) {
			_ensureParams(notification)
			params = _prepareParams(JSON.parse(JSON.stringify(params)), notification)
			let body = _buildBody(notification)
			
			return _post(body, params, notification)
		}           
	} catch (err) {
		throw err
	}
}

async function _post(body, params, notification) {
	return new Promise((resolve, reject) => {
		try {
			const req = http2.request(params, function(res) {
				const data = []

				res.on('data', function(chunks) { return data.push(chunks.toString('utf8')) })
				res.on('end', () => {
					res.body = data.join('')
					resolve({
						status: res.statusCode,
						body: (res.body != '') ? res.body : undefined
					})
				})
			})
			req.on('error', function(err) { reject(err) })
			req.write(JSON.stringify(body))
			req.end();
		} catch (err) {
			console.log(err)
			reject(err)
		}
	})
}

function instantiate(options) {
	return new APNS(options)
}

module.exports = instantiate