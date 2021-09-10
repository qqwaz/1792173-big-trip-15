import { createElement } from '../utils.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

const template = (point) => {
  const startDate = dayjs(point.dateFrom).format('MMM DD');
  const startTime = dayjs(point.dateFrom).format('HH:mm');
  const endTime = dayjs(point.dateTo).format('HH:mm');
  const durationTime = (() => {
    const diff = dayjs.extend(duration).duration(dayjs(point.dateTo).diff(point.dateFrom));
    return [
      diff.days() ? diff.format('DD[D]') : '',
      diff.hours() ? diff.format('HH[H]') : '',
      diff.minutes() ? diff.format('mm[M]') : '',
    ].join(' ');
  })();

  const icon = `img/icons/${point.type}.png`;
  const title = `${point.type} ${point.destination.name}`;
  const price = point.basePrice;

  const offersListElement = point.offers
    .map((offer) =>`
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>
    `)
    .join('');

  const isFavorite = point.isFavorite ? 'event__favorite-btn--active': '';

  return `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${startDate}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src=${icon} alt="Event type icon">
        </div>
        <h3 class="event__title">${title}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${endTime}</time>
          </p>
          <p class="event__duration">${durationTime}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersListElement}
        </ul>
        <button class="event__favorite-btn ${isFavorite}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
};

export default class Event {
  constructor(point) {
    this._point = point;
    this._element = null;
  }

  getTemplate() {
    return template(this._point);
  }

  getElement(selector) {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return selector
      ? this._element.querySelector(selector)
      : this._element;
  }

  removeElement() {
    this._element = null;
  }
}
