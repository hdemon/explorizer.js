(function(exp){

var eventController;
eventController = (function(core, util){
    var handle,
        $window = $(window),
        callback,
        mod;
    
    // method
    function alignment ( formId ){
        mod.aligner
            .setFocus( formId, {
                "changed" : function () { core.unselectAllElem() }
            });
    }

    function mouseDown_elem ( event, formId, elemId ) {
        alignment( formId );

        var manipulate = function(){ mod.manipulator.manipulate( event, formId ); };
        
        mod.selector
            .onElem( event.ctrlKey, event.shiftKey, formId, elemId, {
                downOnSelected    : manipulate,
                selectWithShift    : manipulate,
                preselectByCtrl    : manipulate,
                preselect         : manipulate
            });
    }

    function mouseDown_content ( event, formId, part, elemId ) {
        alignment( formId );

        mod.selector
            .onBack( event.pageX, event.pageY, formId );
    }

    function mouseDown_titleBar ( event, formId, $ow ) {
        alignment( formId );

        mod.locator
            .mouseDown( event.pageX, event.pageY, $ow );
    }

    function mouseUp_1 ( event ) {
        $window
           .unbind( "mousemove" );
        mod.selector
            .mouseUp();

        core.selectPropery();
    }

    // following event is only called for manipulation, 
    // and is called after "mouseUp_1" function certainly.
    function mouseUp_2 ( targetFormId, nextProcess ) {
        mod.manipulator
            .mouseUp( targetFormId, function ( baseFormId, targetFormId ) {
                core.form[ baseFormId ]
                    .numbering();
                core.form[ targetFormId ]
                    .numbering();
                core.unselectAllElem();
            });
    }
    
    function mouseUp_3 () {
        mod.manipulator.removeCursor();
        callback();
    }

    return {
        set : function(args){
            callback = args. callback || function(){};
            return this;
        },
            
        initialize : function () {
            var self = this;
            mod = core.mod;
            handle = handle || {
                mouseDown_elem : function ( event ) {
                    var p  = util.parser($(this));

                    event.stopPropagation();
                    mouseDown_elem( event, p.formId, p.elemId );
                },

                mouseDown_content : function ( event ) {
                    var p  = util.parser($(this));

                    event.stopPropagation();
                    mouseDown_content( event, p.formId, p.part, p.elemId );
                },

                mouseDown_titleBar : function ( event ) {
                    var p  = util.parser($(this)),
                        $ow= core.form[p.formId].get$ow();

                    event.stopPropagation();
                    mouseDown_titleBar( event, p.formId, $ow );
                },

                mouseUp    : function ( event ) {
                    event.stopPropagation();

                    mouseUp_1( event );

                    if ( mod.manipulator.active ) {
                        // wait to acquire targetFormId ------
                        var timer = setInterval(function () { var tFormId = mod.manipulator.targetFormId; 
                        if ( tFormId !== null ) { clearInterval(timer); 
                        // -----------------------------------
                        mouseUp_2( tFormId );
                        mouseUp_3( event );
                        self.initialize();
                        // logic ends-------------------------
                        }}, 1);
                        // -----------------------------------
                    }
                    
                    mouseUp_3( event );
                },

                mouseUp_content : function ( event ) {
                     mod.manipulator.set_tFormId( util.parser( $(this) ).formId );
                },

                keyDown : function ( event ) {
                    mod.manipulator.setCurStatus( event.ctrlKey );
                },

                keyUp : function ( event ) {
                    mod.manipulator.setCurStatus( event.ctrlKey );
                }
            };
            
            core.get$elem("all")
                .unbind  ( "mousedown" )
                .bind    ( "mousedown", handle.mouseDown_elem );

            core.get$ct("all")
                .unbind  ( "mousedown" )
                .bind    ( "mousedown", handle.mouseDown_content )
                
                .unbind  ( "mouseup" )
                .bind    ( "mouseup",   handle.mouseUp_content );

            core.get$titleBar("all")
                .unbind  ( "mousedown" )
                .bind    ( "mousedown", handle.mouseDown_titleBar );

            $window
                .unbind  ( "mouseup" )
                .bind    ( "mouseup",   handle.mouseUp );

            document.removeEventListener( "keydown",    handle.keyDown, false );
            document.addEventListener   ( "keydown",    handle.keyDown, false );
            document.removeEventListener( "keyup",      handle.keyDown, false );
            document.addEventListener   ( "keyup",      handle.keyDown, false );
        }
    }
}(exp.core, exp.util));

exp.eventController = eventController;
})(exp);
