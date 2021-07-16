var chatSidebar = (function() {

  //cache dom
  var $chatSidebar = $('#chat-rooms');

  var $roomsBody = $chatSidebar.find('.rooms-box-body');
  var $roomsHead = $chatSidebar.find('.rooms-box-head');
  var $roomsMobileArrow = $chatSidebar.find('.arrow-box-rooms');



  //bind events
  //ON CHAT CLICK chatPanel.openChat(id)
  $(window).on('resize', _ifDesktopOpenRoomsBox);
  $(document).on('load', _openCloseRoomsBox());
  $roomsHead.on('click', _openCloseRoomsBox);


  //init
  function initChatSidebar() {
    _openCloseRoomsBox();
  }

  //functions
  function _getAllRoomsFromUser() {}


  function listRooms(rooms) {
    console.log(rooms.length)
    if (rooms.length < 1) {
      $roomsBody.append(`<h4>Non hai ancora iniziato una conversazione. <a href="${lnk.pgCercaProf}"> Trova un professionista </a> e mandagli un messaggio.</h4>`);
      _openRoomsBox();
      return;
    }
    $.each(rooms, (i, room) => {
      console.log(room)
      $roomsBody.prepend(_getRoomTmp(room));
    })
  }


  function selectRoom(id) {
    //if room exist
    //_highlightCurrentRoom(id)
    //chatPanel.openChat(id)
    //else 
    //create new room
    //highlight room
    //chatPanel.openChat(id)
  }



  function _highlightCurrentRoom(uid) {
    $roomsBody.find(`#${uid}`).addClass('chat-room-selected');
  }

  function _getRoomTmp(room) {
    console.log(room)
    return `
        <div class="single-chat" id="${room.receiverUid}">
        <img src="${room.receiverImgUrl}" />
        <div class="single-chat-info">
          <div class="room-name-time">
            <p>${room.receiverName}</p>
            <span>${room.lastMessageTime}</span>
          </div>
          <p class="last-message">${room.lastMessage}</p>
        </div>
      </div>
    `;
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

  function addTemporaryRoom(recUid, recInfo) {
    var room = {
      receiverUid: recUid,
      receiverImgUrl: recInfo.profile.prof_img_url,
      receiverName: recInfo.profile.name + ' ' + recInfo.profile.surname,
      lastMessageTime: '',
      lastMessage: '',
    };
    var tmp = _getRoomTmp(room);
    console.log(recInfo)
    $roomsBody.find('h4').remove();
    $roomsBody.append(tmp);
    _highlightCurrentRoom(recUid)
  }



  return {
    initChatSidebar: initChatSidebar,
    listRooms: listRooms,
    selectRoom: selectRoom,
    addTemporaryRoom: addTemporaryRoom
  }

})();