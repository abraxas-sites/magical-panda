import * as http from 'http'
import * as ws from 'ws'

const port = 8080

const requestListener = function (req, res) {
  console.log('HEADERS', req.headers)
  res.writeHead(200)
  res.end('Hello, World!')
}

const server = http.createServer(requestListener)

const wss = new ws.Server({ noServer: true })

let count = 0
wss.on('connection', function connection(ws) {
  ws.addEventListener('message', async (message) => {
    console.log('MESSAGE', message.type, message.data)
    if (message?.data === 'CLICK') {
      count += 1
      ws.send(
        JSON.stringify({
          count,
          tz: new Date(),
        })
      )
    }
  })
})

server.on('upgrade', function upgrade(request, socket, head) {
  if (request.headers['upgrade'] === 'websocket') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  } else {
    console.log('whatt kind of  upgrade could this be?', request.headers)
  }
})

server.listen(port, () => console.log(`Server running at http://localhost:${port}`))
