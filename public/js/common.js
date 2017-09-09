/**
  Modified by nolze, April 2012
**/
/**
	Kailash Nadh,	http://kailashnadh.name
	September 2011
	Smooth popup dialog for jQuery
	http://kailashnadh.name/code/jqdialog

	License: GPL
**/

b = null;
(function(a){a.jqDialog={escape_callback:null,enter_callback:null,labels:{ok:"Ok",yes:"Yes",no:"No",cancel:"Cancel"},ids:{div_box:"jqDialog_box",div_content:"jqDialog_content",div_options:"jqDialog_options",bt_yes:"jqDialog_yes",bt_no:"jqDialog_no",bt_ok:"jqDialog_ok",bt_ancel:"jqDialog_ok",input:"jqDialog_input"},confirm:function(a,c,d){b.create(a);b.parts.bt_ok.hide();b.parts.bt_cancel.hide();b.parts.bt_yes.show();b.parts.bt_no.show();b.parts.bt_yes.focus();b.parts.bt_yes.unbind().click(function(){b.cleanKeypressCallbacks();b.close();if(c)c()});b.enter_callback=function(){if(c)c()};b.parts.bt_no.unbind().click(function(){b.cleanKeypressCallbacks();b.close();if(d)d()});b.escape_callback=function(){if(d)d()}},prompt:function(c,d,e,f){b.create(a("<div>").append(c).append(a("<div>").append(b.parts.input.val(d))));b.parts.bt_yes.hide();b.parts.bt_no.hide();b.parts.bt_ok.show();b.parts.bt_cancel.show();b.parts.input.focus();b.parts.bt_ok.unbind().click(function(){b.cleanKeypressCallbacks();b.close();if(e)e(b.parts.input.val())});b.enter_callback=function(){if(e)e(b.parts.input.val())};b.parts.bt_cancel.unbind().click(function(){b.cleanKeypressCallbacks();b.close();if(f)f()});b.escape_callback=function(){if(f)f()}},alert:function(a,c){b.create(a);b.parts.bt_cancel.hide();b.parts.bt_yes.hide();b.parts.bt_no.hide();b.parts.bt_ok.show();b.parts.bt_ok.focus();b.parts.bt_ok.unbind().click(function(){b.cleanKeypressCallbacks();b.close();if(c){c()}});b.escape_callback=function(){if(c){c()}}},content:function(a,c){b.create(a);b.parts.div_options.hide()},notify:function(a,c){b.content(a);if(c){b.close_timer=setTimeout(function(){b.close()},c*1e3)}},create:function(a){b.check();b.maintainPosition(b.parts.div_box);clearTimeout(b.close_timer);b.parts.div_content.text(a);b.parts.div_options.show();b.parts.div_box.fadeIn("fast")},close:function(){b.parts.div_box.fadeOut("fast");b.clearPosition()},clearPosition:function(){a(window).unbind("scroll.jqDialog")},makeCenter:function(b){b.css({top:a(window).height()/2-b.height()/2+a(document).scrollTop()+"px",left:a(window).width()/2-b.width()/2+a(document).scrollLeft()+"px"})},maintainPosition:function(c){b.makeCenter(c);a(window).bind("scroll.jqDialog",function(){b.makeCenter(c)})},init_done:false,check:function(){if(b.init_done)return;else{b.init_done=true}a("body").append(b.parts.div_box)},init:function(){b.parts={};b.parts.div_box=a("<div>").attr({id:b.ids.div_box});b.parts.div_content=a("<div>").attr({id:b.ids.div_content});b.parts.div_options=a("<div>").attr({id:b.ids.div_options});b.parts.bt_yes=a("<button>").attr({id:b.ids.bt_yes}).append(b.labels.yes);b.parts.bt_no=a("<button>").attr({id:b.ids.bt_no}).append(b.labels.no);b.parts.bt_ok=a("<button>").attr({id:b.ids.bt_ok}).append(b.labels.ok);b.parts.bt_cancel=a("<button>").attr({id:b.ids.bt_cancel}).append(b.labels.cancel);b.parts.input=a("<input>").attr({id:b.ids.input});b.parts.div_box.append(b.parts.div_content).append(b.parts.div_options.append(b.parts.bt_yes).append(b.parts.bt_no).append(b.parts.bt_ok).append(b.parts.bt_cancel));b.parts.div_box.hide();a(document).keyup(function(a){if(a.altKey)return;if(a.keyCode==13){b.enterPressed()}if(a.keyCode==27){b.escapePressed()}})},cleanKeypressCallbacks:function(){b.enter_callback=null;b.escape_callback=null},escapePressed:function(){b.close();if(b.escape_callback){b.enter_callback=null;b.escape_callback();b.escape_callback=null}},enterPressed:function(){b.close();if(b.enter_callback){b.escape_callback=null;b.enter_callback();b.enter_callback=null}}};b=a.jqDialog;a.jqDialog.init()})(jQuery)

/**
	PusherPush
**/

busy = false
busyMaster = false

var se_button = new Audio('/audio/se_button.mp3')
var se_correct = new Audio('/audio/se_correct.mp3')
var se_wrong = new Audio('/audio/se_wrong.mp3')

function hashCalc(v) {
  var hash = 'u'
  for(var i=0; i < v.length; ++i) {
    hash += v.charCodeAt(i)
  }
  return hash
}

function addPlayer(holder) {
  var hash = hashCalc(holder)
  //console.log($('#point').find('#'+hash).length)
  if($('#point').find('#'+hash).length === 0){
    $('#point tbody').append('<tr id=' + hash + ' class="player"><th scope="row"></th><td class="o"></td><td class="x"></td></tr>');
    $('#'+hash+' th').text(holder)
    $('#'+hash+' td.o').text('0')
    $('#'+hash+' td.x').text('0')
  }
}

var socket = io()

var roomId = location.pathname.replace(/\/$/, "").replace(/\/master$/, "").replace(/\/$/, "").split('/').slice(-1)[0]
socket.emit('client.join', JSON.stringify({roomId: roomId}))

$(function(){

socket.on('server.pressed', function (data) {
  if (busy) return false
  busy = true
  $.jqDialog.notify(data.holder, 60)
  $('body').css('background', data.color)
})

socket.on('server.judge', function (data) {
  if (data.status === 1) {
    se_correct.play()
    addPlayer(data.player)
    var hash = hashCalc(data.player)
    el = $('#'+hash+' td.o')
    pt = el.text()
    el.text(parseInt(pt)+1)
  }
  if (data.status === 2) {
    se_wrong.play();
    addPlayer(data.player)
    var hash = hashCalc(data.player)
    el = $('#'+hash+' td.x')
    pt = el.text()
    el.text(parseInt(pt)+1)
  }
  if (data.status === -1) {
    $('#point tbody').html('')
  }
  b.close()
  $('body').css('background', '#fff')
  $('#jqDialog_content').text('')
  busy = false
  busyMaster = false
})

})
