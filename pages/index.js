import {Button } from 'antd';
import Link from 'next/link';//页面跳转
import Router from 'next/router';
import store from '../store/store'
import {connect} from 'react-redux'

const Index =  ({count,user,rename,add}) => {
  function click() {
    Router.push({
      pathname: '/a',
      query: {
        id: 4
      }
    }, "/a/4");
  }
  return(
    <div>
      <span>Count: {count}</span>
      <span>name:{user}</span>
      <input value={user} onChange={(e) => {rename(e.target.value)}} />
      <button onClick={() => add(count)} >Add</button>
    </div>
  )
}

export default connect(function mapState2Props(state) {
  return {
    count:state.count.count,
    user:state.user.name
  }
}, function mapDispatch2Props(dispatch) {
  return {
    add: (num) => dispatch({type: 'ADD', num:num}),
    rename: (name) => dispatch({type: 'UPDATE_USERNAME', name:name})
  }
})(Index)
