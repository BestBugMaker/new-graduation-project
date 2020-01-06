import App , { Container} from 'next/app';
import 'antd/dist/antd.css';
import Layout from '../components/Layout';
import { Provider } from 'react-redux';
// import store from '../store/store';
import testHoc from '../lib/with-redux';
import PageLoading from '../components/pageLoading'
import Router from 'next/router'
import Link from 'next/link'
import axios from 'axios'

class MyApp extends App {
    state = {
        loading: false
    }

    startLoading() {
        this.setState({
            loading: true
        });
    }

    stopLoading() {
        this.setState({
            loading: false
        });
    }

    componentDidMount() {
        Router.events.on('routeChangeStart', this.startLoading.bind(this))
        Router.events.on('routeChangeComplete', this.stopLoading.bind(this))
        Router.events.on('routeChangeError', this.stopLoading.bind(this))

        
    }

    componentWillUnmount() {
        Router.events.off('routeChangeStart', this.startLoading.bind(this))
        Router.events.off('routeChangeComplete', this.stopLoading.bind(this))
        Router.events.off('routeChangeError', this.stopLoading.bind(this))
    }

    //重写了getInitialProps方法，来执行组件的方法
    static async getInitialProps(ctx) {
        const { Component } = ctx;
        let pageProps;
        if(Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        return {
            pageProps
        }
    }
    render() {
        const { Component, pageProps, reduxStore } = this.props; 
        return(
            <Container>
                <Provider store={reduxStore}>
                    {/* 全局加载页面 */}
                    {
                        this.state.loading?
                        <PageLoading />:
                        null
                    }
                    <Layout>
                        <Link href="/">
                            <a>index</a>
                        </Link>
                        <Link href="/detail">
                            <a>detail</a>
                        </Link>
                        <Component {...pageProps}/>
                    </Layout>
                </Provider>
                
            </Container>
        );
    }
}
export default testHoc(MyApp)
