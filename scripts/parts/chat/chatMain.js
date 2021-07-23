var chatMain = (function() {

  //bind events
  //$(document).on('load', _initChat());

  var room = {
    roomId: '',
    _lastMessage: '',
    _lastMessageTime: '',
    _senderName: '',
    _receiverName: '',
    _senderUid: '',
    _receiverUid: '',
    _senderImgUrl: '',
    _receiverImgUrl: '',
  };


  //init
  async function initChat(currentUid) {
    var url_string = window.location.href
    var url = new URL(url_string);
    roomId = url.searchParams.get("room");

    var roomUsersInfo = {
      roomId: '',
      sender: {},
      receiver: {}
    };

    //get rooms
    var myRooms = await dbChat.getMyRooms(currentUid);
    chatSidebar.listRooms(currentUid);


    //if no room in url, return
    if (roomId == '' || roomId == null) return;


    var checkedRoomId = getRoomIfInverted(myRooms, roomId);


    //open chat
    if (checkedRoomId !== false) {
      roomUsersInfo.roomId = checkedRoomId;
      //set current sender and receiver
      var roomInfo = await dbChat.getRoomInfo(checkedRoomId);
      //defining current sender
      if (currentUid == roomInfo.senderUid) {
        var sendUid = roomInfo.senderUid;
        var recUid = roomInfo.receiverUid;
      } else {
        var sendUid = roomInfo.receiverUid;
        var recUid = roomInfo.senderUid;
      }

      dbChat.getUserInfo(recUid)
        .then(receiverInfo => {
          //receiverInfo
          roomUsersInfo.receiver = {...receiverInfo, receiverUid: recUid };
          dbChat.getUserInfo(sendUid)
            .then(senderInfo => {
              roomUsersInfo.sender = {...senderInfo, senderUid: sendUid };
              chatPanel.openChat(roomUsersInfo);
              chatSidebar.selectRoom(roomUsersInfo);
              return;
            })
        })
      return;
    }


    //create new room
    var valid = await dbChat.checkIfRoomIdValid(roomId);
    if (valid) {
      roomUsersInfo.roomId = roomId;
      var sendUid = roomId.split('-')[0];
      var recUid = roomId.split('-')[1];

      dbChat.getUserInfo(recUid)
        .then(receiverInfo => {
          //receiverInfo
          roomUsersInfo.receiver = {...receiverInfo, receiverUid: recUid };
          dbChat.getUserInfo(sendUid)
            .then(senderInfo => {
              roomUsersInfo.sender = {...senderInfo, senderUid: sendUid };
              chatPanel.openTemporaryChat(roomUsersInfo);
              chatSidebar.addTemporaryRoom(roomUsersInfo);
              //start listener
              //dbChat.messagesListener(checkedRoomId);
            })
        })
    }
  }



  //check if the room exist uid1-uid2 or uid2-uid1 
  // return the uid of the room or false
  function getRoomIfInverted(rooms, roomId) {
    if (rooms.map(room => room.id).includes(roomId) == true) return roomId;
    var roomInverted = roomId.split('-')[1] + '-' + roomId.split('-')[0];
    if (rooms.map(room => room.id).includes(roomInverted) == true) return roomInverted;
    return false;
  }



  return {
    initChat: initChat
  }

})();