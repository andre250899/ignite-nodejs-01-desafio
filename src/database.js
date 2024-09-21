import fs from 'node:fs'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.promises
      .readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    if (Object.keys(this.#database).length === 0) {
      this.#database = { tasks: [] }
    }

    fs.writeFile(databasePath, JSON.stringify(this.#database), error => {
      if (error) {
        console.error(`Error persisting database: ${error}`)
      } else {
        console.log('Database saved successfully')
      }
    })
  }

  select(table) {
    const data = this.#database[table] ?? []
    return data
  }

  findOne(table, id) {
    const data = this.#database[table]?.find(row => row.id === id)

    if (!data) {
      throw new Error('Task not found')
    }

    return data
  }

  insert(table, data) {
    if (!this.#database[table]) {
      this.#database[table] = []
    } else {
      this.#database[table].push(data)
    }

    this.#persist()

    return data
  }

  update(table, id, newData) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      const { ...prevData } = this.#database[table][rowIndex]

      this.#database[table][rowIndex] = {
        ...prevData,
        id,
        ...newData,
      }
      this.#persist()
    } else {
      throw new Error('Task not found')
    }
  }

  complete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      const { ...prevData } = this.#database[table][rowIndex]

      if (prevData.completed_at) {
        this.#database[table][rowIndex] = {
          ...prevData,
          completed_at: null,
        }
      } else {
        this.#database[table][rowIndex] = {
          ...prevData,
          completed_at: new Date(),
        }
      }

      this.#persist()
    } else {
      throw new Error('Task not found')
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    } else {
      throw new Error('Task not found')
    }
  }
}
