import {useEffect} from 'react'
import { Button, Icon, Tabs } from 'antd'
import getConfig from 'next/config'
import {connect} from 'react-redux'
import Repo from '../components/Repo'
import Router, { withRouter } from 'next/router'
import LRU from 'lru-cache'
import { cacheArray } from '../lib/repo-basic-cache'

//LRU缓存策略，每使用一次数据，就会更新数据的缓存时间
// const cache = new LRU({
//     //maxAge时间之内不使用数据，就会删除
//     maxAge: 1000 * 5
// })
const {publicRuntimeConfig} = getConfig()
const api = require('../lib/api')
//缓存仓库数据,使得请求过数据之后，无论是刷新还是切换tab都无需再次请求
let cachedUserRepos, cachedUserStarredRepos
const isServer = typeof window === 'undefined'

function Index ({ userRepos, userStarredRepos, user, router, isLogin }) {

    const tableKey = router.query.key || '1'
    const handleTabChange = (activeKey) => {
        Router.push(`/?key=${activeKey}`)
    }

    useEffect(() => {
        if(!isServer) {
            cachedUserRepos = userRepos;
            cachedUserStarredRepos = userStarredRepos;
            // if(userRepos) {
            //     cache.set('userRepos', userRepos)
            // }
            // if(userStarredRepos) {
            //     cache.set('userStarredRepos', userStarredRepos)
            // }
            //timeout缓存策略，无论如何一定时间后都会强制清除缓存
            const timeout = setTimeout(() => {
                cachedUserRepos = null;
                cachedUserStarredRepos = null;
            }, 1000 * 60 * 10);
        }
    },[userRepos, userStarredRepos])

    useEffect(() => {
        if(!isServer && userRepos && userStarredRepos) {
            cacheArray(userRepos)
            cacheArray(userStarredRepos)
        }
    })

    if(!user || !user.id) {
        return (
            <div className="root" >
                <p>请先登陆欧～</p>
                <Button type="primary" href={publicRuntimeConfig.OAUTH_URL} >点击登录</Button>
                <style jsx>{`
                    .root {
                        height: 400px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    `}</style>
            </div>
        )
    }

    return (
        <div className="root">
            <div className="user-info">
                <img src={user.avatar_url} alt="user avatar" className="avatar" />
                <span className="login">{user.login}</span>
                <span className="name">{user.name}</span>
                <span className="bio">{user.bio}</span>
                <p className="email">
                    <Icon type="mail" style={{marginRight: 10}}></Icon>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                </p>
            </div>
            <div className="user-repos">
                <Tabs activeKey={tableKey} onChange={handleTabChange} animated={false}>
                    <Tabs.TabPane tab="你的仓库" key="1">
                        { userRepos.map(repo => (<Repo key={repo.id} repo={repo} />)) }
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="你关注的仓库" key="2">
                        { userStarredRepos.map(repo => (<Repo key={repo.id} repo={repo} />)) }
                    </Tabs.TabPane>
                </Tabs>
            </div>
            <style jsx>{`
                .root {
                    display: flex;
                    align-items: flex-start;
                    padding: 20px 0;
                }
                .user-info {
                    width: 200px;
                    margin-right: 40px;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                }
                .login {
                    font-weight: 800;
                    font-size: 20px;
                    margin-top: 20px;
                }
                .name {
                    font-size: 16px;
                    color: #777777;
                }
                .bio {
                    margin-top: 200pxcolor: #333333;
                }
                .avatar {
                    width: 100%;
                    border-radius: 5px;
                }
                .user-repos {
                    flex-grow: 1;
                }
                `}</style>
        </div>
    )
}


Index.getInitialProps = async ({ ctx, reduxStore }) => {
    //若未登陆，则不调用接口
    const user = reduxStore.getState().user
    if(!user || !user.id){
        return {
            isLogin: false
        }
    }

    if(!isServer) {
        // if(cache.get('userRepos') && cache.get('userStarredRepos')) {
        //     return {
        //         isLogin: true,
        //         userRepos: cache.get('userRepos'),
        //         userStarredRepos: cache.get('userStarredRepos')
        //     }
        // }
        if(cachedUserRepos && cachedUserStarredRepos) {
            return {
                isLogin: true,
                userRepos: cachedUserRepos,
                userStarredRepos: cachedUserStarredRepos
            }
        }
    }
    const userRepos = await api.request({url: '/user/repos'},ctx.req, ctx.res)

    const userStarredRepos = await api.request({url: '/user/starred'}, ctx.req, ctx.res)

    return {
        isLogin: true,
        userRepos: userRepos.data,
        userStarredRepos: userStarredRepos.data
    }
}

export default withRouter(connect(function mapState(state) {
    return {
        user: state.user
    }
})(Index))