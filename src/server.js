import { createServer } from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'

const server = createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    req.params = { ...routeParams.groups }

    return route.handler(req, res)
  }

  return res.end(JSON.stringify({ message: 'Route not found' }))
})

server.listen(3333, () => {
  console.log('Server running on port 3333')
})
