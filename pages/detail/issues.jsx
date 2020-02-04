import withRepoBasic from '../../components/with-repo-basic'

function Issues({ w }) {
    return <span>Issues { w }</span>
}
Issues.getInitialProps = async () => {
    return {
        w: 123
    }
}
export default withRepoBasic(Issues, 'issues')