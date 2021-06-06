var popup = (function() {

  //cache dom
  $popup = $('.popup');
  $overlay = $popup.find('.popup-overlay');


  //bind events
  $overlay.on('click', hidePopup);

  function showPopup(id) {
    $overlay.show(0);
    $(id).show(100);

  }

  function hidePopup() {
    $popup.hide(0);
  }

  function yesNoPopup(message, yesClick) {
    //show popup template with message
    $('body').append(_yesNoTemplate(message));
    showPopup('#yesNoPopup');
    $('#yesNoPopup .popup-overlay').show(0);
    $('.modalYes').on('click', () => {
      yesClick();
      $('#yesNoPopup').remove();
    })
    $('.modalNo, .popup-overlay').on('click', () => {
      $('#yesNoPopup').remove()
      return;
    })
  }

  function _yesNoTemplate(message) {
    return `<div class="popup" id="yesNoPopup">
              <div class="popup-overlay"></div>
              <div class="row popup-container">
                <div class="popup-box">
                  <span>${message}</span>
                  <div class="saveContainer">
                    <button class="def-btn modalYes">Si</button>
                    <span class="cancel-btn modalNo">No</span>
                  </div>
                </div>
              </div>
            </div>
    `;
  }


  function inputPopup(inpTitle, inp, okClick) {
    //show popup template with message
    $('body').append(_inputTemplate(inpTitle, inp));
    showPopup('#inputPopup');
    $('#inputPopup .popup-overlay').show(0);
    $('.modInputOk').on('click', () => {
      okClick($('#modInput').val());
      $('#inputPopup').remove();
    })
    $('.modInputCanc, .popup-overlay').on('click', () => {
      $('#inputPopup').remove()
      return;
    })
  }

  function _inputTemplate(inpTitle, Inp) {
    return `<div class="popup" id="inputPopup">
              <div class="popup-overlay"></div>
              <div class="row popup-container">
                <div class="popup-box">
                  <div class="input-with-label">
                    <label>${inpTitle}</label><br>
                    <input type="text" id="modInput" value="${Inp}">
                  </div>
                  <div class="saveContainer">
                    <button class="def-btn modInputOk">Ok</button>
                    <span class="cancel-btn modInputCanc">Cancel</span>
                  </div>
                </div>
              </div>
            </div>
    `;
  }


  return {
    showPopup: showPopup,
    hidePopup: hidePopup,
    yesNoPopup: yesNoPopup,
    inputPopup: inputPopup
  }


})();