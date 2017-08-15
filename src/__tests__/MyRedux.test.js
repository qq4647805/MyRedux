import MyRedux, { connect, Provider } from '../MyRedux'
import { shallow, render, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import React from 'react';
describe('测试 MyRedux', () => {
    const reducers = {
        home(state = { data: 112341 }, { type, ...newState }) {
            if (type == 'home') {
                return {...state, ...newState };
            } else if (type == 'home.get') {
                return async(dispatch, getState) => {
                    dispatch({ data: '444' }, 'home')
                }
            }
            return state;
        }
    }
    const store = new MyRedux(reducers)
    it('getState', () => {
        expect(store.getState().home).toEqual({ data: 112341 });
    })
    it('dispatch', () => {
        store.dispatch({ data: 111 }, 'home')
        expect(store.getState().home).toEqual({ data: 111 });
        store.dispatch({ data: 222, type: 'home' })
        expect(store.getState().home).toEqual({ data: 222 });

    })

    it('dispatch fn', () => {
        store.dispatch(dp => {
            dp({ data: 333 }, 'home')
        })
        expect(store.getState().home).toEqual({ data: 333 });
    });


    it('should reducer return fn', () => {
        store.dispatch({}, 'home.get')
        expect(store.getState().home).toEqual({ data: '444' });
    });


    it('subscribe', () => {
        const mockCallback = jest.fn();
        store.subscribe(mockCallback)
        store.dispatch({ data: 1 }, 'home')
        store.dispatch({ data: 2 }, 'home')
        store.dispatch({ data: 3 }, 'home')
        expect(mockCallback.mock.calls.length).toBe(3);
    })

    it('unsubscribe', () => {
        const mockCallback = jest.fn();
        let unsubscribe = store.subscribe(mockCallback)
        store.dispatch({ data: 1 }, 'home')
        expect(mockCallback.mock.calls.length).toBe(1);
        unsubscribe()
        store.dispatch({ data: 2 }, 'home')
        store.dispatch({ data: 3 }, 'home')
        expect(mockCallback.mock.calls.length).toBe(1);
    });


    it('should connect', () => {
        const App = (props) => {
            return (
                <p>{props.data.data}</p>
            )
        }
        const Main = connect(({ home }) => ({ data: home }))(App)
        const dom = mount(
            <Provider store={store}>
                <Main />
            </Provider>
        )
        store.dispatch({ data: 'connect' }, 'home')
        expect(dom.find('p').text()).toEqual("connect");
        store.dispatch({ data: 'change data' }, 'home')
        expect(dom.find('p').text()).toEqual("change data");
    });


});