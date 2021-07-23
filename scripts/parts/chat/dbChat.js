var dbChat = (function() {

  var database = firebase.firestore();
  var storage = firebase.storage();


  function getRooms() {
    return new Promise((resolve, reject) => {
      resolve([]);
      //order last_message_time asc
    })
  }

  //resolve bool - check if both uid exists
  function checkIfRoomIdValid(roomUid) {
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

  function getUserInfo(uid) {
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
    return new Promise((resolve, reject) => {
      database.collection('rooms').doc(roomId).collection('messages').orderBy("time", "asc").get()
        .then(snapshot => {
          var messagesArr = snapshot.docs.map(doc => doc.data());
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


  function getMyRooms(uid) {
    return new Promise((resolve, reject) => {
      database.collection('messages_meta').doc(uid).collection('my_rooms').get()
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

  function sendMessage(objMessageInfo) {
    _updateRoomAndSaveMessage(objMessageInfo);
    _updateMessageMeta(objMessageInfo)
  }


  function _updateRoomAndSaveMessage(objMessage) {
    var messages = database.collection('rooms').doc(objMessage.roomId).collection('messages');
    messages.add({
      _type: objMessage._type,
      senderUid: objMessage.sender.senderUid,
      time: objMessage.time,
      text: objMessage.text,
    });

    //if its first message add room info
    if (objMessage.temporary == true) {
      var roomInfo = database.collection('rooms').doc(objMessage.roomId);
      roomInfo.set({
          roomId: objMessage.roomId,
          senderUid: objMessage.sender.senderUid,
          receiverUid: objMessage.receiver.receiverUid
        })
        .catch(e => {
          console.log(e)
        });
    }
  }


  function _updateMessageMeta(objMessage) {

    console.log(objMessage)
    var batch = database.batch();

    var user1Uid = objMessage.receiver.receiverUid;
    var user1Link = objMessage.receiver._is_professional == 1 ? lnk.pgProfiloProf + '?uid=' + user1Uid : lnk.pgProfiloUser + '?uid=' + user1Uid;
    var user1 = database.collection("messages_meta").doc(objMessage.sender.senderUid).collection('my_rooms').doc(objMessage.roomId);
    var user1RoomInfo = {
      roomId: objMessage.roomId,
      receiverUid: user1Uid,
      receiverProfileUrl: user1Link,
      receiverRole: objMessage.receiver._is_professional == 1 ? 'professional' : 'user',
      lastMessage: objMessage.text,
      lastMessageType: objMessage._type,
      lastMessageTime: objMessage.time
    }

    var user2Uid = objMessage.sender.senderUid;
    var user2Link = objMessage.sender._is_professional == 1 ? lnk.pgProfiloProf + '?uid=' + user2Uid : lnk.pgProfiloUser + '?uid=' + user2Uid;
    var user2 = database.collection("messages_meta").doc(objMessage.receiver.receiverUid).collection('my_rooms').doc(objMessage.roomId);
    var user2RoomInfo = {
      roomId: objMessage.roomId,
      receiverUid: user2Uid,
      receiverProfileUrl: user2Link,
      receiverRole: objMessage.sender._is_professional == 1 ? 'professional' : 'user',
      lastMessage: objMessage.text,
      lastMessageType: objMessage._type,
      lastMessageTime: objMessage.time,
    }

    if (objMessage.temporary) {
      batch.set(user1, {
        ...user1RoomInfo
      });
      user2RoomInfo._unreadMessages = 1;
      batch.set(user2, {
        ...user2RoomInfo
      });
    } else {
      batch.update(user1, {
        ...user1RoomInfo
      });
      user2RoomInfo._unreadMessages = firebase.firestore.FieldValue.increment(1);
      batch.update(user2, {
        ...user2RoomInfo
      });
    }

    batch.commit().then(() => {
      // ...
    });
  }


  function getRoomInfo(roomId) {
    return new Promise((resolve, reject) => {
      database.collection('rooms').doc(roomId).get()
        .then((doc) => {
          const data = doc.data();
          resolve(data);
        });
    })
  }



  return {
    getRooms: getRooms,
    checkIfRoomIdValid: checkIfRoomIdValid,
    getMyRooms: getMyRooms,
    getUserInfo: getUserInfo,
    sendMessage: sendMessage,
    getFullChat: getFullChat,
    createRoom: createRoom,
    getRoomInfo: getRoomInfo
  }


})();