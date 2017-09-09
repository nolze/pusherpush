$(function(){

$('#reset-button').click(function (e) {
  e.preventDefault()
  socket.emit('client.judge', JSON.stringify({status: 0}))
})

$('#correct-button').click(function (e) {
  e.preventDefault()
  var player = $('#jqDialog_content').text()
  if (player === "") return
  if (busyMaster) return
  busyMaster = true
  socket.emit('client.judge', JSON.stringify({player: player, status: 1}))
})

$('#wrong-button').click(function (e) {
  e.preventDefault()
  var player = $('#jqDialog_content').text()
  if (player === "") return
  if (busyMaster) return
  busyMaster = true
  socket.emit('client.judge', JSON.stringify({player: player, status: 2}))
})

$('#clear-button').click(function (e) {
  e.preventDefault()
  socket.emit('client.judge', JSON.stringify({status: -1}))
})

})
