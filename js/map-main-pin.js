'use strict';

(function () {

  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var MAIN_PIN_ARROW_HEIGHT = 22;
  var TOP_LIMITATION_Y = 150;
  var BOTTOM_LIMITATION_Y = 500;

  var mapElement = document.querySelector('.map');

  window.mainPinElement.addEventListener('mousedown', function (mouseDownEvt) {
    var startCoords = {
      x: mouseDownEvt.clientX,
      y: mouseDownEvt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var currentArrowX = parseInt(window.mainPinElement.style.left, 10) + MAIN_PIN_WIDTH / 2;
      var currentArrowY = parseInt(window.mainPinElement.style.top, 10) + MAIN_PIN_WIDTH + MAIN_PIN_ARROW_HEIGHT;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      window.mainPinElement.style.top = (window.mainPinElement.offsetTop - shift.y) + 'px';
      window.mainPinElement.style.left = (window.mainPinElement.offsetLeft - shift.x) + 'px';

      if (window.mainPinElement.offsetTop < TOP_LIMITATION_Y - (MAIN_PIN_HEIGHT + MAIN_PIN_ARROW_HEIGHT)) {
        window.mainPinElement.style.top = TOP_LIMITATION_Y - (MAIN_PIN_HEIGHT + MAIN_PIN_ARROW_HEIGHT) + 'px';
      }

      if (window.mainPinElement.offsetLeft + MAIN_PIN_WIDTH / 2 < 0) {
        window.mainPinElement.style.left = 0 - MAIN_PIN_WIDTH / 2 + 'px';
      }

      if (window.mainPinElement.offsetLeft + MAIN_PIN_WIDTH / 2 > mapElement.offsetWidth) {
        window.mainPinElement.style.left = mapElement.offsetWidth - MAIN_PIN_WIDTH / 2 + 'px';
      }

      if (window.mainPinElement.offsetTop + MAIN_PIN_WIDTH + MAIN_PIN_ARROW_HEIGHT > BOTTOM_LIMITATION_Y) {
        window.mainPinElement.style.top = BOTTOM_LIMITATION_Y - MAIN_PIN_HEIGHT - MAIN_PIN_ARROW_HEIGHT + 'px';
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
