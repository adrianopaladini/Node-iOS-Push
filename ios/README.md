# IBM Push Notification (iOS Only) [WiP]

This module will allow you to send push notification to iOS devices without depending from other stuff.

## Prerequisite
Since this module uses features available after Node7, it is required of the module usage, so we decide to put the version used to build this module as starter:

* Node 7.10.0 or higher;

### Dependencies

Since this module communicate with other server it will install the module below:

* ![request@2.81.0](https://github.com/request/request)

## Installation

```npm install ibm-push-notification```

## Parameters

#### Initialization
Here follow the params used on the client initialization

| Property   | Type    | Required         | Description
| ---------- | ------- | ---------------- | -----------
| p12        | String  | Conditional True | The certificate used to allow the comunication with apple's server.<br>*Required if not using filename.pem files.*
| password   | String  | Conditional True | The password used to ensure the ownership of the p12 file.<br>*Required if not using filename.pem files.*
| cert       | String  | Conditional True | The certificate used to allow the comunication with apple's server.<br>*Required if not using filename.p12 file.*
| password   | String  | Conditional True | The private key used to ensure the ownership of the cert.pem file.<br>*Required if not using filename.p12 file.*
| bundle     | String  | True             | The bundle ID to identify your application
| production | Boolean | False            | Point to the Apple's production server (if true)

#### Notification
here follow the params used on the notification

| Property     | Type          | Required         | Description
| ------------ | ------------- | ---------------- | -----------
| aps          | Object        | True             | has to properties `{ badge: <Number>, sound: <String> }`
| notification | String/Object | True             | Message to be send on the push notification, can be just a string or if you want to set a title, you can use an object `{ title: 'Foo', body: 'Bar' }`.
| priority     | Number        | False            | Use `5` for Normal priority and `10` for high priority. If omitted, will be 5 by default.
| expiration   | Number        | False | A timestamp to define the expiration of the message (after that apple will stop to try to send the push
| to           | String/Array  | True             | The Device(s) that will receive the notification

## Usage
Here is an example for iOS usage only

#### Create the client
Below you can see several different ways to create your push client

###### Using .p12 with password
```javascript
const PushNotification = require('ibm-push-notification/ios')({
    p12: '/path/to/Certificate.p12',
    password: 'test',
    bundle: 'com.yourapp.bundle'
})
```

###### Using openssl certificates with password
```javascript
const PushNotification = require('ibm-push-notification/ios')({
    cert: '/path/to/cert.pem',
    key: '/path/to/key.pem',
    bundle: 'com.yourapp.bundle'
})
```

##### Tips
To convert the p12 into .pem files and avoid to put the key on the code / server

```shell
# To create just the certificate
openssl pkcs12 -in path.p12 -out cert.pem -clcerts -nokeys

# To create just the private key
openssl pkcs12 -in path.p12 -out key.pem -nocerts -nodes

# To create the certificate and the key in the same file
openssl pkcs12 -in path.p12 -out filename.pem
```
> **PS:** When you execute the command the password of the path.p12 file will be requested

### Send the Push Notification
After create the client for the push notification, you can send it anytime following the examples below:

#### One device only
Here is an example about how to send the notification to one device only

###### Only Mandatory Params
```javascript
const PushNotification = require('ibm-push-notification/ios')({
    cert: '/path/to/cert.pem',
    key: '/path/to/cert.pem',
    bundle: 'com.yourapp.bundle'
})

async function sendNotification(message) {
    try {    
        return await PushNotification.send({
            notification: message,
            to: <DEVICE_ID>  
        })
    } catch (err) {
        throw err
    }
}
```

###### Custom Properties
```javascript
const PushNotification = require('ibm-push-notification/ios')({
    cert: '/path/to/cert.pem',
    key: '/path/to/cert.pem',
    bundle: 'com.yourapp.bundle'
})

async function sendNotification(message) {
    try {    
        return await PushNotification.send({
            aps: { badge:3, sound:"bingbong.aiff" },
            notification: { title: "Foo", body: "Bar" },
            priority: 5,
            expiration: 0,
            to: <DEVICE_ID>
        })
    } catch (err) {
        throw err
    }
}
```

#### Multiple devices
Here is an example about how to send the notification to multiple devices (same message)

###### Only Mandatory Params
```javascript
const PushNotification = require('ibm-push-notification/ios')({
    cert: '/path/to/cert.pem',
    key: '/path/to/cert.pem',
    bundle: 'com.yourapp.bundle'
})

async function sendNotification(message) {
    try {    
        return await PushNotification.send({
            notification: message,
            to: [<DEVICE_ID_1>, <DEVICE_ID_2>]
        })
    } catch (err) {
        throw err
    }
}
```

###### Custom Properties
```javascript
const PushNotification = require('ibm-push-notification/ios')({
    cert: '/path/to/cert.pem',
    key: '/path/to/cert.pem',
    bundle: 'com.yourapp.bundle'
})

async function sendNotification(message) {
    try {    
        return await PushNotification.send({
            aps: { badge:3, sound:"bingbong.aiff" },
            notification: { title: "Foo", body: "Bar" },
            priority: 5,
            expiration: 0,
            to: [<DEVICE_ID_1>, <DEVICE_ID_2>]
        })
    } catch (err) {
        throw err
    }
}
```