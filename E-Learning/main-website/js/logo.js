(function ($) {
    "use strict";
    function updateLogo() {
        if ($('.main-header').hasClass('fixed-header')) {
            $('#logo').attr('src', 'images/logo.webp');
        } else {
            if ($(window).width() > 1020) {
                $('#logo').attr('src', 'images/logo-light.webp');
            }
        }
    }
    updateLogo();
    $(window).on('scroll', () => {
        updateLogo();
    });
    $(window).on('load', () => {
        updateLogo();
    });
})(window.jQuery);
