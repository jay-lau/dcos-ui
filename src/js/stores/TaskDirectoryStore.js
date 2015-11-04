import _ from "underscore";

import ActionTypes from "../constants/ActionTypes";
import AppDispatcher from "../events/AppDispatcher";
import Config from "../config/Config";
import EventTypes from "../constants/EventTypes";
import GetSetMixin from "../mixins/GetSetMixin";
import Store from "../utils/Store";
import TaskDirectoryActions from "../events/TaskDirectoryActions";

var requestInterval = null;
var request = null;

function fetchState(task, deeperPath) {
  request = TaskDirectoryActions.fetchNodeState(
    task,
    function (response) {
      request = TaskDirectoryActions.fetchDirectory(task, deeperPath, response);
    }
  );
}

function startPolling(task, deeperPath) {
  if (requestInterval == null) {
    fetchState(task, deeperPath);

    requestInterval = setInterval(
      fetchState.bind(this, task, deeperPath), Config.getRefreshRate()
    );
  }
}

var TaskDirectoryStore = Store.createStore({
  mixins: [GetSetMixin],

  getSet_data: {
    directory: null,
    innerPath: ""
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);

    if (_.isEmpty(this.listeners(EventTypes.TASK_DIRECTORY_CHANGE))) {
      this.resetRequests();
      this.set({innerPath: "", directory: []});
    }
  },

  resetRequests: function () {
    if (requestInterval != null) {
      clearInterval(requestInterval);
      requestInterval = null;
    }

    if (request != null) {
      request.abort();
      request = null;
    }
  },

  getDirectory: function (task, deeperPath) {
    this.resetRequests();
    this.set({directory: null});

    startPolling(task, deeperPath);
  },

  addPath: function (task, path) {
    this.set({innerPath: this.get("innerPath") + "/" + path});
    this.getDirectory(task, this.get("innerPath"));
  },

  writePath: function (task, path) {
    this.set({innerPath: path});
    this.getDirectory(task, path);
  },

  processStateError: function () {
    this.emit(EventTypes.TASK_DIRECTORY_ERROR);
  },

  processStateSuccess: function (directory) {
    this.set({directory});
    this.emit(EventTypes.TASK_DIRECTORY_CHANGE);
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    if (payload.source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    var action = payload.action;
    switch (action.type) {
      case ActionTypes.REQUEST_TASK_DIRECTORY_SUCCESS:
        TaskDirectoryStore.processStateSuccess(action.data);
        break;
      case ActionTypes.REQUEST_TASK_DIRECTORY_ERROR:
        TaskDirectoryStore.processStateError();
        break;
    }

    return true;
  })
});

module.exports = TaskDirectoryStore;
