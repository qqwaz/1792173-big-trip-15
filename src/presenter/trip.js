import EmptyView from '../view/empty.js';
import LoadingView from '../view/loading.js';
import SortingView from '../view/sorting.js';
import PointsListView from '../view/points-list.js';
import PointPresenter, { State as PointPresenterState } from './point.js';
import PointNewPresenter from './point-new.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { FilterType, SortingType, UpdateType, UserAction } from '../const.js';
import { sortByDayDesc, sortByPriceDesc, sortByDurationDesc, PointFilter } from '../utils/point.js';

export default class Trip {
  constructor(container, pointsModel, filterModel, offersModel, destinationsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._api = api;
    this._pointPresenter = new Map();
    this._isLoading = true;

    this._sortingComponent = null;
    this._emptyComponent = null;

    this._pointsListComponent = new PointsListView();
    this._loadingComponent = new LoadingView();

    this._modeChangeHandler = this._modeChangeHandler.bind(this);
    this._sortingChangeHandler = this._sortingChangeHandler.bind(this);
    this._viewActionHandler = this._viewActionHandler.bind(this);
    this._modelEventHandler = this._modelEventHandler.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._pointsListComponent, this._viewActionHandler);
  }

  init() {
    this._pointsModel.addObserver(this._modelEventHandler);
    this._filterModel.addObserver(this._modelEventHandler);
    this._offersModel.addObserver(this._modelEventHandler);

    this._currentSorting = SortingType.DAY;
    this._currentFilter = FilterType.EVERYTHING;

    this._renderTrip();
  }

  destroy() {
    this._clearTrip({ resetSorting: true });

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._offersModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    this._currentSorting = SortingType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(this._offersModel, this._destinationsModel, callback);
  }

  _getPoints() {
    this._currentFilter = this._filterModel.getFilter();

    const points = this._pointsModel.getPoints();
    const filtredPoints = PointFilter[this._currentFilter](points);

    switch(this._currentSorting) {
      case SortingType.DAY:
        return filtredPoints.sort(sortByDayDesc);
      case SortingType.TIME:
        return filtredPoints.sort(sortByDurationDesc);
      case SortingType.PRICE:
        return filtredPoints.sort(sortByPriceDesc);
    }
  }

  _renderEmpty() {
    this._emptyComponent = new EmptyView(this._currentFilter);
    render(this._container, this._emptyComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this._container, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSorting);
    this._sortingComponent.setSortingChangeHandler(this._sortingChangeHandler);

    render(this._container, this._sortingComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(container, point) {
    const pointPresenter = new PointPresenter(container, this._viewActionHandler, this._modeChangeHandler);
    pointPresenter.init(point, this._offersModel, this._destinationsModel);

    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints();
    if (points.length === 0 ) {
      this._renderEmpty();
      return;
    }

    this._renderSorting();

    render(this._container, this._pointsListComponent, RenderPosition.BEFOREEND);
    points.forEach((point) => this._renderPoint(this._pointsListComponent, point));
  }

  _clearTrip({ resetSorting = false } = {}) {
    remove(this._emptyComponent);
    remove(this._loadingComponent);
    remove(this._sortingComponent);
    remove(this._pointsListComponent);

    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    if(resetSorting) {
      this._currentSorting = SortingType.DAY;
    }
  }

  _viewActionHandler(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE:
        this._pointPresenter.get(update.id).setViewState(PointPresenterState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterState.ABORTING);
          });
        break;
      case UserAction.ADD:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE:
        this._pointPresenter.get(update.id).setViewState(PointPresenterState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setViewState(PointPresenterState.ABORTING);
          });
        break;
    }
  }

  _modelEventHandler(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip(true);
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _modeChangeHandler() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _sortingChangeHandler(sorting) {
    if (this._currentSorting === sorting) {
      return;
    }
    this._currentSorting = sorting;
    this._clearTrip();
    this._renderTrip();
  }

}
