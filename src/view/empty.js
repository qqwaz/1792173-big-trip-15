import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const EmptyMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const template = (filter) => `<p class="trip-events__msg">
    ${EmptyMessage[filter]}
  </p>`;

export default class Empty extends AbstractView {
  constructor(filter) {
    super();
    this._filter = filter;
  }

  getTemplate() {
    return template(this._filter);
  }
}
