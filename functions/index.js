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