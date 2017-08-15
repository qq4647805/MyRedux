# MyRedux


```javascript
//初始化
import MyRedux, { connect, Provider } from 'MyRedux'
import React from 'react';
const reducers = {
    foo(state = { data: 'foo' }, { type, ...newState }) {
        if (type == 'foo') {
            return {...state, ...newState };
        } else if (type == 'foo.get') {
            return async(dispatch, getState) => {
                dispatch({ data: 'newfoo' }, 'foo')
            }
        }
        return state;
    },
    bar(state = { test: 'bar' }, { type, ...newState }) {
        if (type == 'bar') {
            return {...state, ...newState };
        }
        return state;
    }
}
const store = new MyRedux(reducers)

//绑定react 
const Home = (props) => {
            return (
                <p>{props.data.data}</p>
            )
        }
const Main = connect(({ home }) => ({ data:home }))(App)

const App = ()=>(
    <Provider store={store}>
        <Main />
    </Provider>
)
```
