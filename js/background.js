var rep_words = ['programmer','designer','dreamer','leader','creator'], rep_words_counter = 0;
var content_array = ['about','academics','achievements','resume','projects','interests','canvas','contacts'];

function select_article(article_name){
	$('a.selected_nav').removeClass('selected_nav');
	$('article.selected_content').removeClass('selected_content');
	$('a#nav_'+article_name).addClass('selected_nav');
	$('article#outside_'+article_name).addClass('selected_content');
	// $('.content_container').scrollLeft(content_array.indexOf(article_name)*490);
	$('.content_container').animate({scrollLeft:content_array.indexOf(article_name)*500}, 1000);
}

Buttons = {
	handle_hide: function(the_class) {
		$('div.'+the_class).slideToggle('slow', function() {
			$('span.'+the_class).toggleClass('fa-chevron-down')
			$('span.'+the_class).toggleClass('fa-chevron-up')
		})
	}
}

$(document).ready(function () {

	setTimeout(function () {
		$('.loading_page').addClass('loaded');
		$('.fullContainer').css('display','block');
	}, 15000);

	setTimeout(function () {
		$('.loaded').css('display','none');
		document.getElementById('someLoader').outerHTML = "";
	}, 16500);
	
	// $("#outside_nav").niceScroll("#inside_nav",{cursorcolor:"#00F",boxzoom:false,cursoropacitymax:0.1});
	// $("#outside_about").niceScroll("#inside_about",{cursorcolor:"#999",boxzoom:true,cursoropacitymax:0.5});
	
	window.setInterval(function(){
		$('#rep_word').animate({'opacity': 0, 'margin-left': 30}, 600, function() {
			$(this).text(rep_words[rep_words_counter]).animate({'opacity': 1, 'margin-left': 5}, 600);
		});
		rep_words_counter++;
		if (rep_words_counter == rep_words.length) {rep_words_counter = 0;}
	}, 3000);

});