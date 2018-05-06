'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'ico'];
  var avatarInpitField = document.querySelector('#avatar');
  var avatarElement = document.querySelector('.ad-form-header__preview img');
  var dropZoneElement = document.querySelector('.ad-form-header__drop-zone');

  var checkFileAndRenderPrevImg = function (file) {
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarElement.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  avatarInpitField.addEventListener('change', function () {
    checkFileAndRenderPrevImg(avatarInpitField.files[0]);
  });

  dropZoneElement.addEventListener('dragenter', function (evt) {
    evt.target.style.outline = '2px solid red';
    evt.preventDefault();
  });

  dropZoneElement.addEventListener('dragleave', function (evt) {
    evt.target.style.outline = '';
    evt.preventDefault();
  });

  dropZoneElement.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });

  dropZoneElement.addEventListener('drop', function (evt) {
    evt.preventDefault();

    evt.target.style.outline = '';

    checkFileAndRenderPrevImg(evt.dataTransfer.files[0]);
  });
})();
