import { createElement } from '../utils.js';

const template = (filter) => {
  switch (filter) {
    case 'Everything': return '<p class="trip-events__msg">Click New Event to create your first point</p>';
    case 'Past': return '<p class="trip-events__msg">There are no past events now</p>';
    case 'Future': return '<p class="trip-events__msg">There are no future events now</p>';
  }
};

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
