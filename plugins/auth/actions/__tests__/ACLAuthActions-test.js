jest.dontMock('../ACLAuthActions');

var ACLAuthActions = require('../ACLAuthActions');
var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../../../../src/js/events/AppDispatcher');
var Config = require('../../../../src/js/config/Config');
var RequestUtil = require('../../../../src/js/utils/RequestUtil');

describe('ACLAuthActions', function () {

  describe('#fetchRole', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      ACLAuthActions.fetchRole('foo');
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url)
        .toEqual(Config.acsAPIPrefix + '/users/foo');
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_ROLE_SUCCESS);
      });

      this.configuration.success();
    });

    it('dispatches the correct action when unsuccessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_ROLE_ERROR);
      });

      this.configuration.error({});
    });

  });

  describe('#login', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      ACLAuthActions.login();
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url)
        .toEqual(Config.acsAPIPrefix + '/auth/login');
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_LOGIN_SUCCESS);
      });

      this.configuration.success();
    });

    it('dispatches the correct action when unsuccessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_LOGIN_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches the correct error when unsuccessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual('bar');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

  describe('#logout', function () {

    beforeEach(function () {
      spyOn(RequestUtil, 'json');
      ACLAuthActions.logout();
      this.configuration = RequestUtil.json.mostRecentCall.args[0];
    });

    it('calls #json from the RequestUtil', function () {
      expect(RequestUtil.json).toHaveBeenCalled();
    });

    it('fetches data from the correct URL', function () {
      expect(this.configuration.url)
        .toEqual(Config.acsAPIPrefix + '/auth/logout');
    });

    it('dispatches the correct action when successful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_LOGOUT_SUCCESS);
      });

      this.configuration.success();
    });

    it('dispatches the correct action when unsuccessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.type).toEqual(ActionTypes.REQUEST_ACL_LOGOUT_ERROR);
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

    it('dispatches the correct error when unsuccessful', function () {
      var id = AppDispatcher.register(function (payload) {
        var action = payload.action;
        AppDispatcher.unregister(id);
        expect(action.data).toEqual('bar');
      });

      this.configuration.error({responseJSON: {description: 'bar'}});
    });

  });

});