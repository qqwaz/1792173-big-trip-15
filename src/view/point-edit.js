import SmartView from './smart.js';
import { POINT_TYPES, BLANK_POINT } from '../const.js';
import { capitalize } from '../utils/common.js';
import { formatDateFull } from '../utils/date.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const template = (data, destinations) => {
  const {
    isNew,
    type,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    offers,
    hasDestination,
    availableOffers,
    isDisabled,
    isSaving,
    isDeleting,
  } = data;

  const createTypeElement = () => {
    const typesListElement = POINT_TYPES
      .map((item) => `
        <div class="event__type-item">
          <input
            id="event-type-${item}-1"
            class="event__type-input visually-hidden"
            type="radio" name="event-type"
            value=${item}
          >
          <label
            class="event__type-label event__type-label--${item}"
            for="event-type-${item}-1"
          >
            ${capitalize(item)}
          </label>
        </div>`)
      .join('');

    const icon = `img/icons/${type}.png`;

    return `
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src=${icon} alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

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
      .map((item) => `<option value="${item.name}">${item.name}</option>`)
      .join('');

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
          value="${hasDestination ? destination.name : ''}"
          list="destination-list-1"
          required
          ${isDisabled ? 'disabled' : ''}
        >
        <datalist id="destination-list-1">
            ${citiesListElement}
        </datalist>
      </div>`;
  };

  const createTimeElement = () => (
    `<div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
        value="${formatDateFull(dateFrom)}"
        ${isDisabled ? 'disabled' : ''}
        required>
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
        value="${formatDateFull(dateTo)}"
        ${isDisabled ? 'disabled' : ''}
        required>
    </div>`
  );

  const createPriceElement = () => (
    `<div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" max="100000"name="event-price"
        value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
    </div>`
  );

  const createOffersListElement = () => {
    if (availableOffers.length === 0) {
      return '';
    }

    const offersListElement = availableOffers
      .map((offer, index) => {
        const isChecked = offers.some((item) => offer.title === item.title);
        return `
          <div class="event__offer-selector">
            <input
              class="event__offer-checkbox visually-hidden"
              id="event-offer-${index}"
              type="checkbox"
              name="event-offer-${index}"
              data-index = "${index}"
              ${isChecked ? 'checked' : ''}
              ${isDisabled ? 'disabled' : ''}
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
    if (!hasDestination) {
      return '';
    }

    const photosListElement = hasDestination
      ? destination.pictures
        .map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`)
      : '';

    return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${hasDestination ? destination.description : ''}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${photosListElement}
          </div>
        </div>
      </section>`;
  };

  const createActionsElement = () => `
    <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? 'Saving... ' : 'Save'}</button>
    ${isNew
    ? `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>`
    : `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting... ' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
          <span class="visually-hidden">Open event</span>
        </button>`}`;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        ${createTypeElement()}
        ${createDestinationElement()}
        ${createTimeElement()}
        ${createPriceElement()}
        ${createActionsElement()}
      </header>
      <section class="event__details">
        ${createOffersListElement()}
        ${createDestinationDetailsElement()}
      </section>
    </form>
  </li>`;
};

export default class PointEdit extends SmartView {
  constructor(point = BLANK_POINT, offers, destinations) {
    super();
    this._offers = offers;
    this._destinations = destinations;
    this._data = PointEdit.parsePointToData(point, this._offers);
    this._dateFromPicker = null;
    this._dateToPicker = null;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._cancelClickHandler = this._cancelClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._typeInputChangeHandler = this._typeInputChangeHandler.bind(this);
    this._destinationInputChangeHandler = this._destinationInputChangeHandler.bind(this);
    this._dateFromPickerChangeHandler = this._dateFromPickerChangeHandler.bind(this);
    this._dateToPickerChangeHandler = this._dateToPickerChangeHandler.bind(this);
    this._priceInputChangeHandler = this._priceInputChangeHandler.bind(this);
    this._offersListChangeHandler = this._offersListChangeHandler.bind(this);
    this._setInnerHandlers();
  }

