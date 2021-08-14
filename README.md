# ScreenDoor

This is a React Native app compatible with Android and iOS. It simply allows users to post short formatted messages to a Firebase Realtime Database. When coupled with [ScreenDoorPi](https://github.com/djsc/ScreenDoorPi/), the last message posted will be displayed on a remote LCD connected to a Raspberry Pi. The status of ScreenDoorPi is displayed on the status screen based off of heartbeats stored in the database. Images: [1](images/sdoorpi1.jpg) [2](images/sdoor1.png) [3](images/sdoor2.png) [4](images/sdoor3.png) [5](images/sdoor4.png) [6](images/sdoor5.png)

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
* Create a .env file in the project's root directory to store your Firebase configuration
* Copy and paste the following into the file. Insert the constants that were obtained earlier in the instructions. The constants should be inside the quotes.
  ```
    FIREBASE_API_KEY=''
    FIREBASE_AUTH_DOMAIN=''
    FIREBASE_DATABASE_URL=''
    FIREBASE_PROJECT_ID=''
    FIREBASE_STORAGE_BUCKET=''
    FIREBASE_MESSAGING_SENDER_ID=''
    FIREBASE_APP_ID=''
  ```

## Build environment setup
* Install yarn: https://yarnpkg.com/en/docs/install
* Follow the steps in the React Native CLI Quickstart section on https://reactnative.dev/docs/environment-setup
* Install typescript globally: ```yarn global add typescript```

## Build project
* Install dependencies: ```yarn install```
* Transpile typescript: ```tsc```

## Run project on device
* iOS: ```npx react-native run-ios```
* Android: ```npx react-native run-android```
