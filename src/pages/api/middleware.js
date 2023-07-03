
// /pages/api/middleware.js
import Cors from 'cors'

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'POST', 'HEAD', 'OPTIONS', 'PUT'],
  // Enable preflight requests
  preflightContinue: false,
  optionsSuccessStatus: 204,
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
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