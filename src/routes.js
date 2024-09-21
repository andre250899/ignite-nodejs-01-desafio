import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      try {
        const url = new URL(req.url, `http://${req.headers.host}`)
        const title = url.searchParams.get('title')
        const description = url.searchParams.get('description')

        const tasks = database.select('tasks')

        const filteredTasks = tasks.filter(task => {
          let matchesTitle = true
          let matchesDescription = true

          if (title) {
            matchesTitle = task.title
              .toLowerCase()
              .includes(title.toLowerCase())
          }

          if (description) {
            matchesDescription = task.description
              .toLowerCase()
              .includes(description.toLowerCase())
          }

          return matchesTitle && matchesDescription
        })

        return res.end(JSON.stringify({ tasks: filteredTasks }))
      } catch (error) {
        console.log(error)
        res.statusCode = 500
        return res.end(JSON.stringify({ error: error.message }))
      }
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      try {
        if (!req.body) {
          throw new Error('Body is required')
        }

        const { title, description } = req.body

        if (!title) {
          throw new Error('Title is required')
        }

        if (!description) {
          throw new Error('Description is required')
        }

        const task = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        }

        database.insert('tasks', task)

        return res.end(JSON.stringify({ message: 'Task created' }))
      } catch (error) {
        console.log(error)
        res.statusCode = 500
        return res.end(JSON.stringify({ error: error.message }))
      }
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      try {
        database.delete('tasks', id)
        return res
          .writeHead(204)
          .end(JSON.stringify({ message: 'Task deleted successful' }))
      } catch (error) {
        console.log(error)
        res.statusCode = 500
        return res.end(JSON.stringify({ error: error.message }))
      }
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      try {
        const { id } = req.params

        const body = req.body
        if (!body || Object.keys(body).length === 0) {
          throw new Error('The request body must not be empty')
        }

        const { title, description } = body
        if (!title && !description) {
          throw new Error('At least title or description must be provided')
        }

        const updates = {}
        if (title) updates.title = title
        if (description) updates.description = description
        updates.updated_at = new Date()

        database.update('tasks', id, updates)

        return res.writeHead(204).end()
      } catch (error) {
        console.error(error)
        res.statusCode = 500
        return res.end(JSON.stringify({ error: error.message }))
      }
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      try {
        const { id } = req.params
        database.complete('tasks', id)
        return res.end(JSON.stringify({ message: 'Task updated' }))
      } catch (error) {
        console.error(error)
        res.statusCode = 500
        return res.end(JSON.stringify({ error: error.message }))
      }
    },
  },
]
