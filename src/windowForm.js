(function(exp){

var windowForm;
windowForm = (function () {
    var idCounter    = 0;

    function NewWindowForm( core ) {
        this.core       = core;
        this.formId     = idCounter;

        this.pref = this.core.pref;
        this.width      = this.core.width;
        this.height     = this.core.height;
        this.minWidth   = this.core.minWidth;
        this.minHeight  = this.core.minHeight; 
        this.maxWidth   = this.core.maxWidth; 
        this.maxHeight  = this.core.maxHeight; 
        this.tBarHeight = this.core.tBarHeight;

        idCounter += 1;
    }

    NewWindowForm.prototype = (function () {
        var form    = "form",
            elem    = "elem",
            content = "ct",
            innrWrap= "iw",
            outrWrap= "ow";
            
        var module = {};

        function createWrapper(_this) {
            this.$ow    = this.core.createDiv( this.core.$wrapper   outrWrap,   this.formId );
            this.$iw    = this.core.createDiv( this.$ow,            innrWrap,   this.formId );
            this.$ct    = this.core.createDiv( this.$iw,            content,    this.formId );
        }

        function adjustSize ($ct, $ow, height, width) {
            var x    = $ct.offset().left,
                y    = $ct.offset().top,
                h    = height   || $ct.outerHeight(),
                w    = width    || $ct.outerWidth();
         
             // The CSS height of content (lowermost layer) change "auto".   
             $ct.css({
                 "top"      : 0,
                 "left"     : 0,
                 "width"    : "",
                 "height"   : ""
             });

            // Set the same location and size as the content element before altering.
            // The outer wrapper works indicator for location and size.
            $ow.css({
                "top"       : y,
                "left"      : x,
                "height"    : h,
                "width"     : w
            });
            // The inner wrapper confire display range. this width and height are "100%" for the outer wrapper.
        }

        function resetCtSize ($ct) {
            $ct
                .css({ "height": "" });
        }

        function fitCtSize ($ct, $iw) {
            // if the content's height is less than that of the inner wrapper, selection range is confired by
            // the content's size (because selection events work in the content object). And so the content's
            // size fit in the inner wrapper.
            if ( $ct.height() < $iw.height() ) {
                $ct
                    .css({ "height": $iw.height() - 8 });
            }
        }

        return {
             //public
            add : function(){
                this.$ow    = this.core.createDiv( this.core.$wrapper,  outrWrap,   this.formId );
                this.$iw    = this.core.createDiv( this.$ow,            innrWrap,   this.formId );
                this.$ct    = this.core.createDiv( this.$iw,            content,    this.formId );
                adjustSize(this.$ct, this.$ow, this.height, this.width);

                this.$ct
                    .css({ "padding" : 2 });     // to prevent display vertical-scrollbar over again

                this.module.resizer =  new explorizer.resizer(this),
                this.module.resizer
                    .set({
                        "clsName"       : this.pref + this.core.lb.resize,
                        "id"            : this.formId,
                        "topGap"        : -25,        // for title bar's height
                        "bottomGap"     : 5,
                        "leftGap"       : 5,
                        "zIndex"        : 3,
                        "angleHandleSize": 25,
                        "end"           : function(){ fitCtSize(this.$ct, this.$iw) }.bind(this),
                        "start"         : function(){
                            resetCtSize(this.$ct);
                            this.core.module.aligner
                                .setFocus( this.formId );
                        }.bind(this),
                        "wrapper"       : $("#wrapper")    })
                    .add( this.$ow );

                var $bar =
                    this.core.module.titleBar(this.core, this);

                return     this.$ct;
            },

            initialize : function(){
                resetCtSize(this.$ct);
                fitCtSize(this.$ct, this.$iw);  

                this.$elem    = this.$ct.children( "." + this.core.pref + this.core.lb.elem  );
                this.numbering();
            },

            numbering : function(){
                for ( var i = 0, $elem = this.core.get$elem( this.formId ), l = $elem.length; i < l; i++ ) {
                    $elem.eq(i)
                        .attr( "id", this.core.pref + this.formId + "_" + this.core.lb.elem  + "_" + i );
                }
            },

            getFormId : function(){
                return this.formId;
            },

            get$elem : function(){
                return this.$ct.children( "." + this.core.pref + elem );
            },

            get$ow : function(){ return this.$ow; },
            get$iw : function(){ return this.$iw; },
            get$ct : function(){ return this.$ct; },

            get$elem : function (elemId) {
                if ( arguments.length === 1 ) {
                    return this.$ct.children( "." + this.core.pref + elem );
                } else if ( arguments[0] === "all" || arguments.length === 0 ) {
                    return this.$ct.children( "." + this.core.pref + elem );
                }
            },

            preselectElem : function (elemId ) {
                $( "#" + this.pref + this.formId + "_" + this.lb.elem + "_" + elemId )
                    .removeClass( this.lb.selected  )
                    .removeClass( this.lb.preselect )
                    .addClass   ( this.lb.preselect );
            },

            selectElem : function (elemId ) {
                $( "#" + this.pref + this.formId + "_" + this.lb.elem + "_" + elemId )
                    .removeClass( this.lb.selected  )
                    .removeClass( this.lb.preselect )
                    .addClass   ( this.lb.selected  );
            },

            unselectElem : function (elemId ) {
                $( "#" + this.pref + this.formId + "_" + this.lb.elem + "_" + elemId )
                    .removeClass( this.lb.selected  )
                    .removeClass( this.lb.preselect )
                    .addClass   ( this.lb.unSelect  );
            },

            unselectAllElem : function(){
                $( "." + this.pref + this.lb.elem )
                    .removeClass( this.lb.selected  )
                    .removeClass( this.lb.preselect )
                    .addClass   ( this.lb.unSelect  );
            },

            selectPropery : function (elemId) {
                $( "." + this.lb.preselect )
                    .removeClass( this.lb.preselect )
                    .addClass   ( this.lb.selected  );
            },

            isSelect : function (elemId, includePre) {
                includePre = true;
                return (
                    $( "#" + this.pref + this.formId + "_" + this.lb.elem + "_" + elemId )
                        .is( "."+this.lb.selected + ((includePre) ? ", ."+this.lb.preselect : "") )
                )
            }
        }
    }());

    return NewWindowForm;
}());

exp.windowForm = windowForm;    
})(exp);
