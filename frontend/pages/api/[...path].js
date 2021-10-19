import httpProxy from 'http-proxy'
import Cookies from 'cookies'
import url from 'url'

const API_URL = process.env.API_URL
const proxy = httpProxy.createProxyServer()

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = (req, res) => {
  return new Promise((resolve, reject) => {
    const pathname = url.parse(req.url).pathname
    const isLogin = pathname === '/api/auth/signin'

    const cookies = new Cookies(req, res)
    const accessToken = cookies.get('access-token')

    req.url = req.url.replace(/^\/api/, '')

    req.headers.cookie = ''

    if (accessToken) {
      req.headers['Authorization'] = `Bearer ${accessToken}`
    }

    if (isLogin) {
      proxy.once('proxyRes', interceptLoginResponse)
    }
    proxy.once('error', reject)

    proxy.web(req, res, {
      target: API_URL,
      autoRewrite: false,
      selfHandleResponse: isLogin,
    })

    function interceptLoginResponse(proxyRes, req, res) {
      let apiResponseBody = ''

      proxyRes.on('data', (chunk) => {
        apiResponseBody += chunk
      })

      proxyRes.on('end', () => {
        try {
          const response = JSON.parse(apiResponseBody)
          const { accessToken, error, statusCode } = response

          if (error !== undefined) {
            res.status(statusCode).json(response)

            resolve()
          } else {
            const cookies = new Cookies(req, res)

            cookies.set('access-token', accessToken, {
              httpOnly: true,
              sameSite: 'lax',
            })

            res.status(statusCode || 200).json({ loggedIn: true })

            resolve()
          }
        } catch (err) {
          reject(err)
        }
      })
    }
  })
}

export default handler
