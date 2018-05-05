'use strict';

(function () {
  var LOW_PRICE = 10000;
  var MIDDLE_PRICE = 50000;

  var filterTypeSelect = document.querySelector('#housing-type');
  var filterPriceSelect = document.querySelector('#housing-price');
  var filterRoomsSelect = document.querySelector('#housing-rooms');
  var filterGuestsSelect = document.querySelector('#housing-guests');

  var filterCheckboxElements = document.querySelectorAll('.map__checkbox');

  window.mapFilter = {
    filterPins: function (pins) {
      return pins
          .filter(function (pin) {
            return filterTypeSelect.value === 'any' || pin.offer.type === filterTypeSelect.value;
          })
          .filter(function (pin) {
            return filterPriceSelect.value === 'any' ||
            ((filterPriceSelect.value === 'low') && (pin.offer.price <= LOW_PRICE)) ||
            ((filterPriceSelect.value === 'middle') && (pin.offer.price >= LOW_PRICE) && (pin.offer.price <= MIDDLE_PRICE)) ||
            ((filterPriceSelect.value === 'high') && (pin.offer.price >= MIDDLE_PRICE));
          })
          .filter(function (pin) {
            return filterRoomsSelect.value === 'any' || pin.offer.rooms === +filterRoomsSelect.value;
          })
          .filter(function (pin) {
            return filterGuestsSelect.value === 'any' || pin.offer.guests >= +filterGuestsSelect.value;
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
