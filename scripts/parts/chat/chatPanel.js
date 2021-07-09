var chatPanel = (function() {

  //cache dom
  var $chatPanel = $('#chat');
  var $messagesWrap = $chatPanel.find('.msg-box-wrap');

  var $sendMsgBtn = $chatPanel.find('#send-message');
  var $sendPhotoBtn = $chatPanel.find('#msg-send-image');
  var $inputMsg = $chatPanel.find('#mgsInput');


  $sendMsgBtn.on('click', _sendMessage);



  //bind events


  //init
  function initChatSidebar() {}


  //functions
  function openChat(id) {
    //getFullChat(id)
    //list the whole chat
    //if chat is empty
    //append 'inizia una conversazione'
  }

  function _listChat(object) {
    $.each(object, message => {
      let msgTmp = _getMsgTmp(message);
      $messagesWrap.append(msgTmp);
    })
  }

  function _getMsgTmp(message) {
    return msgTmp = `
        <div class="single-message msg-single-body">
        <img src="https://lh3.googleusercontent.com/a/AATXAJzQ07LeoK3xf_DqWH2Jf36fSlfzRLX5d1fdh1I=s400-c" class="msg-received-img" />
        <div class="msg-single">
        <p class="msg-sender-name">Mario Rossi</p>
        <div class="msg-text">
            Ciao come va tutto bene
        </div>
        <div class="msg-time">
            12:12
        </div>
        </div>
        </div>
    `;
  }

  function startNewChat() {

  }

  function _sendMessage() {
    //get input
    //get tmp
    //append
    //send Db
  }


  return {
    openChat: openChat
  }

})();