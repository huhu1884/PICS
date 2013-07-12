$(function() {
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
                    read(file, function(file) {
                        thumb(file.dataURL, 48, 48, function(img) {
                            $('<li></li>').attr('fileid', file.id).append(img).append($spn).append($del).appendTo($('.preview-area'));
                        });
                    });
                }
            }
            if (event.up5Action.type == 'delete') {

            }
        });
    };

    var thumb = function(src, maxWidth, maxHeight, callback) {
        var img = new Image();
        img.src = src;
        $(img).bind('load', function() {
            var realWidth = this.width;
            var realHeight = this.height;
            var realRate = realWidth / realHeight;
            var maxRate = maxWidth / maxHeight;
            if (realRate > maxRate) {
                this.width = maxWidth ;
                this.height = maxWidth * ( 1 / realRate ) ;
            } else {
                this.height = maxHeight;
                this.width = maxHeight * realRate;
            }
            callback(img);
        });
    };

    var read = function(file, callback) {
        var reader = new FileReader();
        reader.onload = (function(f){
            return function(e) {
                console.log(this);
                f.dataURL = this.result;
                callback(f);
            }
        })(file);
        reader.readAsDataURL(file);
    }
});