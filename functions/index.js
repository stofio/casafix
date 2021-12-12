/* eslint-disable eol-last */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.checkOnLoginIfRegistered = functions.https.onCall((data, context) => {
  const accounts = admin.firestore().collection("registered_accounts");
  return accounts.doc(data.uid).get().then((doc) => {
    if (!doc.data()) {
      admin.auth().deleteUser(data.uid);
      throw new functions.https.HttpsError("not-found", "user doesnt exist");
    }
  });
});

exports.getUserIfRegistered = functions.https.onCall((data, context) => {
  return new Promise((resolve, reject) => {
    const accounts = admin.firestore().collection("registered_accounts");
    accounts.doc(data.uid).get().then((doc) => {
      resolve(doc.data());
    });
  });
});

exports.setUserEmailVerified = functions.https.onCall((data, context) => {
  return new Promise((resolve, reject) => {
    admin.auth().updateUser(data.uid, {
        emailVerified: true,
      })
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of `userRecord`.
        console.log("Successfully updated user", userRecord.toJSON());
        resolve("Successfully updated user", userRecord.toJSON())
      })
  });
});