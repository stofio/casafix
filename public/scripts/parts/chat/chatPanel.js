var chatPanel = (function() {

  //cache dom
  var $chatPanel = $('#chat');
  var $messagesWrap = $chatPanel.find('.msg-box-wrap');
  var $chatHead = $chatPanel.find('.msg-box-head');
  var $chatPanelTitle = $chatHead.find('h3');
  var $statusDot = $chatHead.find('.chat-online-status');
  var $chatPanelFooter = $chatPanel.find('.msg-box-foot');

  var $sendMsgBtn = $chatPanel.find('#send-message');
  var $sendPhotoBtn = $chatPanel.find('#msg-send-image');
  var $inputImage = $chatPanel.find('#imageMessage');
  var $inputMsg = $chatPanel.find('#mgsInput');

  var chatVariables = {
    temporary: false,
    roomId: '',
    sender: {},
    receiver: {}
  };

  var roomUsersInfo = {
    roomId: '',
    sender: {},
    receiver: {}
  };

  var limitImageSize = 2097152; // 2 MiB

  //bind events
  $(document).on('load', _slideCloseChat(load = true));
  $sendMsgBtn.on('click', _sendMessage);
  $sendPhotoBtn.on('click', _clickImage);
  $inputImage.on('change', _sendImage);
  $inputMsg.on('input', _activateDeactivateBtn);
  $(document).on('click', '.photo-message img', _fullScreenImage);
  $chatPanel.on('click', _readMessage);

  $(document).keypress(_sendMessageEnter);

  var previousMsgDate;
  /**
   * messages listener
   */
  function _listenMessagesFromRoom(roomId) {
    var messagesPath = firebase.firestore().collection('rooms').doc(roomId).collection('messages').orderBy("time", "asc");
    messagesPath.onSnapshot(snapshot => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          var currentMsgDate = change.doc.data().time;
          setDatesInChat(previousMsgDate, currentMsgDate);
          let msgTmp = _msgTmpList(change.doc.data());
          previousMsgDate = currentMsgDate;
          $messagesWrap.append(msgTmp);
          _slideOpenChat();
        }
      });
      _scrollChatToBottom();
    })
  }

  function setDatesInChat(previousMsgDate, currentMsgDate) {
    if (previousMsgDate == undefined) {
      var startingDate = new Date(currentMsgDate).toISOString().split('T')[0];
      $messagesWrap.append(`<div class="chat-date">${startingDate}</div>`);
      return;
    };
    var currentDate = new Date(previousMsgDate).toISOString().split('T')[0];
    var nextDate = new Date(currentMsgDate).toISOString().split('T')[0];
    if (currentDate !== nextDate) {
      $messagesWrap.append(`<div class="chat-date">${nextDate}</div>`);
    }

  }


  function openChat(roomUsersInfo) {
    chatVariables = roomUsersInfo;
    if (chatVariables.roomId == '') {
      _slideCloseChat();
      $chatPanelTitle.fadeOut('200', () => {
        console.log('asd')
        $chatPanelTitle.html('Seleziona una conversazione').fadeIn('200');
        return;
      })
    } else {
      _setReceiverLinkOnTop(chatVariables);
      _setUserOnlineStatus(chatVariables);
      _listenUserOnlineStatus(chatVariables);
      _listenMessagesFromRoom(chatVariables.roomId);
      _markMessageRead(chatVariables);
    }
  }

  //here just prepare variables for current new chat
  function openTemporaryChat(roomUsersInfo) {
    chatVariables = roomUsersInfo;
    chatVariables.temporary = true;
    _slideOpenChat();
    _setReceiverLinkOnTop(chatVariables);
    _listenUserOnlineStatus(chatVariables);
    _listenMessagesFromRoom(roomUsersInfo.roomId);
  }


  function _getFullChat(roomId) {
    return new Promise((resolve, reject) => {
      dbChat.getFullChat(roomId)
        .then(fullChat => {
          resolve(fullChat);
        })
    })
  }


  function _sendMessage() {
    if ($inputMsg.val() == '') return;

    //get input
    var message = $inputMsg.val();
    var time = Date.now();

    singleMessage = {
      _type: 'text',
      time: time,
      text: message,
    }

    var roomAndMessageData = {...singleMessage, ...chatVariables };

    dbChat.sendMessage(roomAndMessageData);

    if (chatVariables.temporary == true) {
      chatVariables.temporary = false;
    }

    $inputMsg.val('');
    _scrollNextMessage();
  }

  function _sendMessageEnter(e) {
    if (e.keyCode == 13) {
      if ($inputMsg.is(":focus")) {
        _sendMessage();
      }
    }
  }

  function _clickImage() {
    $inputImage.trigger('click');
  }

  function _sendImage() {
    $sendPhotoBtn.attr('disabled', true);
    var uploadedImage = this.files[0];
    var fileType = uploadedImage["type"];
    var validImageTypes = ["image/gif", "image/jpeg", "image/png"];

    if ($.inArray(fileType, validImageTypes) < 0) {
      $sendPhotoBtn.attr('disabled', false);
      alert('Puoi inviare solo immagini, riprova!');
      return;
    }

    if (uploadedImage.size > limitImageSize) {
      $sendPhotoBtn.attr('disabled', false);
      alert("La dimensione dell'immagine deve essere inferiore a 2MiB, riprova!");
      return;
    }


    dbChat.storeChatImage(chatVariables.sender.senderUid, uploadedImage)
      .then((url) => {

        var time = Date.now();
        photoMessage = {
          _type: 'image',
          time: time,
          text: url,
        }
        var roomAndMessageData = {...photoMessage, ...chatVariables };
        _addImageToChat(url);
        _saveMessageImage(roomAndMessageData)
          .then(() => {
            $sendPhotoBtn.attr('disabled', false);
          })
      })
  }

  function _saveMessageImage(roomAndMessageData) {
    return new Promise((resolve) => {
      dbChat.saveMessageImage(roomAndMessageData);
      resolve();
    })
  }

  function _addImageToChat(url) {
    //chat append image
  }


  function _setReceiverLinkOnTop(chatVariables) {
    var recUid = chatVariables.receiver.receiverUid;
    var receiverLink = chatVariables.receiver._is_professional == 1 ? lnk.pgProfiloProf + '?uid=' + recUid : lnk.pgProfiloUser + '?uid=' + recUid;
    if (chatVariables.receiver.profile.name == '') {
      var receiverName = chatVariables.receiver.profile.contact_email;
    } else {
      var receiverName = chatVariables.receiver.profile.name + ' ' + chatVariables.receiver.profile.surname;
    }
    $chatPanelTitle.html(`<h3><a href="${receiverLink}">${receiverName}</a></h3>`)
  }

  function _listenUserOnlineStatus(chatVariables) {
    onlineStatus.statusListener(chatVariables.receiver.receiverUid, state => {
      if (state == 'online') {
        $statusDot.css('background-color', '#3dd10c');
      } else {
        $statusDot.css('background-color', '#c7c7c7');
      }
    });
  }

  function _setUserOnlineStatus(chatVariables) {
    $statusDot.css('background-color', '#c7c7c7');
    onlineStatus.isOnline(chatVariables.receiver.receiverUid, state => {
      if (state == 'online') {
        $statusDot.css('background-color', '#3dd10c');
      } else {
        $statusDot.css('background-color', '#c7c7c7');
      }
    });
  }



  async function selectChat(roomId) {
    _slideCloseChat();
    $messagesWrap.empty();
    var roomInfo = await dbChat.getRoomInfo(roomId);
    var receiverUid;
    var senderUid;
    if (firebase.auth().currentUser.uid == roomInfo.senderUid) {
      receiverUid = roomInfo.receiverUid;
      senderUid = roomInfo.senderUid;
    } else {
      receiverUid = roomInfo.senderUid;
      senderUid = roomInfo.receiverUid;
    }

    dbChat.getUserInfo(receiverUid)
      .then(receiverInfo => {
        roomUsersInfo.receiver = {...receiverInfo, receiverUid: receiverUid };
        dbChat.getUserInfo(senderUid)
          .then(senderInfo => {
            roomUsersInfo.sender = {...senderInfo, senderUid: senderUid };
            roomUsersInfo.roomId = roomId;
            chatPanel.openChat(roomUsersInfo);
            chatSidebar.selectRoom(roomUsersInfo);
            _slideOpenChat()
            return;
          })
      })
  }





  function _slideCloseChat(load) {
    $statusDot.css('background-color', '#c7c7c7');
    if (!load) $chatPanelTitle.html('...');
    $messagesWrap.slideUp();
    $chatPanelFooter.slideUp()
  }

  function _slideOpenChat() {
    $messagesWrap.slideDown();
    $chatPanelFooter.slideDown()
  }

  function _activateDeactivateBtn() {
    if ($inputMsg.val().replace(/\s/g, '') == '') {
      if (!$sendMsgBtn.hasClass('deactivated')) {
        $sendMsgBtn.addClass('deactivated');
      }
    } else {
      $sendMsgBtn.removeClass('deactivated');
    }
  }

  function _scrollNextMessage() {
    $messagesWrap.stop().animate({ scrollTop: $messagesWrap[0].scrollHeight }, 1000);
  }

  function _scrollChatToBottom() {
    var maxScrollPosition = $messagesWrap.prop('scrollHeight') - $messagesWrap.prop('clientHeight');
    $messagesWrap.animate({ scrollTop: maxScrollPosition });
  }



  function _msgTmpList(messageInfo) {
    var name = _getUserName(messageInfo.senderUid);
    var imgUrl = _getUserImageUrl(messageInfo.senderUid);
    if (messageInfo._type == 'text') {
      var message = `<p>${messageInfo.text}</p>`;
    } else if (messageInfo._type == 'image') {
      var message = `<div class="photo-message"><img src="${messageInfo.text}"/></div>`;
    }
    return msgTmp = `
        <div class="single-message msg-single-body">
        <img src="${imgUrl}" class="msg-received-img" />
        <div class="msg-single">
           <p class="msg-sender-name">${name}</p>
        <div class="msg-text">
            ${message}
        </div>
        <div class="msg-time">
            ${_getTime(messageInfo.time)}
        </div>
        </div>
        </div>
    `;
  }


  //return name of message sender, if name not set, return email
  function _getUserName(senderUid) {
    if (chatVariables.receiver.receiverUid === senderUid) {
      if (chatVariables.receiver.profile.name == '' || chatVariables.receiver.profile.name == undefined) {
        return chatVariables.receiver.profile.contact_email;
      }
      return chatVariables.receiver.profile.name + ' ' + chatVariables.receiver.profile.surname;
    } else {
      if (chatVariables.sender.profile.name == '' || chatVariables.sender.profile.name == undefined) {
        return chatVariables.sender.profile.contact_email;
      }
      return chatVariables.sender.profile.name + ' ' + chatVariables.sender.profile.surname;
    }
  }

  //return image url
  function _getUserImageUrl(senderUid) {
    if (chatVariables.receiver.receiverUid === senderUid) {
      return chatVariables.receiver.profile.prof_img_url;
    } else {
      return chatVariables.sender.profile.prof_img_url;
    }
  }


  function _getTime(timestamp) {
    var date = new Date(timestamp);
    var time = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    return time;
  }

  function _markMessageRead(chatVariables) {
    var currentUid = chatVariables.sender.senderUid;
    var receiverUid = chatVariables.receiver.receiverUid;
    var roomId = chatVariables.roomId;
    dbChat.markMessageRead(currentUid, roomId);
    chatSidebar.removeUnreadMessages(receiverUid);
  }


  function _fullScreenImage() {
    var src = $(this).attr('src');
    var modal;

    function removeModal() {
      modal.remove();
      $('body').off('keyup.modal-close');
    }
    modal = $('<div>').css({
      background: 'RGBA(0,0,0,.5) url(' + src + ') no-repeat center',
      backgroundSize: 'contain',
      width: '100%',
      height: '100%',
      position: 'fixed',
      zIndex: '10000',
      top: '0',
      left: '0',
      cursor: 'zoom-out'
    }).click(function() {
      removeModal();
    }).appendTo('body');
    //handling ESC
    $('body').on('keyup.modal-close', function(e) {
      if (e.key === 'Escape') {
        removeModal();
      }
    });
  }

  function _readMessage() {
    _markMessageRead(chatVariables);
  }



  return {
    openChat: openChat,
    openTemporaryChat: openTemporaryChat,
    selectChat: selectChat
  }

})();