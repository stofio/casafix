var chatPanel = (function() {

  //cache dom
  var $chatPanel = $('#chat');
  var $messagesWrap = $chatPanel.find('.msg-box-wrap');
  var $chatPanelTitle = $chatPanel.find('.msg-box-head h3');
  var $chatPanelFooter = $chatPanel.find('.msg-box-foot');

  var $sendMsgBtn = $chatPanel.find('#send-message');
  var $sendPhotoBtn = $chatPanel.find('#msg-send-image');
  var $inputMsg = $chatPanel.find('#mgsInput');

  var chatVariables = {
    temporary: false,
    roomId: '',
    sender: {},
    receiver: {}
  };

  //bind events
  $(document).on('load', _slideCloseChat());
  $sendMsgBtn.on('click', _sendMessage);
  $inputMsg.on('input', _activateDeactivateBtn);

  $(document).keypress(_sendMessageEnter);


  /**
   * messages listener
   */
  function _listenMessagesFromRoom(roomId) {
    var messagesPath = firebase.firestore().collection('rooms').doc(roomId).collection('messages').orderBy("time", "asc");
    messagesPath.onSnapshot(snapshot => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          let msgTmp = _msgTmpList(change.doc.data());
          $messagesWrap.append(msgTmp);
          _slideOpenChat();
        }
      });
      _scrollChatToBottom();
    })
  }


  function openChat(roomUsersInfo) {
    chatVariables = roomUsersInfo;
    if (chatVariables.roomId == '') {
      _slideCloseChat();
      $chatPanelTitle.fadeOut('200', () => {
        $chatPanelTitle.html('Seleziona una conversazione').fadeIn('200');
        return;
      })
    } else {
      _getFullChat(chatVariables.roomId)
        .then(fullChat => {
          // _listChat(fullChat);
          _setReceiverLinkOnTop(chatVariables);
          _listenMessagesFromRoom(chatVariables.roomId)
        })
    }
  }

  //here just prepare variables for current new chat
  function openTemporaryChat(roomUsersInfo) {
    console.log(roomUsersInfo)
    chatVariables = roomUsersInfo;
    chatVariables.temporary = true;
    _slideOpenChat();
    _setReceiverLinkOnTop(chatVariables);
    _listenMessagesFromRoom(roomUsersInfo.roomId);
  }

  function _listChat(object) {
    $.each(object, (i, message) => {
      let msgTmp = _msgTmpList(message);
      $messagesWrap.append(msgTmp);
    })
    _slideOpenChat();
    _scrollChatToBottom()
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

  function _setReceiverLinkOnTop(chatVariables) {
    var recUid = chatVariables.receiver.receiverUid;
    var receiverLink = chatVariables.receiver._is_professional == 1 ? lnk.pgProfiloProf + '?uid=' + recUid : lnk.pgProfiloUser + '?uid=' + recUid;
    var receiverName = chatVariables.receiver.profile.name + ' ' + chatVariables.receiver.profile.surname;
    $chatPanelTitle.html(`<h3><a href="${receiverLink}">${receiverName}</a></h3>`)
  }






  function _slideCloseChat() {
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
    return msgTmp = `
        <div class="single-message msg-single-body">
        <img src="${imgUrl}" class="msg-received-img" />
        <div class="msg-single">
           <p class="msg-sender-name">${name}</p>
        <div class="msg-text">
            ${messageInfo.text}
        </div>
        <div class="msg-time">
            ${messageInfo.time}
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



  return {
    openChat: openChat,
    openTemporaryChat: openTemporaryChat
  }

})();