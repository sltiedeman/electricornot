setTimeout(function(){
	var windowHeight = window.innerHeight;
	var contentHeight = $('#intro-page').height();
	console.log(contentHeight);
	var paddingAdjust = parseInt((windowHeight - contentHeight)/2)
	$('#intro-page').css('padding-top', paddingAdjust + 'px');
},10);


function viewProject(){
	document.getElementById("intro-page-wrapper").style.display="none";
}