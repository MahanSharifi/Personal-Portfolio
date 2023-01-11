"use strict";

$(document).ready(function () {
	/* Video Lightbox */
	if (!!$.prototype.simpleLightboxVideo) {
		$('.video').simpleLightboxVideo();
	}

	/*ScrollUp*/
	if (!!$.prototype.scrollUp) {
		$.scrollUp();
	}

	/*Responsive Navigation*/
	$("#nav-content-pages").html($("#nav-main").html());
	$("#nav-box span").on("click",function() {
		if ($("nav#nav-content-pages ul").hasClass("expanded")) {
			$("nav#nav-content-pages ul.expanded").removeClass("expanded").slideUp(50);
			$(this).removeClass("open");
		} else {
			$("nav#nav-content-pages ul").addClass("expanded").slideDown(50);
			$(this).addClass("open");
		}
	});

	$("#nav-content-pages").html($("#nav-main").html());
	$("#nav-content-pages ul a").on("click",function() {
		if ($("nav#nav-content-pages ul").hasClass("expanded")) {
			$("nav#nav-content-pages ul.expanded").removeClass("expanded").slideUp(50);
			$("#nav-box span").removeClass("open");
		}
	});

	/* Sticky Navigation */
	if (!!$.prototype.stickyNavbar) {
		$('#header').stickyNavbar();
	}

	$('#content').waypoint(function (direction) {
		if (direction === 'down') {
			$('#header').addClass('nav-solid fadeInDown');
		}
		else {
			$('#header').removeClass('nav-solid fadeInDown');
		}
	});

});


/* Preloader and animations */
$(window).load(function () { // makes sure the whole site is loaded
	$('#status').fadeOut(); // will first fade out the loading animation
	$('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
	$('body').delay(350).css({'overflow-y': 'visible'});

	/* WOW Elements */
	if (typeof WOW == 'function') {
		new WOW().init();
	}

	/* Parallax Effects */
	if (!!$.prototype.enllax) {
		$(window).enllax();
	}

});