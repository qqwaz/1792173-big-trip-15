import AbstractView from './abstract.js';
import { formatDateShort } from '../utils/date.js';

const template = (points) => {
  const cities = points.map((x) => x.destination.name);
  const tripTitle = cities.length > 3
    ? [cities[0], '...', cities[cities.length - 1]].join(' &mdash; ')
    : cities.join(' &mdash; ');

  const dateFrom = formatDateShort(points[0].dateFrom);
  const dateTo = formatDateShort(points[points.length - 1].dateTo);
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

export default class Summary extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return template(this._points);
  }
}
