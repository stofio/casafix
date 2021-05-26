(function() {

  var uid;

  //cache dom
  var $box = $('#mainInfo');

  var $modifyContainer = $box.find('.modifyContainer');
  var $saveContainer = $box.find('.saveContainer');

  var currentData = {
    name: '',
    surname: '',
    contact_email: '',
    phone: '',
    location: '',
  };


  //bind events
  $(document).on('load', _loadPage());
  $(document).on('click', '.modifyBtn', _changeToModifyMod);
  $(document).on('click', '.saveBtn', _saveData);
  $(document).on('click', '.cancBtn', _cancelInputs);


  //init
  async function _loadPage() {
    uid = await dbSett.getTheUid();
    $box.find('.inp-text').hide();
    $box.find('input').hide();
    _getData()
      .then(() => {
        _renderTextAndBtn();
        _fillData(currentData);
      })
  }


  //functions

  function _renderTextAndBtn() {
    _renderModifyButton();
    _renderText();
  }

  function _renderSaveButton() {
    var btn = `<button class="def-btn saveBtn"">Salva</button>
               <span class="cancel-btn cancBtn">cancella</span>`;
    $saveContainer.html(btn);
    $modifyContainer.html('');
  }

  function _renderModifyButton() {
    var btn = `<div class="edit-pen modifyBtn">Modifica</div>`;
    $modifyContainer.html(btn);
    $saveContainer.html('');
  }



  function _changeToModifyMod() {
    _renderSaveButton();
    _renderInputs();
  }

  function _changeToTextMode() {
    _renderModifyButton();
    _renderText();
  }


  //hide text show input
  function _renderInputs() {
    $box.find('.inp-text').hide();
    $box.find('input').show();
  }

  //hide input show text
  function _renderText() {
    $box.find('.inp-text').show();
    $box.find('input').hide();
  }

  function _getData() {
    return new Promise((resolve) => {
      dbSett.getMainInfo(uid).then((data) => {
        console.log(data.profile);
        currentData = data.profile;
        resolve();
      });
    })

  }

  function _fillData(obj) {
    _fillInput('#name', obj.name);
    _fillInput('#surname', obj.surname);
    _fillInput('#email', obj.contact_email);
    _fillInput('#phone', obj.phone);
    _fillInput('#location', obj.location);
  }

  /**
   * fill the given input and text with value
   * @param {string} domId - id of element -> '#el' 
   * @param {*} val - value
   */
  function _fillInput(domId, val) {
    var $nameInp = $box.find(domId);
    var $nameTxt = $box.find(domId).parent().children('.inp-text');
    val == '' ? $nameTxt.html('-') : $nameTxt.html(val);
    $nameInp.val(val);
  }

  function _cancelInputs() {
    _changeToTextMode();
    _fillData(currentData);
  }

  async function _saveData() {
    var obj = {
        name: $box.find('#name').val(),
        surname: $box.find('#surname').val(),
        contact_email: $box.find('#email').val(),
        phone: $box.find('#phone').val(),
        location: $box.find('#location').val(),
      }
      //compare if data is the same
    if (JSON.stringify(obj) === JSON.stringify(currentData)) {
      _changeToTextMode();
      return;
    } else {
      loadingButtonOn();
      await dbSett.saveMainInfo(uid, obj);
      currentData = obj;
      _fillData(obj);
      _changeToTextMode();
      loadingButtonOff();
      return;
    }
  }

  function loadingButtonOn() {
    var btn = $box.find('.saveBtn');
    btn.attr('disabled', true);
    btn.html('Salva...');
  }

  function loadingButtonOff() {
    var btn = $box.find('.saveBtn');
    btn.attr('disabled', false);
    btn.html('Salva');
  }


})();