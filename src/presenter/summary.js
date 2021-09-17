import SummaryView from '../view/summary.js';
import { render, remove, RenderPosition } from '../utils/render.js';

export default class Summary {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._summaryComponent = null;
    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._pointsModel.addObserver(this._modelEventHandler);
  }

  init() {
    this._renderSummary();
  }

  _getPoints() {
    return this._pointsModel.getPoints();
  }

  _renderSummary() {
    const points = this._getPoints();
    if (points.length) {
      this._summaryComponent = new SummaryView(points);
      render(this._container, this._summaryComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _removeSummary() {
    remove(this._summaryComponent);
  }

  _modelEventHandler() {
    this._removeSummary();
    this._renderSummary();
  }

}
