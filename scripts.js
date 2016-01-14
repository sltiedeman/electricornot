setTimeout(function(){
	var windowHeight = window.innerHeight;
	$('#intro-page-wrapper').css('height', windowHeight + 'px');
	var contentHeight = $('#intro-page').height();
	var paddingAdjust = parseInt((windowHeight - contentHeight-25)/2);
	$('#logo').css('padding-top', paddingAdjust + 'px');
},10);


function viewProject(){
	document.getElementById("intro-page-wrapper").style.display="none";
}