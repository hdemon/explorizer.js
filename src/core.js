(function(exp) {

var core;
core = (function() {
    function initmod () {
        this.mod = {
            eventController : exp .eventController,
            aligner     : exp .aligner,
            selector    : exp .selector,
            manipulator : exp .manipulator,
            locator     : exp .locator
        };
        this.id    = id;
        this.form  = [];
    }

    return {
        pref : "hdex_",
        lb : { // label
            form        : "form",
            elem        : "elem",
            content     : "ct",
            innrWrap    : "iw",
            outrWrap    : "ow",
            cursor      : "cursor",
            cursor_copy : "cursor_copy",
            cursor_move : "cursor_move",
            cursor_text : "cursor_text",    
            slctBoxId   : "slctBox",
            unSelect    : "ex_unselect",
            selecting   : "ex_selecting",
            selected    : "ex_selected",
            preselect   : "ex_preselect",
            titleBar    : "titleBar",
            removeBtn   : "removeBtn",
            titleSpace  : "titleSpc",
            resize      : "resize"    
        },

        set : function(args) {
            // required --------
            this.$wrapper      = args .$wrapper;

            // optional --------
            // scroll                                 
            this.autoScroll    = args .autoScroll  ||
               (hdemon.util.browser.ie || hdemon.util.browser.opera);
            this.scrollWeight  = args .scrollWeight|| 0.8;

            // individual parameter
            // style
            this.width         = (typeof args .width      === "undefined")  ? 300   : args .width;    // initial value
            this.height        = (typeof args .height     === "undefined")  ? 400   : args .height;    // do.
            this.minWidth      = (typeof args .minWidth   === "undefined")  ? 300   : args .minWidth;
            this.minHeight     = (typeof args .minHeight  === "undefined")  ? 400   : args .minHeight;
            this.maxWidth      = (typeof args .maxWidth   === "undefined")  ? null  : args .maxWidth;
            this.maxHeight     = (typeof args .maxHeight  === "undefined")  ? null  : args .maxHeight;
            this.tBarHeight    = (typeof args .tBarHeight === "undefined")  ? 30    : args .tBarHeight;

            this.removeBtn     = (typeof args .removeBtn === "undefined")   ? true  : false;
            this.statusBar     = (typeof args .removeBtn === "undefined")   ? true  : false;
            
            // callback    
            this.callback    = {
                manipulated     : args .manipulated     || function () {},
                selected        : args .selected        || function () {},
                formRemoved     : args .formRemoved     || function () {},
                formAdded       : args .formAdded       || function () {},
                onElement       : args .formAdded       || function () {}          
            };

            return this;
        },

        add : function () {
            // initialize mods
            if (typeof this.mod === "undefined") initmod.bind(this)();

            // create form object. This contains $ objects mainly.

            // create form root. And the content element object relocate
            // under "form.rootObj". $iw(inner wrapper) and $ow(outer wrapper)
            // locate there too.
            var form    = new exp.windowForm(this),
                id      = form.getFormId();
            this.form[ id ] = form;
            form = null;
            var _form = this.form[ id ];

            _form .add();

            _form.$ct
                .data({
                    "formId" : id
                });

            _form.$ow
                .css({ "z-index" : id });

            // reset and add event listener for the new windowForm.
            this.mod.eventController
                .set({
                    "callback" : this.initialize.bind(this)
                })
                    .initialize();
                                                 
                this.id++;
                return _form.$ct;
            },

            initialize : function(id) {
            this.mod.eventController
                .initialize();

            // 変更があったformのみにinitializeを絞るべき？
            for(var i = 0, l = this.form.length; i < l; i++) {
                var form    = this.form[ i ];
                form .initialize();
            }
        },
            
        get$wrapper : function() { return this.$wrapper; },
        
        get$ow : function(formId) {
            if (arguments[0] === "all" || arguments.length === 0)
                return $( "." + this.pref + this.lb.outrWrap );
            else
                return this.form[formId].get$ow();
        },

        get$iw : function(formId) {
            if (arguments[0] === "all" || arguments.length === 0)
                return $( "." + this.pref + this.lb.innrWrap );
            else
                return this.form[formId].get$iw();
        },
            
        get$ct : function(formId) {
            if (arguments[0] === "all" || arguments.length === 0)
                return $( "." + this.pref + this.lb.content );
            else
                return this.form[formId].get$ct();
        },
       
        get$elem : function(formId, elemId) {
            if (arguments.length === 0 || arguments[0] === "all")
                return $( "." + this.pref + this.lb.elem );
            else if (arguments.length === 1)
                return this.form[formId].get$elem();
            else if (arguments[0] === "selected")
                return $( "." + this.lb.selected + ((arguments[1]) ? ", ." + this.lb.preselect : "") )
            else
                return this.form[formId].get$elem(elemId);
        },

        get$titleBar : function(formId) {
            if (arguments[0] === "all" || arguments.length === 0) {
                return $( "." + this.pref + "titleBar" );
            } else {
                return $( "#" + this.pref + formId + "_" + "titleBar" );
            }
        },
                
        selectElem : function(formId, elemId) { this.form[formId].selectElem(elemId); },
        preselectElem : function(formId, elemId) { this.form[formId].preselectElem(elemId); },
        unselectElem : function(formId, elemId) { this.form[formId].unselectElem(elemId); },

        unselectAllElem : function () {
            $( "." + this.pref + this.lb.elem )
                .removeClass( this.lb.selected  )
                .removeClass( this.lb.preselect )
                .addClass  (this.lb.unSelect  );
        },

        selectPropery : function(formId, elemId) {
            $( "." + this.lb.preselect )
                .removeClass( this.lb.preselect )
                .addClass  (this.lb.selected  );
        },

        isSelect : function(formId, elemId, includePreslct) {
            includePre = true;
            return (
                $( "#" + this.pref + formId + "_" + this.lb.elem + "_" + elemId )
                    .is( "."+this.lb.selected + ((includePreslct) ? ", ."+this.lb.preselect : "") )
            )
        },

        cb : function(funcObj, handleName, argsArray) {
            if(typeof funcObj[ handleName ] !== "undefined") {
                return funcObj[ handleName ].apply(this, argsArray);
            }
        },

    }

}());

exp.core = core;
})(exp);
