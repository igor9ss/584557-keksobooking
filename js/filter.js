'use strict';

(function () {

  var housingTypeSelect = document.querySelector('#housing-type');

  window.filter = {
    filterPins: function (pinData) {
      return pinData.filter(function (pin) {
        return housingTypeSelect.value === 'any' || pin.offer.type === housingTypeSelect.value;
      });
    }
  };
})();
