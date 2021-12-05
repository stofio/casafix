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
    var roomId = url.searchParams.get("room");

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


    var checkedRoomId = checkIfRoomIsInverted(myRooms, roomId);


    //open existing chat
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


    //create new temporary room
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
  function checkIfRoomIsInverted(rooms, roomId) {
    if (rooms.map(room => room.id).includes(roomId) == true) return roomId;
    var roomInverted = roomId.split('-')[1] + '-' + roomId.split('-')[0];
    if (rooms.map(room => room.id).includes(roomInverted) == true) return roomInverted;
    return false;
  }


  function showNeedToLoginFirst() {

    $section = $('section.top-sec');

    var needToRegister = `<section class="top-sec" id="review-success">
        <div class="container">
        <div class="review-box-body">
            <h2>Registrati in 1 click e contatta il professionista</h2>
            <div class="two-btn-row">
              <a href="${lnk.pgRegistrationProf}">
                <button class="def-btn">Registrati come professionista</button>
              </a>
              <a href="${lnk.pgRegistrationUser}">
                <button class="def-btn">Registrati come utente</button>
              </a>
            </div>
        </div>
        </div>
    </section>`;


    $section.fadeOut(() => {
      $section.find('.container').remove();
      $section.append(needToRegister).fadeIn(200);
      $section.find('.container').fadeIn(200);
      $('body section').css('display', 'block');
    });
  }



  return {
    initChat: initChat,
    showNeedToLoginFirst: showNeedToLoginFirst
  }

})();