(function(exp){

var manipulator;
manipulator = (function(core, util){
    var self; // <- this
    
    function dragElement( event ) {
        setCurStatus( event.ctrlKey );
        displayCursor( event.pageX, event.pageY );
    }

    function setCurStatus( ctrlKey ) {
        var newClass =
            ctrlKey 
                ? ( c.lb.cursor_copy )
                : ( c.lb.cursor_move );

        if ( self.$cursor != null ){
            self.$cursor
                .removeClass( c.lb.cursor_copy )
                .removeClass( c.lb.cursor_move )
                .addClass( newClass );
        }

        self.mode = ( ctrlKey ) ? "copy" : "move"; 
    }

    function displayCursor( x, y ) {
        self.$cursor
            .css({
                "top"    : y,
                "left"    : x
            })
            .children()
            .text( self.elemNum );
    }

    function createCursor () {
        $("body")
            .append(
                "<div " +
                    "id=\""+
                        c.pref + c.lb.cursor +
                    "\" " +
                    "class=\""+
                        c.lb.cursor_move +
                    "\"" +
                    hExplorizer.util.preventSelect +
                ">" +
                    "<div " +
                        "id=\""+
                            c.pref + c.lb.cursor_text +
                        "\"" +
                        hExplorizer.util.preventSelect +
                    ">" +
                    "</div>" +
                "</div>"
            );    
            
        return $( "#" + c.pref + c.lb.cursor );
    }

    function copyElements ( $elem, formId ) {
        c.get$ct( formId )
            .append( $elem.clone() );
    }

    function moveElements ( $elem, formId ) {
        copyElements( $elem, formId );
        $elem.remove();
    }

    return {
        manipulate : function ( event, formId ) {
            t = this;
            this.targetFormId = null;
            this.baseFormId = formId;
            this.elemNum =
                c.get$elem()
                    .filter( "." + c.lb.selected +",." + c.lb.preselect )
                    .size();

            var    callback = function () {
                this.$cursor= createCursor();
                $(window)
                    .bind( "mousemove", dragElement    );
                this.active = true;
            };

            util.setTrigDelayer( event.pageX, event.pageY, 18, callback );
        },

        set_tFormId : function ( targetFormId ) {
            this.targetFormId = targetFormId;
        },

        mouseUp : function ( targetFormId, callback ) {
            var m         = c.module,
                $elem    = $( "." + c.lb.selected );

            if ( this.active ) {
                if ( this.mode === "copy" ) copyElements( $elem, targetFormId );
                else if ( this.mode === "move" ) moveElements( $elem, targetFormId );
                callback( this.baseFormId, targetFormId );
            }

            this.targetFormId = null;
            this.active = false;

            this.removeCursor();
    //        removeEvent();
        },
        
        setCurStatus : function ( ctrlKey ) {
            setCurStatus( ctrlKey );
        },
        
        removeCursor : function () {
            if ( typeof this.$cursor !== "undefined" ) this.$cursor.remove();
        }
    }    
}(exp.core, exp.eutil, exp.core.module));

exp.manipulator = manipulator;
})(exp);
