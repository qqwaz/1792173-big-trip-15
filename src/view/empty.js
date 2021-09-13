import { createElement } from '../utils.js';
import { FilterType } from '../const.js';

const EmptyMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const template = (filter) => `<p class="trip-events__msg">
    ${EmptyMessage[filter]}
  </p>`;

export default class Empty {
  constructor(filter) {
    this._filter = filter;
    this._element = null;
  }

  getTemplate() {
    return template(this._filter);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
