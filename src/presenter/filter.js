import FilterView from '../view/filter.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { FilterType, UpdateType } from '../const.js';
import { PointFilter } from '../utils/point.js';

export default class Filter {
  constructor(container, filterModel, pointsModel) {
    this._container = container;

    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._filterComponent = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._pointsModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);
  }

  init() {
    const filters = this._getFilters();
    const prevFilter = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterChangeHandler(this._filterChangeHandler);

    if (prevFilter === null) {
      render(this._container, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilter);
    remove(prevFilter);
  }

  _modelEventHandler() {
    this.init();
  }

  _filterChangeHandler(filter) {
    if (this._filterModel.getFilter() === filter) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filter);
  }

  _getFilters() {
    const points = this._pointsModel.getPoints();

    const getFilter = (filter) => ({
      name: filter,
      disabled: PointFilter[filter](points).length === 0,
    });

    return [
      getFilter(FilterType.EVERYTHING),
      getFilter(FilterType.FUTURE),
      getFilter(FilterType.PAST)];
  }

  enableFilters() {
    const filters = this._filterComponent.getElement().querySelectorAll('.trip-filters__filter-input');
    filters.forEach((filter) => filter.disabled = false);
  }

  disableFilters() {
    const filters = this._filterComponent.getElement().querySelectorAll('.trip-filters__filter-input');
    filters.forEach((filter) => filter.disabled = true);
  }

}
