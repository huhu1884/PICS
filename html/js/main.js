$(function() {

    $('html').on("click", function(e){
        if(e.originalEvent && $(e.originalEvent.target).parents('.user-login').length == 0)
            $('.dropdown-menu').hide();
    });

    $('.user-login').on('click', function() {
        $('.dropdown-menu').show();
    });

    $(window).on('resize', function() {
        var width = $(this).width();
        var leftWidth = $('section:eq(0)').width();
        $('section:eq(1)').width(width - leftWidth - 2);
    });

    $('.login').click(function() {
        $.Dialog({
            'title': 'Login',
            'content': '<div style="width: 400px; height: 280px;"></div>',
            'buttons': {
                'Ok': {
                    action: function() {}
                },
                'Cancel': {
                    action: function() {}
                }
            }
        });
        return false;
    });

	$('.uploader-box').fancybox({
        type: 'ajax',
        afterShow: function() {
            $.fancybox.update();
            bindUploader();
        }
    });

    var bindUploader = function() {
        var $uploader = $('.select-file').uploader5({});
        $uploader.bind($.uploader5.event.change, function(event) {
            if (event.up5Action.type == 'add') {
                for (var i = 0, file; file = event.up5Action.files[i]; i++) {
                    var $del = $('<a href="javascript:void(0);">X</a>').attr('fileid', file.id).unbind('click').click(function() {
                        $uploader.uploader5('delete', $(this).attr('fileid'));
                    });
//                    var $chk = $('<input type="checkbox" />').attr('fileid', file.id);
//                    var $bar = $('<span></span>').attr('fileid', file.id);
                    var $spn = $('<span></span>').text(file.name);
                    $.uploader5.imageSizeFixed(file, 48, 48,
                        (function(f) {
                            return function(img) {
                                $('<li></li>').attr('fileid', f.id).append(img).append($spn).append($del).appendTo($('.preview-area'));
                            };
                        })(file)
                    );
                }
            }
            if (event.up5Action.type == 'delete') {

            }
        });
    };
});
