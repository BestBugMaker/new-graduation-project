import React, { useState, useEffect , useReducer, useLayoutEffect, useContext, useRef} from 'react';
import MyContext from '../../lib/my-context'

class MyCounter extends React.Component {
    state = {
        count: 0
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({
                count: this.state.count + 1
            })
        }, 1000)
    }
    componentWillUnmount() {
        if(this.interval) {
            clearInterval(this.interval)
        }
    }

    render() {
        return <span>{this.state.count}</span>
    }
}

function countReducer(state, action) {
    switch (action.type) {
        case 'add':
            return state + 1;
        case 'minus':
            return state - 1;
        default: 
        return state;
    }
}

function MyCountFunc() {
    //React hooks
    // const [count, setCount] = useState(0);

    const [count, dispatchCount] = useReducer(countReducer, 0)
    const [name, setName] = useState('jack')

    const context = useContext(MyContext)

    const inputRef = useRef()

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         // setCount(c => c+1)
    //         dispatchCount({type: 'minus'})
    //     }, 1000)
    //     return () => clearInterval(interval)    //相当于willUnmount
    // }, [])
    useEffect(() => {
        console.log('effect')
        console.log("ref", inputRef)
        return () => console.log('deteched')
    }, [name])

    //会在更新DOM之前执行，没有特殊需求不建议使用
    // useLayoutEffect(() => {
    //     console.log("layout")
    // })

    return <div>
        <input ref={inputRef} value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={() => dispatchCount({type: 'add'})} >{count}</button>
        <p>{context}</p>
    </div>//<span>{count}</span>
}

 
export default MyCountFunc