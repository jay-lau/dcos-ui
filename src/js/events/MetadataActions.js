import {RequestUtil} from 'mesosphere-shared-reactjs';
import {Hooks} from 'PluginSDK';

import ActionTypes from '../constants/ActionTypes';
import AppDispatcher from './AppDispatcher';
import Config from '../config/Config';

var MetadataActions = {

  fetch() {
    // Checks capability to metadata API
    if (!Hooks.applyFilter('hasCapability', false, 'metadataAPI')) {
      return;
    }

    RequestUtil.json({
      url: Config.rootUrl + '/metadata',
      success(response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_METADATA,
          data: response
        });
      }
    });

    RequestUtil.json({
      url: Config.rootUrl + '/dcos-metadata/dcos-version.json',
      success(response) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_DCOS_METADATA,
          data: response
        });
      }
    });
  }

};

module.exports = MetadataActions;
