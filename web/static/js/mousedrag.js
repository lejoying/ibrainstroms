$(document).ready(function () {
    (function($) {
        $.event.special.mousewheel = {
            setup: function() {
                var handler = $.event.special.mousewheel.handler;

                // Fix pageX, pageY, clientX and clientY for mozilla
                if ( $.browser.mozilla )
                    $(this).bind('mousemove.mousewheel', function(event) {
                        $.data(this, 'mwcursorposdata', {
                            pageX: event.pageX,
                            pageY: event.pageY,
                            clientX: event.clientX,
                            clientY: event.clientY
                        });
                    });
                if ( this.addEventListener )
                    this.addEventListener( ($.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
                else
                    this.onmousewheel = handler;
            },

            teardown: function() {
                var handler = $.event.special.mousewheel.handler;

                $(this).unbind('mousemove.mousewheel');

                if ( this.removeEventListener )
                    this.removeEventListener( ($.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
                else
                    this.onmousewheel = function(){};

                $.removeData(this, 'mwcursorposdata');
            },

            handler: function(event) {
                var args = Array.prototype.slice.call( arguments, 1 );

                event = $.event.fix(event || window.event);
                // Get correct pageX, pageY, clientX and clientY for mozilla
                $.extend( event, $.data(this, 'mwcursorposdata') || {} );
                var delta = 0, returnValue = true;

                if ( event.wheelDelta ) delta = event.wheelDelta/120;
                if ( event.detail     ) delta = -event.detail/3;
//		if ( $.browser.opera  ) delta = -event.wheelDelta;

                event.data  = event.data || {};
                event.type  = "mousewheel";

                // Add delta to the front of the arguments
                args.unshift(delta);
                // Add event to the front of the arguments
                args.unshift(event);

                return $.event.handle.apply(this, args);
            }
        };

        $.fn.extend({
            mousewheel: function(fn) {
                return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
            },

            unmousewheel: function(fn) {
                return this.unbind("mousewheel", fn);
            }
        });

    })(jQuery);

    //展示树状菜单
    $(function(){
        $("#menu").click(function(){
            var showlist=$("<ul></ul>");
            showall(menulist.menulist,showlist);
            $("#div_menu").append(showlist);
        });
    });
    function showall(menu_list,parent){
        for(var munu in menu_list){
            if(menu_list[menu].menulist.Length>0){
                var li=$("<li></li>");
                $(li).append(menu_list[menu].NAME).append("<ul></ul>").appendTo(parent);
                showall(menu_list[menu].menulist,$(li).children().eq(0));
            }else{
                $("<li></li>").append(menu_list[menu].NAME).appendTo(parent);
            }
        }
    }
});