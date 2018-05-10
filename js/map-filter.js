'use strict';

(function () {
  var LOW_PRICE = 10000;
  var MIDDLE_PRICE = 50000;
  var SELECT_OPTION_ANY = 'any';
  var PRICE_SELECT_LOW = 'low';
  var PRICE_SELECT_MIDDLE = 'middle';
  var PRICE_SELECT_HIGH = 'high';

  var filterTypeSelect = document.querySelector('#housing-type');
  var filterPriceSelect = document.querySelector('#housing-price');
  var filterRoomsSelect = document.querySelector('#housing-rooms');
  var filterGuestsSelect = document.querySelector('#housing-guests');

  var filterCheckboxElements = document.querySelectorAll('.map__checkbox');

  var filterByType = function (pin) {
    return filterTypeSelect.value === SELECT_OPTION_ANY || pin.offer.type === filterTypeSelect.value;
  };

  var filterByPrice = function (pin) {
    return filterPriceSelect.value === SELECT_OPTION_ANY ||
            ((filterPriceSelect.value === PRICE_SELECT_LOW) && (pin.offer.price <= LOW_PRICE)) ||
            ((filterPriceSelect.value === PRICE_SELECT_MIDDLE) && (pin.offer.price >= LOW_PRICE) && (pin.offer.price <= MIDDLE_PRICE)) ||
            ((filterPriceSelect.value === PRICE_SELECT_HIGH) && (pin.offer.price >= MIDDLE_PRICE));
  };

  var filterByRooms = function (pin) {
    return filterRoomsSelect.value === SELECT_OPTION_ANY || pin.offer.rooms === +filterRoomsSelect.value;
  };

  var filterByGuests = function (pin) {
    return filterGuestsSelect.value === SELECT_OPTION_ANY || pin.offer.guests >= +filterGuestsSelect.value;
  };

  var filterByFeatures = function (pin) {
    var selectedFeatures = [];
    filterCheckboxElements.forEach(function (filterCheckboxElement) {
      if (filterCheckboxElement.checked) {
        selectedFeatures.push(filterCheckboxElement.value);
      }
    });

    var hasFeatures = true;

    for (var j = 0; j < selectedFeatures.length; j++) {
      if (!pin.offer.features.includes(selectedFeatures[j])) {
        hasFeatures = false;
        break;
      }
    }
    return hasFeatures;
  };

  window.mapFilter = {
    filterPins: function (pins) {

      var filteredPins = [];

      for (var i = 0; i < pins.length; i++) {
        if (filterByType(pins[i]) &&
          (filterByPrice(pins[i])) &&
          (filterByRooms(pins[i])) &&
          (filterByGuests(pins[i])) &&
          (filterByFeatures(pins[i]))) {
          filteredPins.push(pins[i]);
        }
      }

      return filteredPins;

    }
  };
})();
