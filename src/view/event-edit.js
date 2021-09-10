import { POINT_TYPES } from '../const.js';
import { destinations } from '../mocks/destinations.mock.js';
import { getOffers } from '../mocks/offers.mock.js';
import { format } from 'date-fns';

export const createEventEditTemplate = (point) => {

  const createTypeElement = () => {
    const typesListElement = POINT_TYPES
      .map((type) => `
        <div class="event__type-item">
          <input
            id="event-type-${type}-1"
            class="event__type-input visually-hidden"
            type="radio" name="event-type"
            value=${type}
          >
          <label
            class="event__type-label event__type-label--${type}"
            for="event-type-${type}-1"
          >
            ${type}
          </label>
        </div>`)
      .join('');

    const icon = point ? `img/icons/${point.type}.png` : '';

    return `
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src=${icon} alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
              ${typesListElement}
          </fieldset>
        </div>
      </div>`;
  };

  const createDestinationElement = () => {
    const citiesListElement = destinations
      .map((item) => `
        <option value=${item.name}>${item.name}</option>`)
      .join('');

    const destination = point ? point.destination.name : '';
    const type = point ? point.type : '';

    return `
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input
          class="event__input event__input--destination"
          id="event-destination-1"
          type="text"
          name="event-destination"
          value="${destination}"
          list="destination-list-1"
        >
        <datalist id="destination-list-1">
            ${citiesListElement}
        </datalist>
      </div>`;
  };

  const createTimeElement = () => {
    const startTime = point ? format(point.dateFrom, 'dd/MM/yy HH:mm') : '';
    const endTime = point ? format(point.dateTo, 'dd/MM/yy HH:mm') : '';

    return `
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}">
      </div>`;
  };

  const createPriceElement = () => {
    const price = point ? point.basePrice : '';

    return `
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>`;
  };

  const createOffersListElement = () => {
    const availableOffers = point && getOffers(point.type);

    if (!availableOffers) {
      return '';
    }

    const offersListElement = availableOffers
      .map((offer, index) => {
        const isChecked = point.offers.find((el) => offer.title === el.title);
        return `
          <div class="event__offer-selector">
            <input
              class="event__offer-checkbox visually-hidden"
              id="event-offer-${index}"
              type="checkbox"
              name="event-offer-${index}"
              ${isChecked ? 'checked' : ''}
            >
            <label
              class="event__offer-label"
              for="event-offer-${index}"
            >
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`;
      })
      .join('');

    return `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offersListElement}
        </div>
      </section>`;
  };

  const createDestinationDetailsElement = () => {
    const description = point ? point.destination.description : '';

    const photosListElement = point
      ? point.destination.pictures
        .map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`)
      : '';

    return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${photosListElement}
          </div>
        </div>
      </section>`;
  };

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">

        ${createTypeElement()}

        ${createDestinationElement()}

        ${createTimeElement()}

        ${createPriceElement()}

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>

      <section class="event__details">

        ${createOffersListElement()}

        ${createDestinationDetailsElement()}

      </section>
    </form>
  </li>`;
};
