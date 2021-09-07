import {createMenuTemplate} from './view/menu.js';
import {createSummaryTemplate} from './view/summary.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortingTemplate} from './view/sorting.js';
import {createEventsListTemplate} from './view/events-list.js';
import {createEventEditTemplate} from './view/event-edit.js';
import {createEventTemplate} from './view/event.js';
import { getPoints } from './mocks/points.mock.js';
import * as Utl from './utils.js';

const POINTS_AMOUNT = Utl.getRandomInt(15, 20);
const points = getPoints(POINTS_AMOUNT);

const render = (container, template, place) => container.insertAdjacentHTML(place, template);

const headerContainerElement = document.querySelector('.trip-main');
const menuContainerElement = headerContainerElement.querySelector('.trip-controls__navigation');
const filtersContainerElement = headerContainerElement.querySelector('.trip-controls__filters');

render(headerContainerElement, createSummaryTemplate(points), 'afterbegin');
render(menuContainerElement, createMenuTemplate(), 'beforeend');
render(filtersContainerElement, createFiltersTemplate(), 'beforeend');

const contentContainerElement = document.querySelector('.trip-events');
render(contentContainerElement, createSortingTemplate(), 'beforeend');
render(contentContainerElement, createEventsListTemplate(), 'beforeend');

const eventsContainerElement = contentContainerElement.querySelector('.trip-events__list');
render(eventsContainerElement, createEventEditTemplate(points[0]), 'beforeend');

for (let i = 1; i < POINTS_AMOUNT; i++) {
  render(eventsContainerElement, createEventTemplate(points[i]), 'beforeend');
}
