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
    }

    dispatch = (action = {}, type = false, render = true) => {
        if (typeof action == 'function') {
            action(this.dispatch, this.getState)
            return this
        }
        if (type) {
            action.type = type;
        }
        const { reducer } = this._;
        for (var variable in reducer) {
            if (reducer.hasOwnProperty(variable)) {
                let state = reducer[variable](this._.state[variable], action)
                if (typeof state == 'function') {
                    state(this.dispatch, this.getState)
                    return
                } else {
                    this._.state[variable] = state
                }

            }
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

            componentDidMount() {
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