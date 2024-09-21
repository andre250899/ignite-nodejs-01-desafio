import { createServer } from 'node:http'

const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify({ message: 'Hello, World!' }))
})

server.listen(3333, () => {
  console.log('Server running on port 3333')
})
