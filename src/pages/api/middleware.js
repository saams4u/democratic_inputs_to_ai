
import Cors from 'cors'

const cors = Cors({
  methods: ['GET', 'POST', 'HEAD', 'OPTIONS', 'PUT'],
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

export default runMiddleware;
export { cors }