import Link from 'next/link';
import {Button, Layout, Icon, Input, Avatar, Tooltip, Dropdown, Menu} from 'antd';
import Router from 'next/router';
import { useState, useCallback } from 'react'
import Container from './Container'
import getConfig from 'next/config'
import { connect } from 'react-redux'
import { logout } from '../store/store'
import axios from 'axios'
import { withRouter } from 'next/router'

const { Header, Content, Footer } = Layout
const {publicRuntimeConfig} = getConfig()

const iconStyle = {
  color: 'white',
  fontSize: 40,
  display: 'block',
  paddingTop: 10,
  marginRight: 20
}
const footerStyle = {
  textAlign: 'center'
}

function MyLayout ({ children, user, logout, router }) {
  const urlQuery = router.query && router.query.query

  const [search, setSearch] = useState(urlQuery || '')
  const handleSearchChange = useCallback((event) => {
    setSearch(event.target.value)
  }, [setSearch])
  const handleOnSearch = useCallback(() => {
    Router.push(`/search?query=${search}`)
  }, [search])
  const handleLogout = useCallback(() => {
    logout()
  }, [logout])
  const handleGoToOAuth = useCallback((e) => {
    e.preventDefault()
    axios.get(`/prepare-auth?url=${router.asPath}`).then((resp) => {
      if(resp.status === 200) {
        location.href = publicRuntimeConfig.OAUTH_URL
      }else {
        console.log('prepare-auth fail', resp)
      }
    }).catch((err) => {
      console.log("err: ", err)
    })
  }, [])
  const userDropDown = (
    <Menu>
      <Menu.Item>
        <a href="javascript:void(0)" onClick={handleLogout} >
          登出！
        </a>
      </Menu.Item>
    </Menu>
  )

  
  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-inner" />}>
        
          <div className="header-left">
            <div className="logo">
              <Link href="/" >
                <Icon type="github" style={iconStyle} />
              </Link>
            </div>
            <div>
              <Input.Search placeholder="搜索仓库" value={search} onChange={handleSearchChange} onSearch={handleOnSearch} />
            </div>
          </div>
          <div className="header-right">
            <div className="user">
              {
                user && user.id ? (
                  <Dropdown overlay={userDropDown}>
                    <a href="/" >
                      <Avatar size={40} src={user.avatar_url} />
                    </a>
                  </Dropdown>
                ): (
                  <Tooltip title="请点击进行登陆">
                    <a href={`/prepare-auth?url=${router.asPath}`}>
                      <Avatar size={40} icon="user" />
                    </a>
                  </Tooltip>
                )
              }
            </div>
          </div>
        </Container>
      </Header>
      <Content>
        <Container renderer={<div style={{color: 'red'}} />}>
          {children}
        </Container>
      </Content>
      <Footer style={footerStyle}>
        Developed by Jason.zhang
        <a href="mailto:1055889543@qq.com">1055889543@qq.com</a>
      </Footer>
  <style jsx>{`
    .header-inner {
      display: flex;
      justify-content: space-between;
    }
    .header-left {
      display: flex;
      justify-content: flex-start;
    }
  `}</style>
  <style jsx global>{`
    #__next {
      height: 100%;
    }
    .ant-layout {
      min-height: 100%;
    }
    .ant-layout-header {
      padding-left: 0;
      padding-right: 0;
    }
    .ant-layout-content {
      background-color: #ffffff;
    }
  `}</style>
    </Layout>
  )
}

export default connect(function mapState(state) {
  return{
    user: state.user
  }
}, function mapReducer(dispatch) {
  return {
    logout: () => dispatch(logout())
  }
})(withRouter(MyLayout))