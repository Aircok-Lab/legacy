$(document).ready(function(e) {
    $('.db_area01 .bt_ct').click(function(e) {
        $(this).parent().toggleClass('off');
    });
});

addEventListener('DOMContentLoaded', function () {
	pickmeup('.db_area01 .box input', {
		position       : 'bottom',
		hide_on_select : true,
		mode : 'range'
	});
});

addEventListener('DOMContentLoaded', function () {
	pickmeup('.pu_d_data .date input', {
		position       : 'bottom',
		hide_on_select : true,
		mode : 'range'
	});
});

addEventListener('DOMContentLoaded', function () {
	pickmeup('.pu_report .date input', {
		position       : 'bottom',
		hide_on_select : true,
		mode : 'range'
	});
});

$(document).ready(function(e) {
    $('.bt_close').click(function(e) {
        $('.pu_bg').fadeOut(200);
        $('.pu').fadeOut(200);
        $('html').removeClass('on');
    });

    $("#slideshow > div:gt(0)").hide();

    setInterval(function() { 
      $('#slideshow > div:first')
        .fadeOut(1000)
        .next()
        .fadeIn(1000)
        .end()
        .appendTo('#slideshow');
    },  3000);

    // $(function().click(function(e) {
    //     $('.pu_bg').fadeIn(200);
    //     $('.pu_report').fadeIn(200);
    //     $('html').addClass('on');
    // });
    
    // $('.e_item li .bt_view_detail').click(function(e) {
    //     $('.pu_bg').fadeIn(200);
    //     $('.pu_d_data').fadeIn(200);
    //     $('html').addClass('on');
    // });
});