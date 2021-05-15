/**
 * the popup resides in a div with class 'popup'
 * inside the popup there is a div with class 'popup-overlay'
 */
var popup = (function() {

  //cache dom
  $popup = $('.popup');
  $popupBox = $popup.find('.popup-box');
  $overlay = $popup.find('.popup-overlay');


  //bind events
  $overlay.on('click', hidePopup);

  function showPopup() {
    $overlay.show(0);
    $popup.show(100);

  }

  function hidePopup() {
    $popup.hide(0);
  }


  return {
    showPopup: showPopup,
    hidePopup: hidePopup
  }


})();