# ScreenDoor

This is a React Native app compatible with Android and iOS. It simply allows users to post short formatted messages to a Firebase Realtime Database. When coupled with [ScreenDoorPi](https://github.com/djsc/ScreenDoorPi/), the last message posted will be displayed on a remote LCD connected to a Raspberry Pi. The status of ScreenDoorPi is displayed on the status screen based off of heartbeats stored in the database.

## Firebase Setup:
* Go to https://console.firebase.google.com/
* Add a project
* Add an app to the project: Dashboard -> Project settings -> General -> Add App -> Web. **Note the firebaseConfig for later**
* Dashboard -> Authentication -> Sign in method -> Email/Password -> Enable
* Dashboard -> Authentication -> Users -> Add user -> **Use this username and password inside app to log in**
* Dashboard -> Firestore Database -> Create database (locked mode) #This creates a Firestore database which we won't be using
* Dashboard -> Realtime Database  -> Rules -> Publish the following rules:
```
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "posts": {
        ".indexOn": "timePosted",
          "$postID": {
          	".validate": "newData.hasChildren(['text', 'timePosted', 'uuid']) &&
                newData.child('text').isString() &&
                newData.child('timePosted').isNumber() &&
                newData.child('uuid').isString()"
          }
        },
        "lastHeartbeat": {
          ".validate": "newData.isNumber()"
        }
      }
    }
  }
}
```

## Configuration
* Go to src/config/constants.tsx and add your Firebase Configuration object that was obtained earlier

## Build environment setup
* Install yarn: https://yarnpkg.com/en/docs/install
* Follow the steps in the React Native CLI Quickstart section on https://reactnative.dev/docs/environment-setup
* Install typescript globally: ```yarn global add typescript```

## Build project
* Install dependencies: ```yarn install```
* Transpile typescript: ```tsc```

## Run project on device
* iOS: ```react-native run-ios```
* Android: ```react-native run-android```
