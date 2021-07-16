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
    roomId: '',
    senderUid: '',
    senderName: '',
    senderImgUrl: '',
    receiverUid: '',
    receiverName: '',
    receiverImgUrl: '',
    receiverRole: '',
    receiverProfileUrl: ''
  };

  //bind events
  $(document).on('load', _slideCloseChat());
  $sendMsgBtn.on('click', _sendMessage);
  $inputMsg.on('input', _activateDeactivateBtn);

  $(document).keypress(_sendMessageEnter);


  //functions
  function openChat(roomVar) {
    if (roomVar.roomId == '') {
      _slideCloseChat();
      $chatPanelTitle.fadeOut('200', () => {
        $chatPanelTitle.html('Seleziona una conversazione').fadeIn('200');
        return;
      })
    } else {
      //_setChatVariables(roomVar);
      _getFullChat(roomVar.roomId)
        .then(fullChat => {
          _listChat(fullChat);
        })
    }
  }

  function _listChat(object) {
    $.each(object, (i, message) => {
      let msgTmp = _getSenderMsgTmp(message);
      $messagesWrap.append(msgTmp);
    })
    _slideOpenChat();
  }

  function _getSenderMsgTmp(message) {
    return msgTmp = `
        <div class="single-message msg-single-body">
        <img src="${message.senderImgUrl}" class="msg-received-img" />
        <div class="msg-single">
           <p class="msg-sender-name">${message.senderName}</p>
        <div class="msg-text">
            ${message.text}
        </div>
        <div class="msg-time">
            ${message.time}
        </div>
        </div>
        </div>
    `;
  }

  function _getReceiverMsgTmp(message) {
    return msgTmp = `
        <div class="single-message msg-single-body">
        <img src="${chatVariables.senderImgUrl}" class="msg-received-img" />
        <div class="msg-single">
           <p class="msg-sender-name">${chatVariables.senderName}</p>
        <div class="msg-text">
            ${message.text}
        </div>
        <div class="msg-time">
            ${message.time}
        </div>
        </div>
        </div>
    `;
  }

  //here just prepare variables for current new chat
  function openTemporaryChat(recUid, recInfo) {
    console.log(chatVariables)
    _setChatVariables(recUid, recInfo);
    console.log(recInfo)
    _slideOpenChat();
    console.log(chatVariables)
    $chatPanelTitle.html(`<h3><a href="${chatVariables.receiverProfileUrl}">${chatVariables.receiverName}</a></h3>`)

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

    console.log(singleMessage)
    console.log(chatVariables)

    var roomAndMessageData = {...singleMessage, ...chatVariables };
    console.log(roomAndMessageData)

    dbChat.sendMessage(roomAndMessageData);

    $messagesWrap.append(_getSenderMsgTmp(singleMessage));
    $inputMsg.val('');
  }

  function _sendMessageEnter(e) {
    if (e.keyCode == 13) {
      if ($inputMsg.is(":focus")) {
        _sendMessage();
      }
    }
  }


  /**
   * here we define 
   */
  function _setChatVariables(recUid, recInfo) {
    chatVariables.receiverUid = recUid;
    chatVariables.receiverName = recInfo.profile.name + ' ' + recInfo.profile.surname;
    chatVariables.receiverImgUrl = recInfo.profile.prof_img_url;
    chatVariables.receiverRole = recInfo._is_professional == 1 ? 'professional' : 'user';
    chatVariables.senderUid = firebase.auth().currentUser.uid;
    chatVariables.senderName = firebase.auth().currentUser.displayName;
    chatVariables.roomId = firebase.auth().currentUser.uid + '-' + recUid;
    chatVariables.senderImgUrl = firebase.auth().currentUser.photoURL;

    //set receiver profile url based on role
    var a = chatVariables.receiverRole == 'professional' ? lnk.pgProfiloProf + '?uid=' + recUid : lnk.pgProfiloUser + '?uid=' + recUid;
    chatVariables.receiverProfileUrl = a;
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


  function _getFullChat(roomId) {
    return new Promise((resolve, reject) => {
      dbChat.getFullChat(roomId)
        .then(fullChat => {
          resolve(fullChat);
        })
    })
  }



  return {
    openChat: openChat,
    openTemporaryChat: openTemporaryChat
  }

})();