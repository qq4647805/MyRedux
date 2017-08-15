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

//connect react 
const Home = (props) => {
            return (
                <p>{props.data.data}</p>
            )
        }
const Main = connect(({ home }) => ({ data:home }))(Home)
const App = ()=>(
    <Provider store={store}>
        <Main />
    </Provider>
)

//获取reducers的值
store.getState()

//dispatch 4种方式
//1.第二个参数为action
store.dispatch({ data: 111 }, 'foo')
//2.state里面有action属性
store.dispatch({ data: 111,action:'foo' })
//3.传递一个函数
store.dispatch((dispatch,getState) => {
    dispatch({ data: 333 }, 'home')
})
//4.把方法定义到reducer里面
store.dispatch({}, 'foo.get')

//订阅与取消
let unsubscribe = store.subscribe(myFn) //订阅
unsubscribe()//取消

```
