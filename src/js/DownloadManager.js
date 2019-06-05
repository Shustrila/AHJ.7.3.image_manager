import QueryServer from './QueryServer';

class DownloadManager {
  constructor(root) {
    this._root = root;
    this._api = {};
    this._form = {};
    this._inputFile = {};
    this._listFile = {};
    this._button = {};
    this._formData = {};
    this._arrayFiles = [];
  }

  _createArrayFiles(array) {
    this._arrayFiles = [];

    const files = Array.from(array);

    for (const file of files) {
      this._arrayFiles.push(file);
    }

    this._form.dispatchEvent(new MouseEvent('submit'));
  }

  _eventButtonDrop(e) {
    e.preventDefault();

    this._createArrayFiles(e.dataTransfer.files);
    this._eventButtonLeave();
  }

  _eventButtonEnter() {
    this._button.innerHTML = '+';
    this._button.style.fontSize = '50px';
  }

  _eventButtonLeave() {
    this._button.innerHTML = 'Drag and Drop files here or Click to select';
    this._button.removeAttribute('style');
  }

  _uiImage(file) {
    const image = document.createElement('a');
    const remove = document.createElement('button');
    const item = document.createElement('li');
    const url = file.url;

    image.className = 'download-manager__image';
    image.download = file.name;
    image.href = url;
    image.style.backgroundImage = `url(${file.url})`;

    remove.className = 'download-manager__remove-image';
    remove.innerHTML = 'X';
    remove.addEventListener('click', async () => {
      await this.api.delete(file.id, () => item.remove());
    });

    item.className = 'download-manager__item-image';
    item.appendChild(image);
    item.appendChild(remove);

    return item;
  }

  _changeInputFile(e) {
    e.preventDefault();

    this._createArrayFiles(e.currentTarget.files);
    e.currentTarget.value = '';
  }

  async _submitForm(e) {
    e.preventDefault();

    const regexp = new RegExp('^(image/)', 'i');

    this._formData = new FormData();

    for (const file of this._arrayFiles) {
      if (regexp.test(file.type)) {
        this._formData.append('images', file);
      }
    }

    await this.api.post(this._formData, list => {
      this._listFile.innerHTML = '';

      for (const item of list) {
        const img = this._uiImage(item);

        this._listFile.appendChild(img);
      }
    });
  }

  _createFormImages() {
    this._button = document.createElement('button');
    this._button.className = 'download-manager__form-button';
    this._button.innerHTML = 'Drag and Drop files here or Click to select';
    this._button.addEventListener('click', e => {
      e.preventDefault();
      this._inputFile.dispatchEvent(new MouseEvent('click'));
    });
    this._button.addEventListener('dragenter', this._eventButtonEnter.bind(this));
    this._button.addEventListener('dragleave', this._eventButtonLeave.bind(this));
    this._button.addEventListener('dragover', e => e.preventDefault());
    this._button.addEventListener('drop', this._eventButtonDrop.bind(this));

    this._inputFile = document.createElement('input');
    this._inputFile.type = 'file';
    this._inputFile.className = 'download-manager__form-file';
    this._inputFile.name = 'image';
    this._inputFile.accept = 'image/*';
    this._inputFile.multiple = true;
    this._inputFile.addEventListener('change', this._changeInputFile.bind(this));

    this._form = document.createElement('form');
    this._form.className = 'download-manager__form';
    this._form.appendChild(this._button);
    this._form.appendChild(this._inputFile);
    this._form.addEventListener('submit', this._submitForm.bind(this));

    return this._form;
  }

  _createListImages() {
    this._listFile = document.createElement('ul');
    this._listFile.className = 'download-manager__list-image';

    return this._listFile;
  }

  async init() {
    const formImages = this._createFormImages();
    const listImages = this._createListImages();

    this.api = new QueryServer('https://ahj-download-manager.herokuapp.com/tickets');

    this._root.appendChild(formImages);
    this._root.appendChild(listImages);

    await this.api.get(images => {
      for (const image of images) {
        const imageNode  = this._uiImage(image);

        listImages.appendChild(imageNode);
      }
    });
  }
}

export default DownloadManager;
