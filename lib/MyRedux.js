'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Provider = exports.connect = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp, _initialiseProps;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MyRedux = (_temp = _class = function () {
    function MyRedux(reducer) {
        var initState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, MyRedux);

        _initialiseProps.call(this);

        this._(reducer, initState);
        this.dispatch();
        this._.state = _extends({}, this._.state, initState);
    }

    _createClass(MyRedux, [{
        key: '_',
        value: function _(reducer) {
            this._.state = {};
            this._.reducer = reducer;
            this._.listener_arr = [];
            this._.type_cache = {};
        }
    }, {
        key: '_reducerFromCache',
        value: function _reducerFromCache(action) {
            var _this = this;

            var type = action.type;
            if (type && this._.type_cache[type]) {
                var type_cache = this._.type_cache[type];
                var arr = [];
                type_cache.forEach(function (args) {
                    var reducer = args.reducer,
                        v = args.v;

                    arr.push(_this._setState(reducer, action, v, true));
                });
                this._.promise = Promise.all(arr);
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: '_setState',
        value: function _setState(reducer, action, v, no_cache) {
            var state = this._.state[v];
            var newstate = reducer(state, action);
            if (!no_cache && v && action.type && state !== newstate) {
                this._.type_cache[action.type] || (this._.type_cache[action.type] = new Set());
                var type_cache = this._.type_cache[action.type];
                type_cache.add({ reducer: reducer, v: v });
            }
            if (typeof newstate == 'function') {
                return newstate(this.dispatch, this.getState);
            } else {
                this._.state[v] = newstate;
                return true;
            }
        }
    }]);

    return MyRedux;
}(), _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.dispatch = function () {
        var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var render = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        if (typeof action == 'function') {
            _this2._.promise = Promise.all([action(_this2.dispatch, _this2.getState)]);
            return _this2;
        }
        if (type) {
            action.type = type;
        }
        var reducers = _this2._.reducer;
        if (!_this2._reducerFromCache(action)) {
            _this2._.promise = Promise.all(Object.keys(reducers).map(function (v) {
                var reducer = reducers[v];
                return _this2._setState(reducer, action, v);
            }));
        }
        if (render && _this2._.listener_arr.length > 0) {
            _this2._.listener_arr.reverse().forEach(function (v) {
                v();
            });
        }
        return _this2;
    };

    this.then = function () {
        var _$promise;

        (_$promise = _this2._.promise).then.apply(_$promise, arguments);
    };

    this.subscribe = function (listener) {
        if (typeof listener !== 'function') {
            return false;
        }
        _this2._.listener_arr.push(listener);
        return function () {
            if (_this2._.listener_arr.length <= 0) {
                return;
            }
            var index = _this2._.listener_arr.indexOf(listener);
            _this2._.listener_arr.splice(index, 1);
        };
    };

    this.getState = function () {
        return _this2._.state;
    };
}, _temp);


var connect = function connect() {
    var mapReducer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (s) {};
    return function (component) {
        var that;

        var Wrap = function (_Component) {
            _inherits(Wrap, _Component);

            function Wrap(props, context) {
                _classCallCheck(this, Wrap);

                var _this3 = _possibleConstructorReturn(this, (Wrap.__proto__ || Object.getPrototypeOf(Wrap)).call(this));

                that = context.store;
                var state = _extends({}, mapReducer(that.getState()));
                _this3.state = state;
                return _this3;
            }

            _createClass(Wrap, [{
                key: 'componentWillMount',
                value: function componentWillMount() {
                    var _this4 = this;

                    this.unsubscribe = that.subscribe(function () {
                        _this4.setState(_extends({}, mapReducer(that.getState())));
                    });
                }
            }, {
                key: 'componentWillUnmount',
                value: function componentWillUnmount() {
                    this.unsubscribe();
                }
            }, {
                key: 'shallowEqual',
                value: function shallowEqual(objA, objB) {
                    if (objA === objB) {
                        return true;
                    }
                    var keysA = Object.keys(objA);
                    var keysB = Object.keys(objB);

                    if (keysA.length !== keysB.length) {
                        return false;
                    }
                    var hasOwn = Object.prototype.hasOwnProperty;
                    for (var i = 0; i < keysA.length; i++) {
                        if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
                            return false;
                        }
                    }
                    return true;
                }
            }, {
                key: 'shouldComponentUpdate',
                value: function shouldComponentUpdate(props, state) {
                    return !this.shallowEqual(state, this.state) || !this.shallowEqual(props, this.props);
                }
            }, {
                key: 'render',
                value: function render() {
                    return (0, _react.createElement)(component, _extends({}, this.state, this.props, { objEq: this.shallowEqual }));
                }
            }]);

            return Wrap;
        }(_react.Component);

        Wrap.contextTypes = {
            store: _propTypes2.default.object.isRequired
        };
        return Wrap;
    };
};

var Provider = function (_Component2) {
    _inherits(Provider, _Component2);

    function Provider() {
        _classCallCheck(this, Provider);

        return _possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).apply(this, arguments));
    }

    _createClass(Provider, [{
        key: 'getChildContext',
        value: function getChildContext() {
            return { store: this.props.store };
        }
    }, {
        key: 'render',
        value: function render() {
            return _react.Children.only(this.props.children);
        }
    }]);

    return Provider;
}(_react.Component);

Provider.childContextTypes = {
    store: _propTypes2.default.object
    // MyRedux.connect = connect
    // MyRedux.Provider = Provider
};exports.default = MyRedux;
exports.connect = connect;
exports.Provider = Provider;
// module.exports = MyRedux;