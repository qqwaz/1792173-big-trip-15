import AbstractView from './abstract.js';
import { SortingType, DISABLED_SORTING_TYPES } from '../const.js';

const template = (sorting) => {
  const sortingListElement = [
    SortingType.DAY,
    SortingType.EVENT,
    SortingType.TIME,
    SortingType.PRICE,
    SortingType.OFFER]
    .map((type) => `<div class="trip-sort__item  trip-sort__item--${type}">
      <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}"
        ${sorting === type ? 'checked' : ''} ${DISABLED_SORTING_TYPES.includes(type) ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${type}" data-sorting-type="${type}">${type}</label>
    </div>`)
    .join('');

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortingListElement}
    </form>`);
};

export default class Sorting extends AbstractView {
  constructor(sorting) {
    super();
    this._sorting = sorting;
    this._sortingChangeHandler = this._sortingChangeHandler.bind(this);
  }

  getTemplate() {
    return template(this._sorting);
  }

  _sortingChangeHandler(evt) {
    if (!evt.target.classList.contains('trip-sort__btn') || DISABLED_SORTING_TYPES.includes(evt.target.dataset.sortingType)) {
      return;
    }
    this._callback.sortingChange(evt.target.dataset.sortingType);
  }

  setSortingChangeHandler(callback) {
    this._callback.sortingChange = callback;
    this.getElement().addEventListener('click', this._sortingChangeHandler);
  }

}
