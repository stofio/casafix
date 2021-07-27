var onlineStatus = (function() {
  //https://console.firebase.google.com/u/0/project/casafix3-c5f9f/database/casafix3-c5f9f-default-rtdb/data/presence~2FYLaJymPNZ3SYIvavEMcgpMrDFhZ2

  var connected = firebase.database().ref('.info/connected');

  var isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  var isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  //here we set user online and offline
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

      var uid = firebase.auth().currentUser.uid;
      var userRef = firebase.database().ref('presence/' + uid);
      connected.on('value', function(snapshot) {
        if (snapshot.val()) {
          if (snapshot.val() == false) {
            return;
          };
          userRef.onDisconnect().set(isOfflineForDatabase).then(function() {
            userRef.set(isOnlineForDatabase);
          });
        }
      });
    }
  });



  //listen for state and return callback
  function statusListener(uid, callback) {
    var user = firebase.database().ref('presence/' + uid);
    user.on('value', snapshot => {
      if (snapshot.val()) {
        if (typeof callback === 'function') {
          callback(snapshot.val().state);
        }
      }

    });
  }

  function isOnline(uid, callback) {
    var user = firebase.database().ref('presence/' + uid);
    user.get().then(snapshot => {
      if (snapshot.val() == null) {
        callback('offline');
        return;
      }
      if (typeof callback === 'function') {
        callback(snapshot.val().state);
      }
    })
  }



  return {
    statusListener: statusListener,
    isOnline: isOnline
  }

})();