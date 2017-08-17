import React, { Component, createElement, Children } from 'react';
import PropTypes from "prop-types";
class MyRedux {
    constructor(reducer, initState = {}) {
        this._(reducer, initState);
        this.dispatch();
        this._.state = {...this._.state, ...initState }
    }

    _(reducer) {
        this._.state = {};
        this._.reducer = reducer;
        this._.listener_arr = [];
        this._.type_cache = {}
    }
    _reducerFromCache(action) {
        let type = action.type
        if (type && this._.type_cache[type]) {
            let type_cache = this._.type_cache[type]
            type_cache.forEach(args => {
                let { reducer, v } = args
                this._setState(reducer, action, v, true)
            })
            return true
        } else {
            return false
        }
    }
    _setState(reducer, action, v, no_cache) {
        let state = this._.state[v]
        let newstate = reducer(state, action)
        if (!no_cache && v && action.type && state !== newstate) {
            this._.type_cache[action.type] || (this._.type_cache[action.type] = new Set())
            let type_cache = this._.type_cache[action.type]
            type_cache.add({ reducer, v })
        }
        if (typeof newstate == 'function') {
            newstate(this.dispatch, this.getState)
            return
        } else {
            this._.state[v] = newstate
        }

    }

    dispatch = (action = {}, type = false, render = true) => {
        if (typeof action == 'function') {
            action(this.dispatch, this.getState)
            return this
        }
        if (type) {
            action.type = type;
        }
        const reducers = this._.reducer;
        if (!this._reducerFromCache(action)) {
            Object.keys(reducers).forEach(v => {
                let reducer = reducers[v]
                this._setState(reducer, action, v)
            })
        }
        if (render && this._.listener_arr.length > 0) {
            this._.listener_arr.reverse().forEach(v => { v() })
        }
        return this;
    }

    subscribe = (listener) => {
        if (typeof listener !== 'function') {
            return false;
        }
        this._.listener_arr.push(listener);
        return () => {
            if (this._.listener_arr.length <= 0) {
                return
            }
            const index = this._.listener_arr.indexOf(listener);
            this._.listener_arr.splice(index, 1);
        }
    }

    getState = () => {
        return this._.state;
    }
}


const connect = (mapReducer = s => {}) =>
    (component) => {
        var that;
        class Wrap extends Component {

            constructor(props, context) {
                super();
                that = context.store
                const state = {...mapReducer(that.getState()) }
                this.state = state;
            }

            componentWillMount() {
                this.unsubscribe = that.subscribe(() => {
                    this.setState({...mapReducer(that.getState()) });
                });
            }

            componentWillUnmount() {
                this.unsubscribe()
            }

            shallowEqual(objA, objB) {
                if (objA === objB) {
                    return true
                }
                const keysA = Object.keys(objA)
                const keysB = Object.keys(objB)

                if (keysA.length !== keysB.length) {
                    return false
                }
                const hasOwn = Object.prototype.hasOwnProperty
                for (let i = 0; i < keysA.length; i++) {
                    if (!hasOwn.call(objB, keysA[i]) ||
                        objA[keysA[i]] !== objB[keysA[i]]) {
                        return false
                    }
                }
                return true
            }

            shouldComponentUpdate(props, state) {
                return (!this.shallowEqual(state, this.state) || !this.shallowEqual(props, this.props));
            }

            render() {
                return (
                    createElement(component, {...this.state, ...this.props, objEq: this.shallowEqual })
                )
            }
        }
        Wrap.contextTypes = {
            store: PropTypes.object.isRequired
        }
        return Wrap
    }


class Provider extends Component {
    getChildContext() {
        return { store: this.props.store }
    }
    render() {
        return Children.only(this.props.children)
    }
}


Provider.childContextTypes = {
    store: PropTypes.object,
}
export default MyRedux
export { connect, Provider }