var chatMain = (function() {

  //bind events
  //$(document).on('load', _initChat());

  var room = {
    roomUid: '',
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
    roomUid = url.searchParams.get("room");


    //list rooms
    var myRooms = await dbChat.getMyRooms(currentUid);
    chatSidebar.listRooms(myRooms);

    //if no room in url, return
    if (roomUid == '' || roomUid == null) return;

    //check if room exist, and open
    var existentRoomUid = getRoomIfInverted(myRooms, roomUid);
    if (existentRoomUid !== false) {
      //open chat
      console.log(myRooms)
      var roomVariable = _extractChatVar(myRooms, existentRoomUid);
      console.log(roomVariable)
      chatPanel.openChat(roomVariable);
      chatSidebar.selectRoom(roomVariable);
      return;
    }

    //create new chat
    var valid = await dbChat.checkIfRoomUidValid(roomUid);
    if (valid) {
      var recUid = roomUid.split('-')[1];
      dbChat.getReceiverInfo(recUid)
        .then(recInfo => {
          //chatSidebar.listRooms(myRooms);
          chatPanel.openTemporaryChat(recUid, recInfo);
          chatSidebar.addTemporaryRoom(recUid, recInfo);
        })
    } else {
      //chatSidebar.listRooms(myRooms);
      console.log('Uids not valid');
    }
  }

  /**
   * 
   * TEEEESTTTT
   */
  //check if the room exist uid1-uid2 or uid2-uid1 
  // return the uid of the room or false
  function getRoomIfInverted(rooms, roomUid) {
    if (rooms.map(room => room.id).includes(roomUid) == true) return roomUid;
    var roomInverted = roomUid.split('-')[1] + '-' + roomUid.split('-')[0];
    if (rooms.map(room => room.id).includes(roomInverted) == true) return roomInverted;
    return false;
  }



  function _extractChatVar(rooms, currentUid) {
    //return obj
    return {
      roomId: 'x3GvD1d0JTQ71mDMdWMOtwUmxj32-QXH2GMtvtSOpk1qAaDjVuMriQtS2',
    }
  }

  return {
    initChat: initChat
  }

})();