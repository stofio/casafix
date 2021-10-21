var chatSidebar = (function() {

  //cache dom
  var $chatSidebar = $('#chat-rooms');

  var $roomsBody = $chatSidebar.find('.rooms-box-body');
  var $roomsHead = $chatSidebar.find('.rooms-box-head');
  var $roomsMobileArrow = $chatSidebar.find('.arrow-box-rooms');

  var $singleRoom = $chatSidebar.find('.single-chat');



  //bind events
  //ON CHAT CLICK chatPanel.openChat(id)
  $(window).on('resize', _ifDesktopOpenRoomsBox);
  $(document).on('load', _openCloseRoomsBox());
  $roomsHead.on('click', _openCloseRoomsBox);

  $(document).on('click', '.single-chat', _changeRoom);


  //init
  function initChatSidebar() {
    _openCloseRoomsBox();
  }


  /**
   * rooms listener
   */
  async function listRooms(currentUid) {
    var roomsPath = firebase.firestore().collection('messages_meta').doc(currentUid).collection('my_rooms').orderBy("lastMessageTime", "asc");
    roomsPath.onSnapshot(snapshot => {
      console.log(snapshot)
      if (snapshot.size == 0) {
        $roomsBody.append(`<h4>Non hai ancora iniziato una conversazione. <a href="${lnk.pgCercaProf}"> Trova un professionista </a> e mandagli un messaggio.</h4>`);
        _openRoomsBox();
        return;
      }
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          //get user name and img
          dbChat.getUserInfo(change.doc.data().receiverUid)
            .then(userInfo => {
              removeTemporaryRoom();
              $roomsBody.prepend(_getRoomTmp(change.doc.data(), userInfo));
              // _highlightCurrentRoom(change.doc.data().receiverUid)
            })
        }
        if (change.type === "modified") {
          _updateLastMessageAndTime(change.doc.data());
          _updateUnreadMessages(change.doc.data());
          _bringRoomOnTop(change.doc.data());
        }
      });
    })
  }

  function _updateLastMessageAndTime(changes) {
    var roomElement = $chatSidebar.find(`#${changes.receiverUid}`);

    if (changes.lastMessageType === "text") {
      roomElement.find('.last-message').html(changes.lastMessage);
    }
    roomElement.find('.room-name-time span').html(_getTime(changes.lastMessageTime));
  }

  function _bringRoomOnTop(changes) {
    var roomElement = $chatSidebar.find(`#${changes.receiverUid}`);
    roomElement.parent().prepend(roomElement);
  }

  function _updateUnreadMessages(changes) {
    var roomElement = $chatSidebar.find(`#${changes.receiverUid}`);
    if (changes._unreadMessages == 1) {
      var unreadMessages = `<span class="sidebar-unread">${changes._unreadMessages}</span>`;
      roomElement.prepend(unreadMessages);
    } else {
      roomElement.find('.sidebar-unread').html(changes._unreadMessages);
    }
  }

  function removeTemporaryRoom() {
    $roomsBody.find('.single-chat.temporary').remove();
  }


  function selectRoom(usersInfo) {
    _highlightCurrentRoom(usersInfo.receiver.receiverUid);
  }

  function _changeRoom(e) {
    if ($(this).hasClass('chat-room-selected')) return;
    $chatSidebar.css('pointer-events', 'none');
    _highlightCurrentRoom(roomId);
    var roomId = $(this).find('input').val();
    chatPanel.selectChat(roomId);
    $chatSidebar.css('pointer-events', 'auto');
  }



  function _highlightCurrentRoom(uid) {
    $roomsBody.find('.single-chat').removeClass('chat-room-selected');
    $roomsBody.find(`#${uid}`).addClass('chat-room-selected');
  }

  function _getRoomTmp(room, userInfo, temporary) {
    temporary == true ? temporary = "temporary" : temporary = "";

    var name = getNameOrEmail(userInfo.profile);

    var unreadMessages = room._unreadMessages > 0 ? `<span class="sidebar-unread">${room._unreadMessages}</span>` : '';

    var time = getLastMessageTime(room.lastMessageTime);

    var lastMessage = room.lastMessageType == 'image' ? 'Foto' : room.lastMessage;

    _setOnlineStatus(room.receiverUid);

    return `
      <div class="single-chat ${temporary}" id="${room.receiverUid}">
        <div class="online-status"></div>
        ${unreadMessages == undefined || 0 ? '' : unreadMessages}
        <input type="text" value="${room.roomId}" hidden/>
        <img src="${userInfo.profile.prof_img_url}" />
        <div class="single-chat-info">
          <div class="room-name-time">
            <p>${name}</p>
            <span>${time}</span>
          </div>
          <p class="last-message">${lastMessage}</p>
        </div>
      </div>
    `;
  }

  function getLastMessageTime(lastMessageTime) {
    if (lastMessageTime == '') return '';
    if (isToday(lastMessageTime)) {
      return _getTime(lastMessageTime);
    } else {
      return new Date(lastMessageTime).toISOString().split('T')[0]
    }
  }

  function _setOnlineStatus(receiverUid) {
    onlineStatus.statusListener(receiverUid, state => {
      if (state == 'online') {
        $(`#${receiverUid}`).find('.online-status').css('background-color', '#3dd10c');
      } else {
        $(`#${receiverUid}`).find('.online-status').css('background-color', '#c7c7c7');
      }
    });
  }

  function getNameOrEmail(userProfile) {
    if (userProfile == undefined || userProfile.name == '') {
      return userProfile.contact_email;
    } else {
      return userProfile.name + ' ' + userProfile.surname;
    }

  }

  function _openCloseRoomsBox() {
    //if on mobile
    if ($(window).width() <= 768) {
      //if room in url
      if ($roomsBody.hasClass('box-closed')) {
        _openRoomsBox();
      } else {
        _closeRoomsBox();
      }
    } else {
      //if on desktop
      if ($roomsBody.hasClass('box-closed')) {
        _openRoomsBox();
      } else {
        return;
      }
    }
  }

  //on mobile
  function _closeRoomsBox() {
    $roomsBody.slideUp().addClass('box-closed');
    $('.rooms-box-head').css('cursor', 'pointer');
    $roomsMobileArrow.css('transform', 'rotate(90deg)');
  }

  //on mobile
  function _openRoomsBox() {
    $roomsBody.slideDown().removeClass('box-closed');
    $chatSidebar.find('.rooms-box-head').css('cursor', 'auto');
    $roomsMobileArrow.css('transform', 'rotate(180deg)');
  }

  function _ifDesktopOpenRoomsBox() {
    if ($(window).width() >= 768) {
      _openRoomsBox()
    }
  }

  function addTemporaryRoom(usersInfo) {
    var room = {
      receiverUid: usersInfo.receiver.receiverUid,
      receiverImgUrl: usersInfo.receiver.profile.prof_img_url,
      receiverName: usersInfo.receiver.profile.name + ' ' + usersInfo.receiver.profile.surname,
      lastMessageTime: '',
      lastMessage: '',
    };
    console.log(usersInfo)
    var tmp = _getRoomTmp(room, usersInfo.receiver, temporary = true);
    $roomsBody.find('h4').remove();
    $roomsBody.append(tmp);
    _highlightCurrentRoom(usersInfo.receiver.receiverUid)
  }

  function _getTime(timestamp) {
    var date = new Date(timestamp);
    var time = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    return time;
  }


  function isToday(date) {
    var today = new Date();
    var theDate = new Date(date);
    return (today.setHours(0, 0, 0, 0) == theDate.setHours(0, 0, 0, 0))
  }

  function removeUnreadMessages(receiverUid) {
    $roomsBody.find(`#${receiverUid}`).find('.sidebar-unread').remove();
  }






  return {
    initChatSidebar: initChatSidebar,
    listRooms: listRooms,
    selectRoom: selectRoom,
    addTemporaryRoom: addTemporaryRoom,
    removeTemporaryRoom: removeTemporaryRoom,
    removeUnreadMessages: removeUnreadMessages
  }

})();