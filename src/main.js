import MenuView from './view/menu.js';
import SummaryView from './view/summary.js';
import FiltersView from './view/filters.js';
import SortingView from './view/sorting.js';
import EventsListView from './view/events-list.js';
import EventEditView from './view/event-edit.js';
import EventView from './view/event.js';
import EmptyView from './view/empty.js';
import { getPoints } from './mocks/points.mock.js';
import { render, RenderPosition, getRandomInt } from './utils.js';

const POINTS_AMOUNT = getRandomInt(15, 20);
const points = getPoints(POINTS_AMOUNT);

const renderEvent = (container, event) => {
  const eventViewComponent = new EventView(event);
  const eventEditComponent = new EventEditView(event);

  const replaceViewToEdit = () => {
    container.replaceChild(eventEditComponent.getElement(), eventViewComponent.getElement());
  };

  const replaceEditToView = () => {
    container.replaceChild(eventViewComponent.getElement(), eventEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceEditToView();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const onCancelClick = () => {
    replaceEditToView();
  };

  eventViewComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceViewToEdit();
    document.addEventListener('keydown', onEscKeyDown);
    eventEditComponent.getElement('.event__reset-btn').addEventListener('click', onCancelClick);
  });

  eventEditComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceEditToView();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(container, eventViewComponent.getElement(), RenderPosition.BEFOREEND);
};

const headerContainerElement = document.querySelector('.trip-main');
const menuContainerElement = headerContainerElement.querySelector('.trip-controls__navigation');
const filtersContainerElement = headerContainerElement.querySelector('.trip-controls__filters');

render(menuContainerElement, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(filtersContainerElement, new FiltersView().getElement(), RenderPosition.BEFOREEND);

const contentContainerElement = document.querySelector('.trip-events');

if (points.length === 0 ) {
  render(contentContainerElement, new EmptyView('Everything').getElement(), RenderPosition.BEFOREEND);
} else {
  render(headerContainerElement, new SummaryView(points).getElement(), RenderPosition.AFTERBEGIN);

  render(contentContainerElement, new SortingView().getElement(), RenderPosition.BEFOREEND);
  render(contentContainerElement, new EventsListView().getElement(), RenderPosition.BEFOREEND);

  const eventsContainerElement = contentContainerElement.querySelector('.trip-events__list');
  points.forEach((point) => renderEvent(eventsContainerElement, point));
}