  static parsePointToData(point, offers) {
    return Object.assign(
      {},
      point,
      {
        isNew: !point.id,
        hasDestination: point.destination !== null,
        availableOffers: offers.find((item) => item.type === point.type).offers,
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    delete data.isNew;
    delete data.hasDestination;
    delete data.availableOffers;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;
    return data;
  }

  reset(point) {
    this.updateData(
      PointEdit.parsePointToData(point, this._offers),
    );
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    if (!this._data.isNew) {
      this.setCancelClickHandler(this._callback.cancelClick);
    }
  }

  getTemplate() {
    return template(this._data, this._destinations);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement('form').addEventListener('submit', this._formSubmitHandler);
  }

  setCancelClickHandler(callback) {
    this._callback.cancelClick = callback;
    this.getElement('.event__rollup-btn').addEventListener('click', this._cancelClickHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement('.event__reset-btn').addEventListener('click', this._deleteClickHandler);
  }

  _setDateFromPicker() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }
    if (this._data.dateFrom) {
      this._dateFromPicker = flatpickr(
        this.getElement().querySelector('#event-start-time-1'),
        {
          enableTime: true,
          ['time_24hr']: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._data.dateFrom,
          onChange: this._dateFromPickerChangeHandler,
        },
      );
    }
  }

  _setDateToPicker() {
    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }
    if (this._data.dateTo) {
      this._dateToPicker = flatpickr(
        this.getElement().querySelector('#event-end-time-1'),
        {
          enableTime: true,
          ['time_24hr']: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._data.dateTo,
          minDate: this._data.dateFrom,
          onChange: this._dateToPickerChangeHandler,
        },
      );
    }
  }

  _setInnerHandlers() {
    this.getElement('.event__type-group').addEventListener('change', this._typeInputChangeHandler);
    this.getElement('.event__field-group--destination').addEventListener('change', this._destinationInputChangeHandler);
    this.getElement('.event__input--price').addEventListener('change', this._priceInputChangeHandler);
    this._setDateFromPicker();
    this._setDateToPicker();
    const offersElement = this.getElement('.event__section--offers');
    if (offersElement) {
      offersElement.addEventListener('change', this._offersListChangeHandler);
    }
  }

  _typeInputChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains('event__type-toggle')) {
      return;
    }
    this.updateData({
      type: evt.target.value,
      offers: [],
      availableOffers: this._offers.find((item) => item.type === evt.target.value).offers,
    });
  }

  _destinationInputChangeHandler(evt) {
    evt.preventDefault();
    const destination = this._destinations.find((item) => item.name === evt.target.value);
    if (!destination) {
      this.updateData({
        hasDestination: false,
      });
      return;
    }
    this.updateData({
      destination: {
        name: destination.name,
        description: destination.description,
        pictures: destination.pictures,
      },
      hasDestination: true,
    });
  }

  _dateFromPickerChangeHandler([userDate]) {
    if (!userDate) {
      this._dateFromPicker.setDate(this._data.dateFrom);
      return;
    }
    this.updateData({
      dateFrom: userDate.toISOString(),
    }, true);
    this._dateToPicker.set('minDate', userDate);
    if (this._dateToPicker.selectedDates[0] >= userDate) {
      return;
    }
    this.updateData({
      dateTo: userDate.toISOString(),
    }, true);
    this._dateToPicker.setDate(this._data.dateTo);
  }

  _dateToPickerChangeHandler([userDate]) {
    if (!userDate) {
      this._dateToPicker.setDate(this._data.dateTo);
      return;
    }
    this.updateData({
      dateTo: userDate.toISOString(),
    }, true);
  }

  _priceInputChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      basePrice: Number(evt.target.value),
    }, true);
  }

  _offersListChangeHandler(evt) {
    evt.preventDefault();
    const offerIndex = evt.target.dataset.index;
    this.updateData({
      offers: evt.target.checked
        ? [...this._data.offers, this._data.availableOffers[offerIndex]]
        : [...this._data.offers.filter((offer) => offer.title !== this._data.availableOffers[offerIndex].title)],
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointEdit.parseDataToPoint(this._data));
  }

  _cancelClickHandler(evt) {
    evt.preventDefault();
    this._callback.cancelClick();
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(PointEdit.parseDataToPoint(this._data));
  }

}
