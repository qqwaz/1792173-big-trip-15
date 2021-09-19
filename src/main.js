import MenuView from './view/menu.js';
import StatsView from './view/stats.js';
import FilterPresenter from './presenter/filter.js';
import TripPresenter from './presenter/trip.js';
import SummaryPresenter from './presenter/summary.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import { render, RenderPosition, remove } from './utils/render.js';
import { MenuItem, UpdateType } from './const.js';
import { getRandomString } from './utils/common.js';
import Api from './api/api.js';
import { isOnline } from './utils/common.js';
import { toast } from './utils/toast.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = `Basic ${getRandomString()}`;
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'bigtrip-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

let statsComponent = null;
const statsContainerElement = document.querySelector('.page-body__container');
const headerContainerElement = document.querySelector('.trip-main');
const menuContainerElement = headerContainerElement.querySelector('.trip-controls__navigation');
const filtersContainerElement = headerContainerElement.querySelector('.trip-controls__filters');
const contentContainerElement = document.querySelector('.trip-events');
const newPointButtonElement = document.querySelector('.trip-main__event-add-btn');
const menuComponent = new MenuView();

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const filterPresenter = new FilterPresenter(filtersContainerElement, filterModel, pointsModel);
filterPresenter.init();

const tripPresenter = new TripPresenter(contentContainerElement, pointsModel, filterModel, offersModel, destinationsModel, apiWithProvider);
tripPresenter.init();

const summaryPresenter = new SummaryPresenter(headerContainerElement, pointsModel);
summaryPresenter.init();

const PointNewFormCloseHandler = () => {
  newPointButtonElement.disabled = false;
  menuComponent.setMenuItem(MenuItem.TABLE);
};
newPointButtonElement.addEventListener('click', (evt) => {
  evt.preventDefault();
  if (!isOnline()) {
    toast('You can\'t create new point offline');
  }
  tripPresenter.createPoint(PointNewFormCloseHandler);
  newPointButtonElement.disabled = true;
});

const menuClickHandler = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      filterPresenter.enableFilters();
      remove(statsComponent);
      tripPresenter.init();
      newPointButtonElement.disabled = false;
      break;
    case MenuItem.STATS:
      filterPresenter.disableFilters();
      statsComponent = new StatsView(pointsModel.getPoints());
      render(statsContainerElement, statsComponent, RenderPosition.BEFOREEND);
      tripPresenter.destroy();
      newPointButtonElement.disabled = true;
      break;
  }
};

Promise.all([
  apiWithProvider.getDestinations(),
  apiWithProvider.getOffers(),
  apiWithProvider.getPoints(),
])
  .then((data) => {
    destinationsModel.setDestinations(data[0]);
    offersModel.setOffers(data[1]);
    pointsModel.setPoints(UpdateType.INIT, data[2]);
    render(menuContainerElement, menuComponent, RenderPosition.BEFOREEND);
    menuComponent.setMenuClickHandler(menuClickHandler);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    render(menuContainerElement, menuComponent, RenderPosition.BEFOREEND);
    menuComponent.setMenuClickHandler(menuClickHandler);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
