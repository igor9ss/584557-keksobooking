'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'ico'];

  var avatarInputField = document.querySelector('#avatar');
  var avatarElement = document.querySelector('.ad-form-header__preview img');
  var avatarDropZoneElement = document.querySelector('.ad-form-header__drop-zone');
  var housingInputField = document.querySelector('#images');
  var housingPhotoBox = document.querySelector('.ad-form__photo');
  var housingPhotoDropZone = document.querySelector('.ad-form__drop-zone');

  var draggedItemElement;

  var checkFileForImg = function (file) {
    var fileName = file.name.toLowerCase();

    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };
  var renderPrevImg = function (file, elem) {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      elem.src = reader.result;
    });

    reader.readAsDataURL(file);
  };
  var createHousingPhotosFragment = function (elem) {
    var fragment = document.createDocumentFragment();

    Array.from(elem.files).forEach(function (file) {

      if (checkFileForImg(file)) {
        var imgElement = document.createElement('img');

        renderPrevImg(file, imgElement);

        imgElement.width = '55';
        imgElement.height = '50';
        imgElement.alt = 'Фото жилья';
        imgElement.draggable = 'true';
        imgElement.style.margin = '3px';

        fragment.appendChild(imgElement);
      }
    });
    return fragment;
  };

  avatarInputField.addEventListener('change', function () {
    renderPrevImg(avatarInputField.files[0], avatarElement);
  });
  avatarDropZoneElement.addEventListener('dragenter', function (evt) {
    evt.target.style.outline = '2px solid red';
    evt.preventDefault();
  });
  avatarDropZoneElement.addEventListener('dragleave', function (evt) {
    evt.target.style.outline = '';
    evt.preventDefault();
  });
  avatarDropZoneElement.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });
  avatarDropZoneElement.addEventListener('drop', function (evt) {
    evt.preventDefault();

    evt.target.style.outline = '';

    renderPrevImg(evt.dataTransfer.files[0], avatarElement);
  });

  housingInputField.addEventListener('change', function () {
    housingPhotoBox.appendChild(createHousingPhotosFragment(housingInputField));
  });
  housingPhotoDropZone.addEventListener('dragenter', function (evt) {
    evt.target.style.outline = '2px solid red';
    evt.preventDefault();
  });
  housingPhotoDropZone.addEventListener('dragleave', function (evt) {
    evt.target.style.outline = '';
    evt.preventDefault();
  });
  housingPhotoDropZone.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });
  housingPhotoDropZone.addEventListener('drop', function (evt) {
    evt.preventDefault();

    evt.target.style.outline = '';

    var files = evt.dataTransfer;

    housingPhotoBox.appendChild(createHousingPhotosFragment(files));
  });

  housingPhotoBox.addEventListener('dragstart', function (evt) {
    if (evt.target.tagName === 'IMG') {
      draggedItemElement = evt.target;
    }
  });
  housingPhotoBox.addEventListener('dragover', function (evt) {
    evt.preventDefault();
  });
  housingPhotoBox.addEventListener('drop', function (evt) {
    if (evt.target.tagName === 'IMG') {
      if (evt.target.offsetTop === draggedItemElement.offsetTop) {
        if (evt.target.offsetLeft < draggedItemElement.offsetLeft) {
          evt.target.insertAdjacentElement('beforebegin', draggedItemElement);
        } else if (evt.target.offsetLeft > draggedItemElement.offsetLeft) {
          evt.target.insertAdjacentElement('afterend', draggedItemElement);
        }
      } else {
        if (evt.target.offsetTop < draggedItemElement.offsetTop) {
          evt.target.insertAdjacentElement('beforebegin', draggedItemElement);
        } else if (evt.target.offsetTop > draggedItemElement.offsetTop) {
          evt.target.insertAdjacentElement('afterend', draggedItemElement);
        }
      }
    }
    evt.preventDefault();
  });
})();
