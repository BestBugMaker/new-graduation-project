const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'
const client_id = 'eb96a35804e6aa13cfb3'

module.exports = {
    github: {
        client_id,
        client_secret: 'c4c46e15277f5abb72a2bf98a5a902f3dccc7327',
        request_token_url: "https://github.com/login/oauth/access_token"
    },
    GITHUB_OAUTH_URL,
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`

}
