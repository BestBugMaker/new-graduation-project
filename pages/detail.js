function Detail() {
    return <span>Details</span>
}

Detail.getInitialProps = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({})
        }, 1000)
    })
}
export default Detail