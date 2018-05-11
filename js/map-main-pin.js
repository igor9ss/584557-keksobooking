'use strict';

(function () {

  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var MAIN_PIN_ARROW_HEIGHT = 22;
  var TOP_LIMITATION_Y = 150;
  var BOTTOM_LIMITATION_Y = 500;
  var TOP_LIMITATION_Y_MAIN_PIN_ARROW = TOP_LIMITATION_Y - (MAIN_PIN_HEIGHT + MAIN_PIN_ARROW_HEIGHT);

  var mapElement = document.querySelector('.map');
  var mainPinElement = document.querySelector('.map__pin--main');

  mainPinElement.addEventListener('mousedown', function (mouseDownEvt) {
    var startCoordinates = {
      x: mouseDownEvt.clientX,
      y: mouseDownEvt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var currentArrowX = parseInt(mainPinElement.style.left, 10) + MAIN_PIN_WIDTH / 2;
      var currentArrowY = parseInt(mainPinElement.style.top, 10) + MAIN_PIN_WIDTH + MAIN_PIN_ARROW_HEIGHT;

      var shift = {
        x: startCoordinates.x - moveEvt.clientX,
        y: startCoordinates.y - moveEvt.clientY
      };

      startCoordinates = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mainPinElement.style.top = (mainPinElement.offsetTop - shift.y) + 'px';
      mainPinElement.style.left = (mainPinElement.offsetLeft - shift.x) + 'px';

      if (mainPinElement.offsetTop < TOP_LIMITATION_Y_MAIN_PIN_ARROW) {
        mainPinElement.style.top = TOP_LIMITATION_Y_MAIN_PIN_ARROW + 'px';
      }

      if (mainPinElement.offsetLeft + MAIN_PIN_WIDTH / 2 < 0) {
        mainPinElement.style.left = 0 - MAIN_PIN_WIDTH / 2 + 'px';
      }

      if (mainPinElement.offsetLeft + MAIN_PIN_WIDTH / 2 > mapElement.offsetWidth) {
        mainPinElement.style.left = mapElement.offsetWidth - MAIN_PIN_WIDTH / 2 + 'px';
      }

      if (mainPinElement.offsetTop + MAIN_PIN_WIDTH + MAIN_PIN_ARROW_HEIGHT > BOTTOM_LIMITATION_Y) {
        mainPinElement.style.top = BOTTOM_LIMITATION_Y - MAIN_PIN_HEIGHT - MAIN_PIN_ARROW_HEIGHT + 'px';
      }

      window.form.setAddressData(currentArrowX, currentArrowY);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
