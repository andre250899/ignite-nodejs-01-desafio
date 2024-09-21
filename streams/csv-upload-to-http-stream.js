import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvFilePath = new URL('../tasks.csv', import.meta.url)

const importTasks = async () => {
  const parser = fs
    .createReadStream(csvFilePath)
    .pipe(parse({ columns: true, skip_empty_lines: true }))

  for await (const record of parser) {
    try {
      const response = await fetch('http://localhost:3333/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: record.title,
          description: record.description,
        }),
      })

      if (!response.ok) {
        throw new Error(`Erro ao importar tarefa: ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`Tarefa importada: ${data.message}`)
    } catch (error) {
      console.error(`Erro ao processar a tarefa: ${error.message}`)
    }
  }
}

importTasks().catch(error =>
  console.error(`Erro na importação: ${error.message}`)
)
