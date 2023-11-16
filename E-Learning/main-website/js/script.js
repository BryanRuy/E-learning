(function ($) {
	"use strict";
	//Hide Loading Box (Preloader)
	function handlePreloader() {
		if ($('.preloader').length) {
			$('.preloader').fadeOut(100);
		}
	}
	//Update Header Style and Scroll to Top
	function headerStyle() {
		if ($('.main-header').length) {
			var windowpos = $(window).scrollTop();
			var siteHeader = $('.main-header');
			var scrollLink = $('.scroll-to-top');
			if (windowpos >= 1) {
				siteHeader.addClass('fixed-header');
				scrollLink.fadeIn(300);
			} else {
				siteHeader.removeClass('fixed-header');
				scrollLink.fadeOut(300);
			}
		}
	}
	headerStyle();
	//Sub-menu Dropdown Toggle
	if ($('.main-header li.dropdown ul').length) {
		$('.main-header li.dropdown').append('<div class="dropdown-btn"><span class="fa fa-angle-down"></span></div>');
		//Dropdown Button
		$('.main-header li.dropdown .dropdown-btn').on('click', () => {
			$(this).prev('ul').slideToggle(300);
		});
		//Disable dropdown parent link
		$('.main-header .navigation li.dropdown > a,.hidden-bar .side-menu li.dropdown > a').on('click', (e) => {
			e.preventDefault();
		});
		//Main Menu Fade Toggle
		$('.main-header .nav-toggler').on('click', () => {
			$('.main-header .main-menu').fadeToggle(300);
		});
	}
	//Fact Counter + Text Count
	if ($('.count-box').length) {
		$('.count-box').appear(() => {
			var $t = $(this),
				n = $t.find(".count-text").attr("data-stop"),
				r = parseInt($t.find(".count-text").attr("data-speed"), 10);
			if (!$t.hasClass("counted")) {
				$t.addClass("counted");
				$({
					countNum: $t.find(".count-text").text()
				}).animate({
					countNum: n
				}, {
					duration: r,
					easing: "linear",
					step: () => {
						$t.find(".count-text").text(Math.floor(this.countNum));
					},
					complete: () => {
						$t.find(".count-text").text(this.countNum);
					}
				});
			}
		}, { accY: 0 });
	}
	//Event Countdown Timer
	if ($('.time-countdown').length) {
		$('.time-countdown').each(() => {
			var $this = $(this), finalDate = $(this).data('countdown');
			$this.countdown(finalDate, (event) => {
				var $this = $(this).html(event.strftime('' + '<div class="counter-column"><span class="count">%D</span>Days</div> ' + '<div class="counter-column"><span class="count">%H</span>Hours</div>  ' + '<div class="counter-column"><span class="count">%M</span>Minutes</div>  ' + '<div class="counter-column"><span class="count">%S</span>Seconds</div>'));
			});
		});
	}
	// Scroll to a Specific Div
	if ($('.scroll-to-target').length) {
		$(".scroll-to-target").on('click', function () {
			var target = $(this).attr('data-target');
			$('html, body').animate({
				scrollTop: $(target).offset().top
			}, 1500);
		});
	}
	// When document is Scrolling, do
	$(window).on('scroll', () => {
		headerStyle();
	});
	// When document is loading, do
	$(window).on('load', () => {
		handlePreloader();
	});
	$('#btnRegister').on('click', () => {
		var oldStudent = $('#StudentLink').attr("href");
		var oldTeacher = $('#TeacherLink').attr("href");
		$('#StudentLink').attr("href", oldStudent.replace('login', 'register'));
		$('#TeacherLink').attr("href", oldTeacher.replace('login', 'register'));
		$('#Modal').modal('show');
	});
	$('#btnLogin').on('click', () => {
		var oldStudent = $('#StudentLink').attr("href");
		var oldTeacher = $('#TeacherLink').attr("href");
		$('#StudentLink').attr("href", oldStudent.replace('register', 'login'));
		$('#TeacherLink').attr("href", oldTeacher.replace('register', 'login'));
		$('#Modal').modal('show');
	});
	if (!localStorage.getItem('i18nextLng')) {
		localStorage.setItem('i18nextLng', 'ro');
	}
	i18next
		.use(i18nextHttpBackend)
		.use(i18nextBrowserLanguageDetector)
		.init({
			fallbackLng: 'ro',
			debug: false,
			backend: {
				loadPath: 'locales/{{lng}}.json',
				crossDomain: false
			}
		}, (_err, _t) => {
			updateContent();
		});
	function updateContent() {
		jqueryI18next.init(i18next, $);
		$(".body").localize();
		if (i18next.language === "en") {
			$("#en").css("font-weight", "bold");
			$("#en").css("color", "black");
			$("#ro").css("font-weight", "normal");
			$("#ro").css("color", "unset");
		} else {
			$("#ro").css("font-weight", "bold");
			$("#ro").css("color", "black");
			$("#en").css("font-weight", "normal");
			$("#en").css("color", "unset");
		}
	}
	function changeLng(lng) {
		i18next.changeLanguage(lng);
	}
	i18next.on('languageChanged', () => {
		updateContent();
	});
	$('#enBtn').on('click', () => {
		i18next.changeLanguage('en');
	});
	$('#roBtn').on('click', () => {
		i18next.changeLanguage('ro');
	});
})(window.jQuery);
