import AbstractView from './abstract.js';

const template = (filters, current) => {
  const filterListElement = filters
    .map((filter) => `
      <div class="trip-filters__filter">
        <input
          id="filter-${filter}"
          class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
          value="${filter}"
          ${current === filter ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
      </div>`)
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterListElement}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`);
};

export default class Filter extends AbstractView {
  constructor(filters, current) {
    super();
    this._filters = filters;
    this._current = current;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  getTemplate() {
    return template(this._filters, this._current);
  }

  _filterChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterChange(evt.target.value);
  }

  setFilterChangeHandler(callback) {
    this._callback.filterChange = callback;
    this.getElement().addEventListener('change', this._filterChangeHandler);
  }
}
