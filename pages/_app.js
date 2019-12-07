import App , { Container} from 'next/app';
import 'antd/dist/antd.css';
import Layout from '../components/Layout';
import MyContext from '../lib/my-context'

class MyApp extends App {
    //重写了getInitialProps方法，来执行组件的方法
    static async getInitialProps({ Component, ctx }) {
        let pageProps;
        if(Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        return {
            pageProps
        }
    }
    render() {
        const { Component, pageProps } = this.props; //对应pages下的每个页面
        return(
            <Container>
                <Layout>
                    <MyContext.Provider value="test">
                        <Component {...pageProps}/>
                    </MyContext.Provider>
                </Layout>
                
            </Container>
        );
    }
}
export default MyApp
