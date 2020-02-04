import Repo from './Repo'
import Link from 'next/link'
import api from '../lib/api'
import { withRouter } from 'next/router'
import { get, cache } from '../lib/repo-basic-cache'
import { useEffect } from 'react'

//在跳转到readme和issues页面时仍然在url中保存query信息
function makeQuery(queryObj) {
    const query = Object.entries(queryObj)
        .reduce((result, entry) => {
            result.push(entry.join('='))
            return result
        }, []).join('&')

    return `?${query}`
}

const isServer = typeof window === 'undefined'

export default function(Comp, type='index') {
    function WithDetail({ repoBasic, router, ...rest }) {
        const query = makeQuery(router.query)
        useEffect(() => {
            if(!isServer) {
                //获取数据后直接缓存
                cache(repoBasic)
            }
        })
        
        return (
            <div className="root">
                <div className="repo-basic">
                    <Repo repo={repoBasic} />
                    <div className="tabs">
                        {
                            type === 'index'?
                            <span className="tab">Readme</span>:
                            <Link href={`/detail${query}`}>
                                <a className="tab index">ReadMe</a>
                            </Link>
                        }
                        {
                            type === 'issues'?
                            <span className="tab">issues</span>:
                            <Link href={`/detail/issues${query}`} >
                                <a className="tab issues">Issues</a>
                            </Link>
                        }
                        
                    </div>
                </div>
                <div>
                    <Comp {...rest} />
                </div>
                <style jsx>{`
                    .root {
                        padding-top: 20px;
                    }
                    .repo-basic {
                        padding: 20px;
                        border: 1px solid #eee;
                        margin-bottom: 20px;
                        border-radius: 5px;
                    }
                    .tab + .tab {
                        margin-left: 20px;
                    }
                `}</style>
            </div>
        )
    }
    
    WithDetail.getInitialProps =  async( context ) => {
        const { router, ctx } = context
        //router.query会获取到跳转之前的search页面的query
        const { owner, name } = ctx.query
        const full_name = `${owner}/${name}`

        let pageData = {}
        if(Comp.getInitialProps) {
            pageData = await Comp.getInitialProps(context)
        }
        //如果数据已经缓存，直接从缓存中读取
        if (get(full_name)) {
            return {
                repoBasic: get(full_name),
                ...pageData
            }
        }
        const repoBasic = await api.request({
            url: `/repos/${owner}/${name}`
        }, ctx.req, ctx.res)

        
        return {
            repoBasic: repoBasic.data,
            ...pageData
        }
    }

    return withRouter(WithDetail)
}