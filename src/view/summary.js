import { createElement } from '../utils.js';
import dayjs from 'dayjs';

const template = (points) => {
  const cities = points.map((x) => x.destination.name);
  const tripTitle = cities.length > 3
    ? [cities[0], '...', cities[cities.length - 1]].join(' &mdash; ')
    : cities.join(' &mdash; ');

  const dateFrom = dayjs(points[0].dateFrom).format('MMM DD');
  const dateTo = dayjs(points[points.length - 1].dateTo).format('MMM DD');
  const tripDates = `${dateFrom}&nbsp;&mdash;&nbsp;${dateTo}`;

  const tripCost = points
    .reduce((acc, x) => {
      const offersCost = x.offers.reduce((cost, y) => cost + y.price, 0);
      return acc + x.basePrice + offersCost;
    }, 0);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${tripTitle}</h1>

      <p class="trip-info__dates">${tripDates}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
    </p>
  </section>`;
};

export default class Summary {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return template(this._points);
  }

  getElement () {
    if(!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement () {
    this._element = null;
  }
}
