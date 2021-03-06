import AbstractView from './abstract.js';
import { formatDateShort, formatTime, formatPeriod } from '../utils/date.js';

const template = (point) => {
  const startDate = formatDateShort(point.dateFrom);
  const startTime = formatTime(point.dateFrom);
  const endTime = formatTime(point.dateTo);
  const duration = formatPeriod(point.dateFrom, point.dateTo);

  const icon = `img/icons/${point.type}.png`;
  const title = `${point.type} ${point.destination? point.destination.name : ''}`;
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
          <p class="event__duration">${duration}</p>
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

export default class Point extends AbstractView {
  constructor(point) {
    super();
    this._point = point;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return template(this._point);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement('.event__rollup-btn').addEventListener('click', this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
