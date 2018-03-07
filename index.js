class BothDevices {
	constructor(iosOptions = {}, androidOptions) {
		this.ios     = require('../ios/')(iosOptions)
		this.android = require('../android/')(androidOptions)
	}

	async send(notifications, devices) {
		try {
			let promises = {}

			prepareNotification(promises, 'ios', notifications, devices)
			prepareNotification(promises, 'android', notifications, devices)

			if (Object.keys(promises).length == 0) { throw new Error("MISSING_DEVICE_TOKENS") }
			
			return await _objectPromiseAll(promises)
		} catch (err) {
			throw err
		}
	}

	async prepareNotification(promises, type, notifications, devices) {
		try {
			if (devices.hasOwnProperty(type)) {
				let tmpPush    = JSON.parse(JSON.stringify(notifications))

				tmpPush.to     = devices[type] 
				promises[type] = this[type].send(tmpPush)
			}
		} catch (err) {
			throw err
		}
	}

	async _objectPromiseAll(promise) {
		try {
			const results = await Promise.all(Object.values(promise))
			
			let obj = {}
			Object.keys(promise).map((key, index) => obj[key] = results[index])

			return obj
		} catch(err) {
			return err
		}
	}
}

module.exports = (iosOptions, androidOptions) => new BothDevices(iosOptions, androidOptions)