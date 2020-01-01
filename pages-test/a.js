import { withRouter } from 'next/router'//拿到query中的对象
import styled from 'styled-components'
import dynamic from 'next/dynamic';
import getConfig from 'next/config';

//异步加载组件
const Comp = dynamic(import('../components/comp'))

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig()

const Title = styled.h1`
    color: yellow;
    font-size: 34px;
    `

const A =  ({ router, name, time }) => {
    console.log(serverRuntimeConfig, publicRuntimeConfig)
    return (
        <>
            <Title>This is Title {time}</Title>
            <Comp />
            <h2>{router.query.id} {name}{ process.env.customKey}</h2>
            <style jsx>{`
                h2 {
                    color: green;
                }
            `}</style>
            {/* 全局样式，但仅在本页面被渲染时才生效，组件卸载后不再生效 */}
            <style jsx global>{`

            `}</style>
        </>
    )
}

/**
 * 只有pages下的组件才能有这个方法。
 * 所以return的值都是这个组件的props
 */
A.getInitialProps = async (ctx) => {
    //webpack提供的异步加载模块的方法import。 执行到这一行才会去import moment from 'moment'
    const moment = await import('moment')

    const promise = new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: "Jason",
                time: moment.default(Date.now() - 60*1000).fromNow()
            })
        }, 1000);
    })
    return await promise;
}

export default withRouter(A);
