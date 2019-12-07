import {Button } from 'antd';
import Link from 'next/link';//页面跳转
import Router from 'next/router';

export default () => {
  function click() {
    Router.push({
      pathname: '/a',
      query: {
        id: 4
      }
    }, "/a/4");
  }
  return(
    <div> Hello! </div>
  )
}
