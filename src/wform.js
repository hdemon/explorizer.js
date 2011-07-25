(function(exp) {
    
var windowForm;
windowForm = (function(core, util) {
    var idCounter    = 0;

    function NewWindowForm() {
        this.formId     = idCounter;
        
        this.width      = core.width;
        this.height     = core.height;
        this.minWidth   = core.minWidth;
        this.minHeight  = core.minHeight; 
        this.maxWidth   = core.maxWidth; 
        this.maxHeight  = core.maxHeight; 
        this.tBarHeight = core.tBarHeight;

        this.mod = {};
        idCounter += 1;
    }

    NewWindowForm.prototype = (function() {
        var form    = "form",
            elem    = "elem";
            
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
                .css({ "height" : "" });
        }

        function fitCtSize ($ct, $iw) {
            // if the content's height is less than that of the inner wrapper, selection range is confired by
            // the content's size (because selection events work in the content object). And so the content's
            // size fit in the inner wrapper.
            if ($ct.height() < $iw.height()) {
                $ct
                    .css({ "height": $iw.height() - 8 });
            }
        }

        return {
             //public
            add : function() {
                console.log(util);
                this.$ow    = util.createDiv(core.$wrapper,  core.lb.outrWrap,   this.formId);
                this.$iw    = util.createDiv(this.$ow,       core.lb.innrWrap,   this.formId);
                this.$ct    = util.createDiv(this.$iw,       core.lb.content,    this.formId);
                adjustSize(this.$ct, this.$ow, this.height, this.width);

                this.$ct
                    .css({ "padding" : 2 });     // to prevent display vertical-scrollbar over again
                
                /**
                 * mod
                 */
                this.mod.resizer =  new exp.resizer(this),
                this.mod.titleBar = new exp.titleBar(this);
                
                this.mod.resizer
                    .set({
                        "clsName"       : core.pref + core.lb.resize,
                        "id"            : this.formId,
                        "topGap"        : -25,        // for title bar's height
                        "bottomGap"     : 5,
                        "leftGap"       : 5,
                        "zIndex"        : 3,
                        "angleHandleSize": 25,
                        "maxY" :  600 ,
                        "end"           : function() { fitCtSize(this.$ct, this.$iw) }.bind(this),
                        "start"         : function() {
                            resetCtSize(this.$ct);
                            core.mod.aligner
                                .setFocus(this.formId);
                        }.bind(this),
                        "wrapper"       : $("#wrapper")    })
                    .add(this.$ow);

                var $bar = this.mod.titleBar.add();

                return     this.$ct;
            },

            initialize : function() {
                resetCtSize(this.$ct);
                fitCtSize(this.$ct, this.$iw);
                this.numbering();
            },
            
            /**
             * "this.get$elem(i)" is unavailable here. Because get$elem function use
             * id attribute, but id are not prepared before execution of "numbering" function.
             */
            numbering : function() {
                for (var i = 0, $elem = this.get$elem("all"), l = $elem.length; i < l; i++) {
                    $elem.eq(i) 
                        .attr("id", core.pref + this.formId + "_" + core.lb.elem  + "_" + i);
                }
            },

            getFormId : function() { return this.formId; },
            get$ow : function() { return this.$ow; },
            get$iw : function() { return this.$iw; },
            get$ct : function() { return this.$ct; },

            get$elem : function (elemId) {
                if (arguments.length === 0 || arguments[0] === "all")
                    return this.get$ct().children("." + core.pref + core.lb.elem);
                else
                    return $("#" + core.pref + this.formId + "_" + core.lb.elem + "_" + elemId);
            },

            preselectElem : function (elemId) {
                this.get$elem(elemId)
                    .removeClass(core.lb.selected )
                    .removeClass(core.lb.preselect)
                    .addClass   (core.lb.preselect);
            },

            selectElem : function (elemId) {
                this.get$elem(elemId)
                    .removeClass(core.lb.selected )
                    .removeClass(core.lb.preselect)
                    .addClass   (core.lb.selected );
            },

            unselectElem : function (elemId) {
                this.get$elem(elemId)
                    .removeClass(core.lb.selected )
                    .removeClass(core.lb.preselect)
                    .addClass   (core.lb.unSelect );
            },

            selectAllElem : function() {
                this.get$elem("all")
                    .removeClass(core.lb.selected )
                    .removeClass(core.lb.preselect)
                    .addClass   (core.lb.selected );
            },

            unselectAllElem : function() {
                this.get$elem("all")
                    .removeClass(core.lb.selected )
                    .removeClass(core.lb.preselect)
                    .addClass   (core.lb.unSelect );
            },
                
            selectPropery : function (elemId) {
                $("." + core.lb.preselect)
                    .removeClass(core.lb.preselect)
                    .addClass   (core.lb.selected );
            },

            isSelect : function (elemId, includePre) {
                includePre = true;
                return (
                    $("#" + core.pref + this.formId + "_" + core.lb.elem + "_" + elemId)
                        .is("."+core.lb.selected + ((includePre) ? ", ."+core.lb.preselect : ""))
               )
            }
        }
    }());

    return NewWindowForm;
}(exp.core, exp.util));

exp.windowForm = windowForm;    
})(exp);
