var dbSett = (function() {

  var database = firebase.database();
  var uid;



  function getTheUid() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          resolve(user.uid);
        }
      });
    });
  }

  function saveMainInfo(uid, obj) {
    return new Promise((resolve, reject) => {
      database.ref('users/' + uid + '/profile').set({
        name: obj.name,
        surname: obj.surname,
        contact_email: obj.contact_email,
        phone: obj.phone,
        location: obj.location
      }).then(() => {
        resolve();
      })
    })
  }

  function getMainInfo(uid) {
    return new Promise((resolve, reject) => {
      //get data from db
      //set object
      var user = firebase.database().ref('users/' + uid);
      user.on('value', (snapshot) => {
        const data = snapshot.val();
        resolve(data);
      });
    })
  }


  return {
    getTheUid: getTheUid,
    saveMainInfo: saveMainInfo,
    getMainInfo: getMainInfo
  }

})();