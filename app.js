var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var index = require('./routes/index')
// var users = require('./routes/users')

var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', index)

app.get('/room/:roomId', function (req, res) {
  res.render('player', { roomId: req.params['roomId'] })
})

app.get('/room/:roomId/master', function (req, res) {
  res.render('master', { roomId: req.params['roomId'] })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})

io.on('connection', function (socket) {
  // console.log('[*] New connection')
  socket.on('client.join', function (data) {
    var req = JSON.parse(data)
    socket.join(req.roomId)
    // console.log('subscribed to: ' + req.roomId)
    socket.on('client.pressed', function (data) {
      //console.log(data)
      io.to(req.roomId).emit('server.pressed', JSON.parse(data))
    })
    socket.on('client.judge', function (data) {
      // console.log(data)
      io.to(req.roomId).emit('server.judge', JSON.parse(data))
    })
  })
})

module.exports = {app: app, server: server}
