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

  window.mapFilter = {
    filterPins: function (pins) {
      return pins
          .filter(function (pin) {
            return filterTypeSelect.value === SELECT_OPTION_ANY || pin.offer.type === filterTypeSelect.value;
          })
          .filter(function (pin) {
            return filterPriceSelect.value === SELECT_OPTION_ANY ||
            ((filterPriceSelect.value === PRICE_SELECT_LOW) && (pin.offer.price <= LOW_PRICE)) ||
            ((filterPriceSelect.value === PRICE_SELECT_MIDDLE) && (pin.offer.price >= LOW_PRICE) && (pin.offer.price <= MIDDLE_PRICE)) ||
            ((filterPriceSelect.value === PRICE_SELECT_HIGH) && (pin.offer.price >= MIDDLE_PRICE));
          })
          .filter(function (pin) {
            return filterRoomsSelect.value === SELECT_OPTION_ANY || pin.offer.rooms === +filterRoomsSelect.value;
          })
          .filter(function (pin) {
            return filterGuestsSelect.value === SELECT_OPTION_ANY || pin.offer.guests >= +filterGuestsSelect.value;
          })
          .filter(function (pin) {
            var selectedFeatures = [];
            filterCheckboxElements.forEach(function (filterCheckboxElement) {
              if (filterCheckboxElement.checked) {
                selectedFeatures.push(filterCheckboxElement.value);
              }
            });

            var hasFeatures = true;
            selectedFeatures.forEach(function (selectedFeature) {
              if (!pin.offer.features.includes(selectedFeature)) {
                hasFeatures = false;
              }
            });
            return hasFeatures;
          });
    }
  };
})();
