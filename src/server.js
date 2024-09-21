import { createServer } from 'node:http'
import { json } from './middlewares/json.js'

const tasks = []

const server = createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  if (method === 'GET' && url === '/tasks') {
    return res.end(JSON.stringify({ data: tasks }))
  }

  if (method === 'POST' && url === '/tasks') {
    try {
      const { title, description } = req.body

      tasks.push({
        id: tasks.length + 1,
        title,
        description,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      return res.end(JSON.stringify({ message: 'Usuário cadastrado' }))
    } catch (error) {
      console.log(req.data)
      return res.end(JSON.stringify({ message: error.message }))
    }
  }

  return res.end(JSON.stringify({ message: 'Rota não encontrada' }))
})

server.listen(3333, () => {
  console.log('Server running on port 3333')
})
