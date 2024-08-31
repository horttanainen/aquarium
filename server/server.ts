import express from 'express'
import { Request, Response } from 'express'
import path from 'path'

const app = express()

app.use('/out', express.static(path.join(__dirname, '..', '..', 'out'), { maxAge: '1d' }))

app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'out', 'index.html'));
});

const port = 3000
app.listen(port, () => {
  console.log(`listening in http://localhost:${port}`)
})

