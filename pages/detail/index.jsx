import withRepoBasic from '../../components/with-repo-basic'
import api from '../../lib/api'
import dynamic from 'next/dynamic'
import RouterGuard from '../../components/RouterGuard'


const MDRenderer = dynamic(
    () => import('../../components/mdRenderer'),
    //在模块加载完成前显示的内容
    {
        loading: () => <p>Loading...</p>
    }
)
function Detail({ readme }) {

    return <MDRenderer content={readme.content} isBase64={true} />
}
Detail.getInitialProps = async ({ ctx: { query: { owner, name }, req, res} }) => {
    const readmeResp = await api.request({
        url: `/repos/${owner}/${name}/readme`
    }, req, res)

    return {
        readme: readmeResp.data
    }
}
export default RouterGuard(withRepoBasic(Detail, 'index'))