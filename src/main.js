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
import Api from './api.js';

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2j';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
const api = new Api(END_POINT, AUTHORIZATION);

let statsComponent = null;
const statsContainerElement = document.querySelector('.page-body__container');
const headerContainerElement = document.querySelector('.trip-main');
const menuContainerElement = headerContainerElement.querySelector('.trip-controls__navigation');
const filtersContainerElement = headerContainerElement.querySelector('.trip-controls__filters');
const contentContainerElement = document.querySelector('.trip-events');
const newPointButtonElement = document.querySelector('.trip-main__event-add-btn');
const menuComponent = new MenuView();

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const filterPresenter = new FilterPresenter(filtersContainerElement, filterModel, pointsModel);
filterPresenter.init();

const tripPresenter = new TripPresenter(contentContainerElement, pointsModel, filterModel, offersModel, destinationsModel, api);
tripPresenter.init();

const summaryPresenter = new SummaryPresenter(headerContainerElement, pointsModel);
summaryPresenter.init();

const PointNewFormCloseHandler = () => {
  newPointButtonElement.disabled = false;
  menuComponent.setMenuItem(MenuItem.TASKS);
};
newPointButtonElement.addEventListener('click', (evt) => {
  evt.preventDefault();
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
  api.getDestinations(),
  api.getOffers(),
  api.getPoints(),
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

