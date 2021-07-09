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


  function listRooms() {
    //get rooms IDS, names, lastMsg, img prof 
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






  function _highlightCurrentRoom() {

  }

  function _openCloseRoomsBox() {
    //if on mobile
    if ($(window).width() <= 768) {
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



  return {
    initChatSidebar: initChatSidebar,
    listRooms: listRooms
  }

})();