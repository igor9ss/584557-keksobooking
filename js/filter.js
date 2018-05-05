'use strict';

(function () {
  var filterTypeSelect = document.querySelector('#housing-type');
  var filterPriceSelect = document.querySelector('#housing-price');
  var filterRoomsSelect = document.querySelector('#housing-rooms');
  var filterGuestsSelect = document.querySelector('#housing-guests');

  window.filter = {
    filterPins: function (pins) {
      return pins
          .filter(function (pin) {
            return filterTypeSelect.value === 'any' || pin.offer.type === filterTypeSelect.value;
          })
          .filter(function (pin) {
            return filterPriceSelect.value === 'any' ||
            ((filterPriceSelect.value === 'low') && (pin.offer.price <= 10000)) ||
            ((filterPriceSelect.value === 'middle') && (pin.offer.price >= 10000) && (pin.offer.price <= 50000)) ||
            ((filterPriceSelect.value === 'high') && (pin.offer.price >= 50000));
          })
          .filter(function (pin) {
            return filterRoomsSelect.value === 'any' || pin.offer.rooms === +filterRoomsSelect.value;
          })

          .filter(function (pin) {
            return filterGuestsSelect.value === 'any' || pin.offer.guests >= +filterGuestsSelect.value;
          });
    }
  };
})();
