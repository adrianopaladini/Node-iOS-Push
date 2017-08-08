# Push module for Nodejs

Created by Adriano Paladini, a Breaking Bug member.

### Prerequisite

To use these libs, node must be v6 or higher, and the project need two modules, *"http2"* for iOS and *"request"* for Android. To install these modules in your project, use:

> npm install http2 request --save

### Installation

> Copy files from *"libs"* folder to your project


## Use for iOS

### Create Client

Client using .p12 and password
```javascript
const APNS = require('./lib/apns');
const apnsClient = new APNS({
    p12: '/path/to/Certificate.p12',
    password: 'test',
    bundle: 'com.yourapp.bundle'
});
```

Client using cert and key in .pem extension
```javascript
const APNS = require('./lib/apns');
const apnsClient = new APNS({
    cert: '/path/to/Certificate.pem',
    key: '/path/to/PrivateKey.pem',
    bundle: 'com.yourapp.bundle'
});
```

To convert p12 to pem file, use this command in terminal:
> openssl pkcs12 -in Certificate.p12 -out Certificate.pem -nodes -clcerts

### Sending Push Notification

```javascript

const notification = {
    'aps':{badge:3, sound:"bingbong.aiff"},
    'notification' : {title:"Foo", body:"Bar"},
    'priority' : 5,
    'expiration' : 0,
    'to': 'DEVICE_ID'
}

apnsClient.send(notification).then((res) => {
    console.log("Response  " + res);
}).catch((err) => {
    console.log('Error: ' + err);
});
```

## Use for Android

### Create Client
```javascript
const FCM = require('./lib/fcm');
const fcmClient = new FCM({
    key: 'FCM_KEY'
});
```

### Sending Push Notification

```javascript

const notification = {
    'notification' : {title:"Foo", body:"Bar"},
    'priority' : 5,
    'expiration' : 0,
    'to': ['DEVICE_ID','DEVICE_ID']
}

fcmClient.send(notification).then((res) => {
    console.log("Response  " + res);
}).catch((err) => {
    console.log('Error: ' + err);
});
```
