var se_button = new Audio('/audio/se_button.mp3')
var se_correct = new Audio('/audio/se_correct.mp3')

var busy = false

$(function(){
	$('#push-button').click(function(e) {
		e.preventDefault()
		se_correct.addEventListener("ended", function() {
		  busy = false
		})
		se_button.addEventListener("ended", function() {
		  se_correct.play()
		})
		if (!busy) se_button.play()
		busy = true
	})

	$('#form-room button').click(function (e) {
	  e.preventDefault()
    try {
      if (!document.getElementById('username').reportValidity()) return
    } catch (_) {}
    if (!document.getElementById('room').checkValidity()) {
      document.getElementById('room').focus()
      return
    }
	  location.href = location.protocol+"//"+location.host+"/room/"+document.getElementById("room").value
	})
})
