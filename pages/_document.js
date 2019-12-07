import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

//函数组件
function withLog(Comp) {
    return (props) => {
        console.log(props)
        return <Comp {...props} />
    }
}

class Mydocument extends Document {
    static async getInitialProps(ctx) {
        const originalRenderPage = ctx.renderPage;
        const sheet = new ServerStyleSheet();

        try{
            //强化页面render
            ctx.renderPage = () => originalRenderPage({
                // sheet.collectStyles 将页面加载的样式挂载到sheet上面，
                // 之后就可以通过sheet.getStyleElement拿到并返回
                enhanceApp: App => (props) => sheet.collectStyles(<App {...props} />)
            })
            const props = await Document.getInitialProps(ctx);
            return {
                ...props,
                styles: <>{props.styles}{sheet.getStyleElement()}</>
            }
        }finally {
            sheet.seal()
        }
        
        
    }
    render() {
        return (
            <Html>
                <Head>
                </Head>
                <body className="test">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
        
    }
}

export default Mydocument