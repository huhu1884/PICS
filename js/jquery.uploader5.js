(function($) {

    $.fn.uploader5 = function(options) {
        if (typeof options === 'string') { // Method Call
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var instance = $.data(this, 'uploader5');
                if (!instance) {
                    console.error('cannot call methods on audio5 prior to initialization; attempted to call method "' + options + '"');
                    return;
                }
                if (!$.isFunction(instance[options]) || options.charAt(0) === '_' ) {
                    console.error('no such method "' + options + '" for audio5 instance');
                    return;
                }
                instance[ options ].apply(instance, args);
            });
        }
        else {
            this.each(function() {
                var instance = $.data(this, 'uploader5');
                if (!instance) {
                    $.data(this, 'uploader5', new $.uploader5(options, this));
                }
            });

        }
        return this;
    };

    $.uploader5 = function(options, element) {
        this.$el = $(element);
        this._init(options);
    };

    $.uploader5.defaults = {
        uploadURL: '1'
    };

    $.uploader5.event = {};
    $.each([
        'change',
        'progress',
        'error',
        'before',
        'complete'
    ], function() {
        $.uploader5.event[this] = 'up5_' + this;
    });

    $.uploader5.intArgs = function(args, ints) {
        for (var i = 0, arg; arg = args[i]; i++) {
            var parType = typeof arg;
            switch (parType) {
                case 'number':
                    ints.push(arg);
                    break;
                case 'string':
                    if (/^\d+$/.test(arg)) {
                        ints.push(parseInt(arg));
                    }
                    break;
                case 'object':
                    if (arg instanceof Array) {
                        $.uploader5.intArgs(arg, ints);
                    }
                    break;
            }
        }
    };

    $.uploader5.prototype = {
        _init: function(options) {
            var _up5 = this;
            _up5.options = $.extend(true, {}, $.uploader5.defaults, options);
            _up5.files = [];

            var $fileElement = $('<input type="file" multiple />');
            $fileElement.insertAfter(_up5.$el).hide().change(function() {
                var newFiles = [];
                for (var i = 0, file; file = this.files[i]; i++) {
                    file.id = _up5.files.length;
                    _up5.files.push(file);
                    newFiles.push(file);
                }
                _up5.$el.trigger(_up5._createEvent($.uploader5.event.change, {
                    files: newFiles,
                    type: 'add'
                }));
            });

            _up5.$el.each(function(idx, ele) {
                $(this).click(function() {
                    $fileElement.click();
                    return false;
                });
            });
        },

        _createEvent: function(type, data) {
            var _up5 = this,
                event = $.Event(type);
            event.uploader5 = _up5;
            event.up5Action = data;
            return event;
        },

        delete: function() {
            var _up5 = this,
                index = 0,
                delFiles = [],
                files = [],
                ids = [];

            $.uploader5.intArgs(arguments, ids);
            $.each(_up5.files, function() {
                ($.inArray(this.id, ids) >= 0) ? delFiles.push(this) : files.push(this);
            });

            _up5.files = files;
            _up5.$el.trigger(_up5._createEvent($.uploader5.event.change, {
                files: delFiles,
                type: 'delete'
            }));
        },

        upload: function() {
            var _up5 = this;
            for (var i = 0,file; file = _up5.files[i]; i++) {
                var formData = new FormData();
                formData.append(i, file);
                var xhr = new XMLHttpRequest();
                xhr.open('POST', _up5.options.uploadURL, true);
                (function(xhr, file) {
                    xhr.upload.onprogress = function (e) {
                        var percent = 0;
                        _up5.$el.trigger(_up5._createEvent($.uploader5.event.progress, {
                            file: file,
                            type: 'upload',
                            loadPercent: 100 * e.loaded / e.total
                        }));
                    };
                    xhr.upload.onloadend = function(e) {
                        if (i == _up5.files.length - 1) {
                            _up5.$el.trigger(_up5._createEvent($.uploader5.event.complete, {
                                files: _up5.files,
                                type: 'upload'
                            }));
                        }
                    };
                    xhr.upload.onloadstart = function(e) {
                        if (i == 0) {
                            _up5.$el.trigger(_up5._createEvent($.uploader5.event.before, {
                                files: _up5.files,
                                type: 'upload'
                            }));
                        }
                    };
                    xhr.upload.onabort = function(e) {
                        console.log(e);
                    };
                    xhr.onreadystatechange = function(e) {
                        if (e.target.readyState == 4 && e.target.status == 404) {
                            _up5.$el.trigger(_up5._createEvent($.uploader5.event.error, {
                                file: file,
                                type: 'upload'
                            }));
                            xhr.abort();
                        }
                    }
                    xhr.upload.error = function(e) {
                        console.log(e);
                        _up5.$el.trigger(_up5._createEvent($.uploader5.event.error, {
                            file: file,
                            type: 'upload'
                        }));
                    }
                })(xhr, file);
                xhr.send(formData);
            }
        }
    };

    $.uploader5.isFile = function(file) {
        return (file instanceof File);
    };

    $.uploader5.isImage = function(file) {
        if (!$.uploader5.isFile(file)) {
            return false;
        }
        return /^image\/(jpeg|png)$/.test(file.type);
    };

    $.uploader5.readDataURL = function(file, callback) {
        if (!$.uploader5.isFile(file)) {
            throw('This is not a file.');
        }
        var reader = new FileReader();
        reader.onload = (function(f){
            return function(e) {
                f.dataURL = this.result;
                callback(f);
            }
        })(file);
        reader.readAsDataURL(file);
    };

    $.uploader5.imageSizeFixed = function(file, maxWidth, maxHeight, callback) {
        if (!$.uploader5.isImage(file)) {
            throw('This is not a image.');
        }
        $.uploader5.readDataURL(file, function(f) {
            var img = new Image();
            img.src = f.dataURL;
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
        });
    }

})(jQuery);
