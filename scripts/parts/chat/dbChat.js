var dbChat = (function() {

  var database = firebase.firestore();
  var storage = firebase.storage();

  //get single chat with someone by uid




  function getRooms() {
    return new Promise((resolve, reject) => {
      resolve([]);
      //order last_message_time asc
    })
  }

  //resolve bool - check if both uid exists
  function checkIfRoomUidValid(roomUid) {
    return new Promise((resolve, reject) => {
      var uids = roomUid.split('-');
      database.collection('registered_accounts').doc(uids[0])
        .get()
        .then(snapshot => {
          if (snapshot.exists) {
            database.collection('registered_accounts').doc(uids[1])
              .get()
              .then(snapshot => {
                if (snapshot.exists) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              });
          } else {
            resolve(false);
          }
        });
    })
  }

  function getReceiverInfo(uid) {
    return new Promise((resolve, reject) => {
      _getUserRole(uid)
        .then(userRole => {
          database.collection(userRole).doc(uid).get()
            .then((doc) => {
              const data = doc.data();
              var obj = {
                imgUrl: data.profile.prof_img_url,
                name: data.profile.name + ' ' + data.profile.surname
              }
              resolve(data);
            });
        })
        .catch(e => {
          console.log(e)
        })
    })
  }

  function getFullChat(roomId) {
    console.log(roomId)
    return new Promise((resolve, reject) => {
      database.collection('rooms').doc(roomId).collection('messages').get()
        .then(snapshot => {
          var messagesArr = snapshot.docs.map(doc => doc.data());
          console.log(messagesArr)
          resolve(messagesArr);
        })
        .catch(e => {
          console.log(e)
        })
    })
  }



  function _getUserRole(uid) {
    return new Promise((resolve, reject) => {
      database.collection('registered_accounts').doc(uid).get()
        .then((doc) => {
          const data = doc.data();
          resolve(data._role);
        })
        .catch(e => {
          console.log(e)
        })
    })
  }



  function getMyRooms() {
    return new Promise((resolve, reject) => {
      database.collection('rooms').get()
        .then(snapshot => {
          var roomsArr = snapshot.docs.map(doc => {
            return {...doc.data(), id: doc.id }
          });
          resolve(roomsArr);
        });
    })
  }

  function createRoom(roomId) {

  }

  function sendMessage(objMessage) {
    _updateRoomMessages(objMessage);
    _updateUsersMessages(objMessage)
  }


  function _updateRoomMessages(objMessage) {
    var batch = database.batch();

    console.log(objMessage.roomId)
    var room = database.collection('rooms').doc(objMessage.roomId);
    batch.set(room, {
      lastMessage: objMessage.text,
      lastMessageTime: objMessage.time,
    });


    var messages = database.collection('rooms').doc(objMessage.roomId);
    batch.set(messages, {
      _type: objMessage._type,
      senderName: objMessage.senderName,
      senderImgUrl: objMessage.senderImgUrl,
      senderUid: objMessage.senderUid,
      time: objMessage.time,
      text: objMessage.text,
    });


    batch.commit().then(() => {
      // ...
    });

  }

  function _updateUsersMessages(objMessage) {
    console.log(objMessage)
    var batch = database.batch();

    var user1 = database.collection("messages_meta").doc(objMessage.senderUid);
    batch.set(user1, {
      roomId: objMessage.roomId,
      receiverUid: objMessage.receiverUid,
      receiverName: objMessage.receiverName,
      receiverImgUrl: objMessage.receiverImgUrl,
      receiverProfileUrl: objMessage.receiverProfileUrl,
      receiverRole: objMessage.receiverRole,
      receiverImgUrl: objMessage.receiverImgUrl,
      lastMessage: objMessage.text,
      lastMessageType: objMessage._type,
      lastMessageTime: objMessage.time,
    });

    var user2 = database.collection("messages_meta").doc(objMessage.receiverUid);
    batch.set(user2, {
      roomId: objMessage.roomId,
      senderUid: objMessage.receiverUid,
      senderName: objMessage.receiverName,
      senderImgUrl: objMessage.receiverImgUrl,
      senderProfileUrl: objMessage.receiverProfileUrl,
      senderRole: objMessage.receiverRole,
      senderImgUrl: objMessage.receiverImgUrl,
      lastMessage: objMessage.text,
      lastMessageType: objMessage._type,
      lastMessageTime: objMessage.time,
    });

  }


  function a() {
    //if room exist
  }







  return {
    getRooms: getRooms,
    checkIfRoomUidValid: checkIfRoomUidValid,
    getMyRooms: getMyRooms,
    getReceiverInfo: getReceiverInfo,
    sendMessage: sendMessage,
    getFullChat: getFullChat,
    createRoom: createRoom,
  }


})();