import PointEditView from '../view/point-edit.js';
import PointView from '../view/point.js';
import { render, RenderPosition, KEY_ESCAPE, replace, remove } from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';
import { isOnline } from '../utils/common.js';
import { toast } from '../utils/toast.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class Point {
  constructor(container, dataChange, modeChange) {
    this._container = container;
    this._dataChange = dataChange;
    this._modeChange = modeChange;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;
    this._offersModel = null;
    this._destinationsModel = null;

    this._escapeKeyDownHandler = this._escapeKeyDownHandler.bind(this);
    this._cancelClickHandler = this._cancelClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  init(point, offersModel, destinationsModel) {
    this._point = point;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    const prevPoint = this._pointComponent;
    const prevEditPoint = this._pointEditComponent;

    this._pointComponent = new PointView(this._point);
    this._pointEditComponent = new PointEditView(this._point, this._getOffers(), this._getDestinations());
    this._pointComponent.setEditClickHandler(this._editClickHandler);
    this._pointComponent.setFavoriteClickHandler(this._favoriteClickHandler);
    this._pointEditComponent.setFormSubmitHandler(this._formSubmitHandler);
    this._pointEditComponent.setCancelClickHandler(this._cancelClickHandler);
    this._pointEditComponent.setDeleteClickHandler(this._deleteClickHandler);

    if (prevPoint === null || prevEditPoint === null) {
      render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPoint);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointComponent, prevEditPoint);
      this._mode = Mode.DEFAULT;
    }

    remove(prevPoint);
    remove(prevEditPoint);
  }

  _getOffers() {
    return this._offersModel.getOffers();
  }

  _getDestinations() {
    return this._destinationsModel.getDestinations();
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToView();
    }
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        break;
    }
  }

  _replaceViewToEdit() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._escapeKeyDownHandler);
    this._pointEditComponent.setCancelClickHandler(this._cancelClickHandler);
    this._modeChange();
    this._mode = Mode.EDITING;
  }

  _replaceEditToView() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener('keydown', this._escapeKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escapeKeyDownHandler(evt) {
    if (evt.key === KEY_ESCAPE) {
      evt.preventDefault();
      this._pointEditComponent.reset(this._point);
      this._replaceEditToView();
    }
  }

  _cancelClickHandler() {
    this._pointEditComponent.reset(this._point);
    this._replaceEditToView();
  }

  _editClickHandler() {
    if (!isOnline()) {
      toast('You can\'t edit point offline');
      return;
    }

    this._replaceViewToEdit();
  }

  _favoriteClickHandler() {
    this._dataChange(
      UserAction.UPDATE,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _formSubmitHandler(point) {
    if (!isOnline()) {
      toast('You can\'t save point offline');
      return;
    }

    this._dataChange(
      UserAction.UPDATE,
      UpdateType.MINOR,
      point);
  }

  _deleteClickHandler(point) {
    if (!isOnline()) {
      toast('You can\'t delete point offline');
      return;
    }

    this._dataChange(
      UserAction.DELETE,
      UpdateType.MINOR,
      point,
    );
  }

}


