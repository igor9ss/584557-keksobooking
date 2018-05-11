'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'ico'];
  var IMAGE_WIDTH = '55';
  var IMAGE_HEIGHT = '50';
  var IMAGE_ALT = 'Фото жилья';
  var IMAGE_DRAGGABLE = 'true';
  var IMAGE_MARGIN = '3px';

  var avatarInputFieldElement = document.querySelector('#avatar');
  var avatarElement = document.querySelector('.ad-form-header__preview img');
  var avatarDropZoneElement = document.querySelector('.ad-form-header__drop-zone');
  var inputFieldElement = document.querySelector('#images');
  var photoBoxElement = document.querySelector('.ad-form__photo');
  var photoDropZoneElement = document.querySelector('.ad-form__drop-zone');

  var draggedItemElement;

  var checkFileForImg = function (file) {
    var fileName = file.name.toLowerCase();

    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };
  var renderPrevImg = function (file, element) {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      element.src = reader.result;
    });

    reader.readAsDataURL(file);
  };
  var createHousingPhotosFragment = function (element) {
    var fragment = document.createDocumentFragment();

    Array.from(element.files).forEach(function (file) {

      if (checkFileForImg(file)) {
        var imgElement = document.createElement('img');

        renderPrevImg(file, imgElement);

        imgElement.width = IMAGE_WIDTH;
        imgElement.height = IMAGE_HEIGHT;
        imgElement.alt = IMAGE_ALT;
        imgElement.draggable = IMAGE_DRAGGABLE;
        imgElement.style.margin = IMAGE_MARGIN;

        fragment.appendChild(imgElement);
      }
    });
    return fragment;
  };

  avatarInputFieldElement.addEventListener('change', function () {
    renderPrevImg(avatarInputFieldElement.files[0], avatarElement);
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

  inputFieldElement.addEventListener('change', function () {
    photoBoxElement.appendChild(createHousingPhotosFragment(inputFieldElement));
  });
  photoDropZoneElement.addEventListener('dragenter', function (evt) {
    evt.target.style.outline = '2px solid red';
    evt.preventDefault();
  });
  photoDropZoneElement.addEventListener('dragleave', function (evt) {
    evt.target.style.outline = '';
    evt.preventDefault();
  });
  photoDropZoneElement.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });
  photoDropZoneElement.addEventListener('drop', function (evt) {
    evt.preventDefault();

    evt.target.style.outline = '';

    var files = evt.dataTransfer;

    photoBoxElement.appendChild(createHousingPhotosFragment(files));
  });

  photoBoxElement.addEventListener('dragstart', function (evt) {
    if (evt.target.tagName === 'IMG') {
      draggedItemElement = evt.target;
    }
  });
  photoBoxElement.addEventListener('dragover', function (evt) {
    evt.preventDefault();
  });
  photoBoxElement.addEventListener('drop', function (evt) {
    var target = evt.target;
    if (target.tagName === 'IMG') {
      if (target.offsetTop === draggedItemElement.offsetTop) {
        if (target.offsetLeft < draggedItemElement.offsetLeft) {
          target.insertAdjacentElement('beforebegin', draggedItemElement);
        } else if (target.offsetLeft > draggedItemElement.offsetLeft) {
          target.insertAdjacentElement('afterend', draggedItemElement);
        }
      } else {
        if (target.offsetTop < draggedItemElement.offsetTop) {
          target.insertAdjacentElement('beforebegin', draggedItemElement);
        } else if (target.offsetTop > draggedItemElement.offsetTop) {
          target.insertAdjacentElement('afterend', draggedItemElement);
        }
      }
    }
    evt.preventDefault();
  });
})();
