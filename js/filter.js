'use strict';

(function () {
  var filterTypeSelect = document.querySelector('#housing-type');

  window.filter = {
    filterPins: function (pins) {

      return pins
          .filter(function (pin) {
            return filterTypeSelect.value === 'any' || pin.offer.type === filterTypeSelect.value;
          })
          .filter(function () {
            return true;
          })
          .filter(function () {
            return true;
          })
          .filter(function () {
            return true;
          });
    }
  };
})();
