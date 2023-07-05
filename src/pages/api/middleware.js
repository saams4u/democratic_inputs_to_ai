
import Cors from 'cors'

const cors = Cors({
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PUT'],
  origin: 'https://democratic-inputs-to-ai-3bv6.vercel.app', // add your client-side domain here
  credentials: true, // allow credentials from the client
  preflightContinue: false,
  optionsSuccessStatus: 204,
})

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export { cors, runMiddleware }