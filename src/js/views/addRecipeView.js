import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'load new recipe successfully!';

  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _openBtn = document.querySelector('.nav__btn--add-recipe');
  _closeBtn = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._startFrom();
    this._closeForm();
  }

  toggleFrom() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _startFrom() {
    this._openBtn.addEventListener('click', this.toggleFrom.bind(this));
  }

  _closeForm() {
    this._closeBtn.addEventListener('click', this.toggleFrom.bind(this));
    this._overlay.addEventListener('click', this.toggleFrom.bind(this));
  }

  addHandlerNewRecipe(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }

  _generatMarkup() {}
}

export default new AddRecipeView();
