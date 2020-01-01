import App , { Container} from 'next/app';
import 'antd/dist/antd.css';
import Layout from '../components/Layout';
import MyContext from '../lib/my-context';
import { Provider } from 'react-redux';
// import store from '../store/store';
import testHoc from '../lib/with-redux';

class MyApp extends App {
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
                <Layout>
                    <Provider store={reduxStore}>
                        <MyContext.Provider value="test">
                            <Component {...pageProps}/>
                        </MyContext.Provider>
                    </Provider>
                </Layout>
                
            </Container>
        );
    }
}
export default testHoc(MyApp)
