import AbstractView from './abstract.js';
import { SortingType } from '../const.js';

const template = (sorting) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <div class="trip-sort__item  trip-sort__item--day">
    <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" ${sorting === SortingType.DAY ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-day" data-sorting-type="${SortingType.DAY}">Day</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--event">
    <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
    <label class="trip-sort__btn" for="sort-event">Event</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--time">
    <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${sorting === SortingType.TIME ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-time" data-sorting-type="${SortingType.TIME}">Time</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--price">
    <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${sorting === SortingType.PRICE ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-price" data-sorting-type="${SortingType.PRICE}">Price</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--offer">
    <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
    <label class="trip-sort__btn" for="sort-offer">Offers</label>
  </div>
</form>`
);

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
    if (!evt.target.classList.contains('trip-sort__btn')) {
      return;
    }
    this._callback.sortingChange(evt.target.dataset.sortingType);
  }

  setSortingChangeHandler(callback) {
    this._callback.sortingChange = callback;
    this.getElement().addEventListener('click', this._sortingChangeHandler);
  }

}
