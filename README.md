# Push Notification (Hybrid [iOS and Android]) [WiP]

This module will allow you to send push notification to iOS and Android devices without depending from other stuff.

__This module aren't finished yet, we are building / testing it__

## Prerequisite
Since this module uses features available after Node7, it is required of the module usage, so we decide to put the version used to build this module as starter:

* Node 7.10.0 or higher;

### Dependencies

Since this module communicate with other server it will install the module below:

* [request@2.81.0](https://github.com/request/request)

## Installation

```npm install ibm-push-notification```

## Parameters

#### Initialization
Here follow the params used on the client initialization

| Property   | Type    | Required         | Description
| ---------- | ------- | ---------------- | -----------
| ios        | Object  | True             | Holds the initilization parameters used on ![iOS](https://github.com/adrianopaladini/Node-iOS-Push/tree/master/ios#create-the-client)
| android    | Object  | True             | Holds the initilization parameters used on ![Android](https://github.com/adrianopaladini/Node-iOS-Push/tree/master/android#create-the-client)

#### Notification
The notification parameters will be the same defined on iOS / Android individually (but since iOS has more parameters than android, consider to use iOS model):

* [iOS](https://github.com/adrianopaladini/Node-iOS-Push/tree/master/ios#send-the-push-notification)
* [Android](https://github.com/adrianopaladini/Node-iOS-Push/tree/master/android#send-the-push-notification)

## Usage
This module allow you to work with both notifications or if you are working with just one platform (android/ios) you can require just what u 

* [iOS](https://github.com/adrianopaladini/Node-iOS-Push/tree/master/ios)
* [Android](https://github.com/adrianopaladini/Node-iOS-Push/tree/master/android)
* Hybrid, just keep reading :D 

#### Create the client
Below you can see several different ways to create your push client

```javascript
//Read the ios readme for more details about possibilities when initializing a client.
const ios = {
    p12: '/path/to/Certificate.p12',
    password: 'test',
    bundle: 'com.yourapp.bundle'
}
const android = {
    key: 'here-goes-your-google-client-key'
}

const PushNotification = require('ibm-push-notification')({ ios, android })
```

### Send the Push Notification
After create the client for the push notification, you can send it anytime following the examples below:

#### One device only
Here is an example about how to send the notification to one device only

###### Only Mandatory Params
```javascript
const ios = {
    p12: '/path/to/Certificate.p12',
    password: 'test',
    bundle: 'com.yourapp.bundle'
}
const android = {
    key: 'here-goes-your-google-client-key'
}
const PushNotification = require('ibm-push-notification')({ ios, android })

async function sendNotification(message) {
    try {    
        return await PushNotification.send({
            notification: message
        }, { ios: <DEVICE_ID>, android: <DEVICE_ID> })
    } catch (err) {
        throw err
    }
}
```

###### Custom Properties
```javascript
const ios = {
    p12: '/path/to/Certificate.p12',
    password: 'test',
    bundle: 'com.yourapp.bundle'
}
const android = {
    key: 'here-goes-your-google-client-key'
}
const PushNotification = require('ibm-push-notification')({ ios, android })

async function sendNotification(message) {
    try {    
        return await PushNotification.send({
            aps: { badge:3, sound:"bingbong.aiff" },
            notification: { title: "Foo", body: "Bar" },
            priority: 5,
            expiration: 0
        }, { ios: <DEVICE_ID>, android: <DEVICE_ID> })
    } catch (err) {
        throw err
    }
}
```

#### Multiple devices
Here is an example about how to send the notification to multiple devices (same message)

###### Only Mandatory Params
```javascript
const ios = {
    p12: '/path/to/Certificate.p12',
    password: 'test',
    bundle: 'com.yourapp.bundle'
}
const android = {
    key: 'here-goes-your-google-client-key'
}
const PushNotification = require('ibm-push-notification')({ ios, android })

async function sendNotification(message) {
    try {    
        return await PushNotification.send({
            notification: message
        }, { ios: [<DEVICE_ID_1>, <DEVICE_ID_2>], android: [<DEVICE_ID_3>, <DEVICE_ID_4>] })
    } catch (err) {
        throw err
    }
}
```

###### Custom Properties
```javascript
const ios = {
    p12: '/path/to/Certificate.p12',
    password: 'test',
    bundle: 'com.yourapp.bundle'
}
const android = {
    key: 'here-goes-your-google-client-key'
}
const PushNotification = require('ibm-push-notification')({ ios, android })

async function sendNotification(message) {
    try {    
        return await PushNotification.send({
            aps: { badge:3, sound:"bingbong.aiff" },
            notification: { title: "Foo", body: "Bar" },
            priority: 5,
            expiration: 0
        }, { ios: [<DEVICE_ID_1>, <DEVICE_ID_2>], android: [<DEVICE_ID_3>, <DEVICE_ID_4>] })
    } catch (err) {
        throw err
    }
}
```

## Authors

* **Adriano** - *Initial Work* - [adrianopaladini](https://github.com/adrianopaladini)
* **Night** - *Review and Improvements* - [niightly](https://github.com/niightly)





