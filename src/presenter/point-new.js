import PointEditView from '../view/point-edit.js';
import { KEY_ESCAPE, remove, render, RenderPosition } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';

export default class PointNew {
  constructor(container, dataChange) {
    this._container = container;
    this._dataChange = dataChange;

    this._pointEditComponent = null;
    this._offersModel = null;
    this._destinationsModel = null;
    this._destroyCallback = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(offersModel, destinationsModel, callback) {
    if (this._pointEditComponent !== null) {
      return;
    }
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._destroyCallback = callback;

    this._pointEditComponent = new PointEditView(undefined, this._getOffers(), this._getDestinations());
    this._pointEditComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._pointEditComponent.setDeleteClickHandler(this._deleteClickHandler);

    render(this._container, this._pointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _getOffers() {
    return this._offersModel.getOffers();
  }

  _getDestinations() {
    return this._destinationsModel.getDestinations();
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }
    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }
    remove(this._pointEditComponent);
    this._pointEditComponent = null;
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };
    this._pointEditComponent.shake(resetFormState);
  }

  _formSubmitHandler(point) {
    this._dataChange(
      UserAction.ADD,
      UpdateType.MINOR,
      point,
    );
  }

  _deleteClickHandler() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === KEY_ESCAPE) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
