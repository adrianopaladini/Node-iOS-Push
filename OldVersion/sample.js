

// Load libs
let APNS = require('./libs/apns');
let FCM = require('./lib/fcm');


// Data for iOS
const options_ios = {
	'aps':{badge:0, sound:"default"},
	'notification' : "Teste", //{title:"Foo", body:"Bar"},
	//'data' : {<CUSTOM_KEY>:<CUSTOM_VALUE>},
	'priority' : 10,
	'expiration' : 0,
	'to': '1EDF97CD83BCF4A416EA55CAA47447533AE5D9286040E49AEF6A896A18290302'
}

// Data for Android
const options_android = {
	'notification' : {title:"Foo", body:"Bar"},
	'data' : {<CUSTOM_KEY>:<CUSTOM_VALUE>},
	'priority' : 5,
	'expiration' : 0,
	'to': ['<DEVICE_ID>']
}


// Init for iOS
const apnsClient = new APNS({
	p12: __dirname+'/visitors.p12',
	password: 'ibm4you1',
	//cert: __dirname+'/visitors.pem',
	//key: __dirname+'/visitors.pem',
    bundle: 'com.adrianopaladini.sampletest',
	production: true
});

// Init for Android
const fcmClient = new FCM({
	key:'<FCM_KEY>'
});



// Send Notification for iOS
apnsClient.send(options_ios).then((res) => {
	console.log('APNS Response ' + JSON.stringify(res));
}).catch((err) => {
	console.log('APNS Error: ' + err);
});


// Send Notification for Android
fcmClient.send(options_android).then((res) => {
	console.log('FCM Response ' + JSON.stringify(res));
}).catch((err) => {
	console.log('FCM Error: ' + err);
});


