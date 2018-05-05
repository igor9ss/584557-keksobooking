'use strict';

(function () {

  var mapElement = document.querySelector('.map');

  window.dragNdrop = {
    mainPinDND: function (mouseDownEvt) {
      var startCoords = {
        x: mouseDownEvt.clientX,
        y: mouseDownEvt.clientY
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var currentArrowX = parseInt(window.mainPinElement.style.left, 10) + window.MAIN_PIN_WIDTH / 2;
        var currentArrowY = parseInt(window.mainPinElement.style.top, 10) + window.MAIN_PIN_HEIGHT + window.MAIN_PIN_ARROW_HEIGHT;

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

        if (window.mainPinElement.offsetTop < 150 - (window.MAIN_PIN_HEIGHT + window.MAIN_PIN_ARROW_HEIGHT)) {
          window.mainPinElement.style.top = 150 - (window.MAIN_PIN_HEIGHT + window.MAIN_PIN_ARROW_HEIGHT) + 'px';
        }

        if (window.mainPinElement.offsetLeft + window.MAIN_PIN_WIDTH / 2 < 0) {
          window.mainPinElement.style.left = 0 - window.MAIN_PIN_WIDTH / 2 + 'px';
        }

        if (window.mainPinElement.offsetLeft + window.MAIN_PIN_WIDTH / 2 > mapElement.offsetWidth) {
          window.mainPinElement.style.left = mapElement.offsetWidth - window.MAIN_PIN_WIDTH / 2 + 'px';
        }

        if (window.mainPinElement.offsetTop + window.MAIN_PIN_HEIGHT + window.MAIN_PIN_ARROW_HEIGHT > 500) {
          window.mainPinElement.style.top = 500 - window.MAIN_PIN_HEIGHT - window.MAIN_PIN_ARROW_HEIGHT + 'px';
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
    }
  };
})();
