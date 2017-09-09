$(function(){

$('#push-button').click(function(e) {
  e.preventDefault()
  if (busy) return false
  try {
    if (!document.getElementById('username').reportValidity()) return
  } catch (_) {}
  if (!document.getElementById('username').checkValidity()) {
    document.getElementById('username').focus()
    return
  }
  se_button.play()
  var holder = $('#username').val()
  holder = holder ? holder : "No name"
  var color = $('#push-button').css('background-color')
  //console.log(roomId)
  socket.emit('client.pressed', JSON.stringify({ 'holder' : holder, 'color' : color }))
})

$('#cp2').colorpicker().on('changeColor', function(e) {
  document.getElementById('push-button').style.backgroundColor = e.color.toString('rgba')
})

$('#pills-config-tab').on('click', function(e) {
  e.preventDefault()
  $(this).parent().css({'display': 'none'})
  $('#pills-home-tab').parent().css({'display': 'inline'})
  this.classList.remove("active")
})

$('#pills-home-tab').on('click', function(e) {
  e.preventDefault()
  $(this).parent().css({'display': 'none'})
  this.classList.remove("active")
  $('#pills-config-tab').parent().css({'display': 'inline'})
})

})