'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _MyRedux = require('../MyRedux');

var _MyRedux2 = _interopRequireDefault(_MyRedux);

var _enzyme = require('enzyme');

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

describe('测试 MyRedux', function () {
    var reducers = {
        home: function home() {
            var _this = this;

            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { data: 112341 };
            var _ref = arguments[1];

            var type = _ref.type,
                newState = _objectWithoutProperties(_ref, ['type']);

            if (type == 'home') {
                return _extends({}, state, newState);
            } else if (type == 'home.get') {
                return function () {
                    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(dispatch, getState) {
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                                switch (_context.prev = _context.next) {
                                    case 0:
                                        dispatch({ data: '444' }, 'home');

                                    case 1:
                                    case 'end':
                                        return _context.stop();
                                }
                            }
                        }, _callee, _this);
                    }));

                    return function (_x2, _x3) {
                        return _ref2.apply(this, arguments);
                    };
                }();
            }
            return state;
        }
    };
    var store = new _MyRedux2.default(reducers);
    it('getState', function () {
        expect(store.getState().home).toEqual({ data: 112341 });
    });
    it('dispatch', function () {
        store.dispatch({ data: 111 }, 'home');
        expect(store.getState().home).toEqual({ data: 111 });
        store.dispatch({ data: 222, type: 'home' });
        expect(store.getState().home).toEqual({ data: 222 });
    });

    it('dispatch fn', function () {
        store.dispatch(function (dp) {
            dp({ data: 333 }, 'home');
        });
        expect(store.getState().home).toEqual({ data: 333 });
    });

    it('should reducer return fn', function () {
        store.dispatch({}, 'home.get');
        expect(store.getState().home).toEqual({ data: '444' });
    });

    it('subscribe', function () {
        var mockCallback = jest.fn();
        store.subscribe(mockCallback);
        store.dispatch({ data: 1 }, 'home');
        store.dispatch({ data: 2 }, 'home');
        store.dispatch({ data: 3 }, 'home');
        expect(mockCallback.mock.calls.length).toBe(3);
    });

    it('unsubscribe', function () {
        var mockCallback = jest.fn();
        var unsubscribe = store.subscribe(mockCallback);
        store.dispatch({ data: 1 }, 'home');
        expect(mockCallback.mock.calls.length).toBe(1);
        unsubscribe();
        store.dispatch({ data: 2 }, 'home');
        store.dispatch({ data: 3 }, 'home');
        expect(mockCallback.mock.calls.length).toBe(1);
    });

    it('should connect', function () {
        var App = function App(props) {
            return _react2.default.createElement(
                'p',
                null,
                props.data.data
            );
        };
        var Main = (0, _MyRedux.connect)(function (_ref3) {
            var home = _ref3.home;
            return { data: home };
        })(App);
        var dom = (0, _enzyme.mount)(_react2.default.createElement(
            _MyRedux.Provider,
            { store: store },
            _react2.default.createElement(Main, null)
        ));
        store.dispatch({ data: 'connect' }, 'home');
        expect(dom.find('p').text()).toEqual("connect");
        store.dispatch({ data: 'change data' }, 'home');
        expect(dom.find('p').text()).toEqual("change data");
    });
});