'use strict';

(function () {
  var LOW_PRICE = 10000;
  var MIDDLE_PRICE = 50000;
  var SELECT_OPTION_ANY = 'any';
  var PRICE_SELECT_LOW = 'low';
  var PRICE_SELECT_MIDDLE = 'middle';
  var PRICE_SELECT_HIGH = 'high';

  var filterTypeSelectElement = document.querySelector('#housing-type');
  var filterPriceSelectElement = document.querySelector('#housing-price');
  var filterRoomsSelectElement = document.querySelector('#housing-rooms');
  var filterGuestsSelectElement = document.querySelector('#housing-guests');

  var filterCheckboxElements = document.querySelectorAll('.map__checkbox');

  var filterByType = function (pin) {
    return filterTypeSelectElement.value === SELECT_OPTION_ANY || pin.offer.type === filterTypeSelectElement.value;
  };

  var filterByPrice = function (pin) {
    return filterPriceSelectElement.value === SELECT_OPTION_ANY ||
            ((filterPriceSelectElement.value === PRICE_SELECT_LOW) && (pin.offer.price <= LOW_PRICE)) ||
            ((filterPriceSelectElement.value === PRICE_SELECT_MIDDLE) && (pin.offer.price >= LOW_PRICE) && (pin.offer.price <= MIDDLE_PRICE)) ||
            ((filterPriceSelectElement.value === PRICE_SELECT_HIGH) && (pin.offer.price >= MIDDLE_PRICE));
  };

  var filterByRooms = function (pin) {
    return filterRoomsSelectElement.value === SELECT_OPTION_ANY || pin.offer.rooms === +filterRoomsSelectElement.value;
  };

  var filterByGuests = function (pin) {
    return filterGuestsSelectElement.value === SELECT_OPTION_ANY || pin.offer.guests >= +filterGuestsSelectElement.value;
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

      pins.forEach(function (pin) {
        if (filterByType(pin) &&
          (filterByPrice(pin)) &&
          (filterByRooms(pin)) &&
          (filterByGuests(pin)) &&
          (filterByFeatures(pin))) {
          filteredPins.push(pin);
        }
      });

      return filteredPins;

    }
  };
})();
