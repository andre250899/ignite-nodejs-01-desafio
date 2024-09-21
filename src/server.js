import { createServer } from 'node:http'

const tasks = []

const server = createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/tasks') {
    return res.end(JSON.stringify({ data: tasks }))
  }

  if (method === 'POST' && url === '/tasks') {
    tasks.push({
      id: tasks.length + 1,
      title: `tarefa ${tasks.length + 1}`,
      description: `descricao da tarefa ${tasks.length + 1}`,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: null,
    })

    res.writeHead(201, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ message: 'Usuário cadastrado!' }))
  }

  return res.end(JSON.stringify({ message: 'Hello, World!' }))
})

server.listen(3333, () => {
  console.log('Server running on port 3333')
})
