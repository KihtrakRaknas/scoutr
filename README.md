# scoutr
A Scouting App for Vex Robotics Teams. 
This was made with React Native and uses the Vex DB API to get competition and team information. 
All user generated data is safely stored on Firebase Firestore. 
There is a progressive web app to accommodate those who don't have stroage space to download app.

## Updating the Scouting Questions
Every year the robotics game changes so the questions that matter when scouting change as well.

I no longer have a personal need for this app, but this repo will remain open to pull requests. 
Esspeciallaly so the scouting questions can be updated.

### Process
The scouting questions are all in the `TeamInfo.js` file. 
The questions are written in JSX (which is very similar to HTML) so it should be pretty easy to understand how to edit and make new scouting questions based on the existing questions.
Specifically, the questions can be found in the render function.

### Testing
Run `npm start` to start the development server

### Publish
- `npm deploy` to deploy the web app
- `expo publish` to push a OTA update to existing apps
- `expo build:ios` to build the iOS ipa
- `expo build:android` to build the Android release
