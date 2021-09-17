import AbstractView from './abstract.js';
import { MenuItem } from '../const.js';

const template = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-name="${MenuItem.TABLE}">Table</a>
    <a class="trip-tabs__btn" href="#" data-name="${MenuItem.STATS}">Stats</a>
  </nav>`
);

export default class Menu extends AbstractView {
  constructor() {
    super();
    this._activeItem = MenuItem.TABLE;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return template();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    const menuItem = evt.target.dataset.name;
    if (!menuItem || menuItem === this._activeItem) {
      return;
    }
    this._activeItem = menuItem;
    this.getElement('.trip-tabs__btn--active').classList.remove('trip-tabs__btn--active');
    evt.target.classList.add('trip-tabs__btn--active');
    this._callback.menuClick(this._activeItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[data-name="${menuItem}"]`);
    if (item !== null) {
      item.checked = true;
    }
  }

}
