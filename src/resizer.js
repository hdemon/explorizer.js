(function(exp){

var resizer;
resizer = (function(util){
    var NewResizer = function(){};

    NewResizer.prototype = (function(){ 
        var angleStr    = "top bottom left right top_left top_right bottom_left bottom_right",
            angleArray    = angleStr    .split(" "),
            protoMember = {},
            handle = {};
                
        handle.top = {
            css : function () {
                return {
                    "top":      0 - this.handleWidth + this.topGap,
                    "left":     0,
                    "width":    this.width,
                    "height":   this.handleWidth,
                    "z-index":  this.zIndex,
                    "cursor":   "n-resize"
                }
            },
            mouseMove : function (event) { this.$t.css( handle.top.range.bind(this)(event)); },
            mouseUp : function (event) {
                this.$handle["left"]    .css({ "height": this.$t.height() - this.topGap });
                this.$handle["right"]   .css({ "height": this.$t.height() - this.topGap });
            },
            range : function (event) {
                var _height, top, height, accTerm, attMax, attMin, divY, priority, nowTop;
                
                nowTop      = event.pageY - this.divY_Hnd_top;
                divY        = this.prevTop - nowTop;
                _height     = (this.height - this.borderWidthY) + divY;
                accTerm     = (nowTop + this.topGap < 0);
                attMax      = (_height > this.limit.maxY);
                attMin      = (_height < this.limit.minY);
                priority    = ( (this.prevBottom - this.limit.maxY) > 0 )

                if (accTerm || attMax){
                    if (priority){
                        top     = this.prevBottom - this.limit.maxY - this.divY_Hnd_top;
                        height  = this.height - (top - this.prevTop) - this.borderWidthY;
                    } else if (nowTop + this.topGap < 0){
                        top     = 0 - this.topGap;
                        height  = this.height - (top - this.prevTop) - this.borderWidthY;
                //        height  = this.prevBottom - this.borderWidthY;
                    }
                } else if ( attMin ){
                    top     = this.prevBottom - this.limit.minY - this.borderWidthY;// - this.divY_Hnd_top;
                    height  = this.limit.minY;
                } else {
                    top     = nowTop;
                    height  = this.height - this.borderWidthY - (top - this.prevTop);
                }

                return { "top" : top, "height" : height };
            }
        },

        handle.bottom = {
            css : function () {
                return {
                    "bottom":    0    - this.handleWidth + this.bottomGap,
                    "left":     0,
                    "width":     this.width,
                    "height":    this.handleWidth,
                    "cursor":    "s-resize",
                    "z-index":    this.zIndex
                }
            },
            mouseMove : function (event) { this.$t.css( handle.bottom.range.bind(this)(event)); },
            mouseUp : handle.top.mouseUp,
            range : function (event) {
                var    _height, top, height, accTerm, attMax, attMin, divY, priority, nowTop;

                nowTop        = event.pageY - this.divY_Hnd_bottom;
                divY        = nowTop - this.prevBottom;
                _height        = ( this.height - this.borderWidthY ) + divY;
                accTerm        = (nowTop > this.wrap.bottom);
                attMax        = (_height > this.limit.maxY);
                attMin        = (_height < this.limit.minY);
                priority    = ( (this.prevTop + this.limit.maxY) < (this.wrap.bottom) );

                if ( accTerm || attMax ){
                    if ( priority ){
                        height    = this.limit.maxY;
                    } else {
                        height    = this.wrap.bottom - this.prevTop;
                    }
                } else if ( attMin ){
                    height    = this.limit.minY;
                } else {
                    height    = _height;
                }

                return { "height" : height };
            }
        },

        handle.left = {
            css : function () {
                return {
                    "top":        0 + this.topGap,
                    "left":     0 - this.handleWidth + this.leftGap,
                    "width":     this.handleWidth,
                    "height":    this.height - this.topGap,
                    "cursor":    "e-resize",
                    "z-index":    this.zIndex
                }
            },
            mouseMove : function (event) { this.$t.css( handle.left.range.bind(this)(event)); },
            mouseUp : function (event) {
                this.$handle["top"]        .css({ "width" : this.$t.width() });
                this.$handle["bottom"]    .css({ "width" : this.$t.width() });
            },
            range : function (event) {
                var    _width, left, width, accTerm, attMax, attMin, divX, priority, nowLeft;

                nowLeft        = event.pageX - this.divX_Hnd_left;
                divX        = this.prevLeft - nowLeft;
                _width        = (this.width - this.borderWidthX) + divX;
                accTerm        = (nowLeft < this.wrap.left);
                attMax        = (_width > this.limit.maxX);
                attMin        = (_width < this.limit.minX);
                priority    = ( (this.prevRight - this.limit.maxX) > (this.wrap.left) )

                if ( accTerm || attMax ){
                    if ( priority ){
                        left    = this.prevRight - this.limit.maxX - this.divX_Hnd_left;
                        width    = this.width - (left - this.prevLeft) - this.borderWidthX;
                    } else if ( nowLeft < this.wrap.left ){
                        left    = this.wrap.left;
                        width    = this.prevRight - this.wrap.left - this.borderWidthX;
                    }
                } else if ( attMin ){
                    left    = this.prevRight - this.limit.minX - this.borderWidthX;// - this.divY_Hnd_top;
                    width    = this.limit.minX;
                } else {
                    left    = nowLeft;
                    width    = this.width - (left - this.prevLeft) - this.borderWidthX;
                }

                return { "left" : left, "width" : width };
            }
        },

        handle.right = {
            css : function () {
                return {
                    "top":        0 + this.topGap,
                    "right":    0 - this.handleWidth + this.rightGap,
                    "width":     this.handleWidth,
                    "height":    this.height - this.topGap,
                    "cursor":    "w-resize",
                    "z-index":    this.zIndex
                }
            },
            mouseMove : function (event) { this.$t.css( handle.right.range.bind(this)(event)); },
            mouseUp : handle.left.mouseUp,
            range : function (event) {
                var    _width, left, width, accTerm, attMax, attMin, divX, priority, nowLeft;

                nowLeft        = event.pageX - this.divX_Hnd_right;
                divX        = nowLeft - this.prevRight;
                _width        = ( this.width - this.borderWidthX ) + divX;
                accTerm        = (nowLeft > this.wrap.right);
                attMax        = (_width > this.limit.maxX);
                attMin        = (_width < this.limit.minX);
                priority    = ( (this.prevLeft + this.limit.maxX) < (this.wrap.right) );

                if ( accTerm || attMax ){
                    if ( priority ){
                        width    = this.limit.maxX;
                    } else {
                        width    = this.wrap.right - this.prevLeft;
                    }
                } else if ( attMin ){
                    width    = this.limit.minX;
                } else {
                    width    = _width;
                }

                return { "width" : width };
            }
        },

        handle.top_left = {
            css : function () {
                return {
                    "top":        0    - this.handleWidth + this.topGap,
                    "left":     0    - this.handleWidth + this.leftGap,
                    "width":     this.angleHandleSize,
                    "height":    this.angleHandleSize,
                    "cursor":    "nw-resize",
                    "z-index":    this.zIndex + 1
                }
            },
            mouseMove : function (event) { handle.top.mouseMove.bind(this)(event);  handle.left.mouseMove.bind(this)(event); },
            mouseUp : function (event) { handle.top.mouseUp.bind(this)(event);  handle.left.mouseUp.bind(this)(event); }
        },

        handle.top_right = {
            css : function () {
                return {
                    "top":        0    - this.handleWidth + this.topGap,
                    "right":    0    - this.handleWidth + this.rightGap,
                    "width":     this.angleHandleSize,
                    "height":    this.angleHandleSize,
                    "cursor":    "ne-resize",
                    "z-index":    this.zIndex + 1
                }
            },
            mouseMove : function (event) { handle.top.mouseMove.bind(this)(event);  handle.right.mouseMove.bind(this)(event); },
            mouseUp : handle.top_left.mouseUp
        },

        handle.bottom_left = {
            css : function () {
                return {
                    "bottom":    0    - this.handleWidth + this.bottomGap,
                    "left":     0    - this.handleWidth + this.leftGap,
                    "width":     this.angleHandleSize,
                    "height":    this.angleHandleSize,
                    "cursor":    "sw-resize",
                    "z-index":    this.zIndex + 1
                }
            },
            mouseMove : function (event) { handle.bottom.mouseMove.bind(this)(event);  handle.left.mouseMove.bind(this)(event); },
            mouseUp : handle.top_left.mouseUp
        },

        handle.bottom_right = {
            css : function () {
                return {
                    "bottom":    0    - this.handleWidth + this.bottomGap,
                    "right":    0    - this.handleWidth + this.rightGap,
                    "width":     this.angleHandleSize,
                    "height":    this.angleHandleSize,
                    "cursor":    "se-resize",
                    "z-index":    this.zIndex + 1
                }
            },
            mouseMove : function (event) { handle.bottom.mouseMove.bind(this)(event);  handle.right.mouseMove.bind(this)(event); },
            mouseUp : handle.top_left.mouseUp
        }

        function mouseDown_common ( x, y, angle ){
            var $w = this.$wrapper,
                wos = $w.offset();
            
            this.width      = this.$t.outerWidth(true);
            this.height     = this.$t.outerHeight(true);            
            this.prevTop    = this.$t.position().top;
            this.prevLeft   = this.$t.position().left;
            this.prevBottom = this.prevTop + this.height;
            this.prevRight  = this.prevLeft + this.width;
            this.wrap = {
                top     : wos.top,
                bottom  : wos.top + $w.height(),
                left    : wos.left,
                right   : wos.left + $w.width(),
                width   : $w.width(),
                height  : $w.height()
            };
            this.divX_Hnd_left  = x - this.prevLeft; // divasion from handle central axis. 
            this.divX_Hnd_right = x - this.prevLeft - this.width; // divasion from handle central axis. 
            this.borderWidthX   = ( parseInt(this.$t.css("border-left-width")) +
                                    parseInt(this.$t.css("border-right-width")) );
            this.divY_Hnd_top   = y - this.prevTop; // divasion from handle central axis. 
            this.divY_Hnd_bottom = y - this.prevBottom; // divasion from handle central axis. 
            this.borderWidthY   = ( parseInt(this.$t.css("border-top-width")) +
                                    parseInt(this.$t.css("border-bottom-width")) );

            this.event.mouseMove[ angle ] = function (event) {
                handle[ angle ].mouseMove.bind(this)(event);
            }.bind(this);
            $(window).bind( "mousemove", this.event.mouseMove[ angle ] );
            
            this.event.mouseUp = protoMember.mouseUpEvent || function (event) {
                $(window)
                    .unbind( "mouseup",    this.event.mouseUp );                    
                handle[ angle ].mouseUp.bind(this)(event, this);
                this.callback.end();
            }.bind(this);
            $(window).bind( "mouseup", this.event.mouseUp );            
        }

        function createHandleDiv ( angle ) {
            this.$t
                .append(
                    "<div " +
                        "class=\"" +
                            this.clsName +" "+
                            "hnd_" + angle +
                        "\" " +
                        "id=\"" +
                            this.clsName +"_"+ angle +"_"+ this.id +
                        "\" " +
                        util.preventSelect +
                    ">" +
                    "</div>"
                );
            return this.$t .children( "." + this.clsName ) .filter( ".hnd_" + angle );
        } 

        function setCss ( angle ) {
            this.$handle[ angle ].css( handle[ angle ].css.bind(this)() );
        }

        function setMouseDown ( angle ) {
            var that = this;
            this.event.mouseDown[ angle ] = function (event) {
                event.stopPropagation();
                mouseDown_common.bind(that)( event.pageX, event.pageY, angle );
                this.callback.start();
            }.bind(this);
                        
            this.$handle[ angle ]
                .bind( "mousedown",    this.event.mouseDown[ angle ].bind(this) );
        }
        
        return {
            set : function (args) {
                args = args || { gap:null, limit:null };

                this.$wrapper   = args  .wrapper;
                this.clsName    = args  .clsName    || "hd_ex_resize";
                this.id         = String( args.id ) || null;
                this.angle      = args  .angle      || angleStr;
                this.handleWidth = args .handleWidth|| 15;
                this.angleHandleSize = args .angleHandleSize || 15;
                this.zIndex     = args  .zIndex     || 0;
                this.leftGap    = (typeof args .leftGap !== "number")   ? 0 : args.leftGap,
                this.rightGap   = (typeof args .rightGap !== "number")  ? 0 : args.rightGap,
                this.topGap     = (typeof args .topGap !== "number")    ? 0 : args.topGap,
                this.bottomGap  = (typeof args .bottomGap !== "number") ? 0 : args.bottomGap
                this.limit      = {
                    maxX    : args .maxX,
                    maxY    : args .maxY,
                    minX    : (typeof args.minX !== "number") ? 50 : args.minX,
                    minY    : (typeof args.minY !== "number") ? 50 : args.minY
                };

                this.callback    = {
                    start    : args .start    || function(){},
                    end        : args .end        || function(){}
                };
                
                return    this;
            },

            add : function( $target ){
                this.$t    = $target;
                this.$handle = {};
                this.event = { mouseDown:{}, mouseMove:{}, mouseUp:{} };

                this.width    = this.$t.outerWidth(true);
                this.height    = this.$t.outerHeight(true);

                for ( var i=0, a=this.angle.split(" "), l=a.length; i<l; i++ ){
                    var angle = String( a[i] );
                    this.$handle[ angle ] = createHandleDiv.bind(this)( angle );
                    setCss.bind(this)( angle );
                    setMouseDown.bind(this)( angle );
                }
            
                return    this;
            }
        } //return
    }()); //prototype

    return NewResizer;
}(exp.util));

exp.resizer = resizer;
})(exp);