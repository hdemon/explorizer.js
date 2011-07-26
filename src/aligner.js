(function(exp){

var aligner;
aligner = (function(core, util){
    function getZindex ( $ow ) {
        return $ow
            .css( "z-index" );
    }

    function getMaxZindex ( formObj ) {
        var zIndexArray = [],
            all$ow = core.get$ow( "all" );
        
        for ( var i = 0, l = all$ow.length; i < l; i++) {
            zIndexArray.push( getZindex( all$ow.eq( i ) ) );
        }
        
        return {
            "max" : Math.max.apply( null, zIndexArray ),
            "min" : Math.min.apply( null, zIndexArray )
        }
    }

    function setZindex ( $ow, val, method ) {
        var current = $ow.css("z-index")-0;

        switch ( method ) {
            case "assign":
                $ow.css({ "z-index":  current + val    });
                break;
            case "set":
                $ow.css({ "z-index":  val });
                break;
        };
    }

    function callback ( wrapperObj, handle ) {
        if ( typeof wrapperObj[handle] !== "undefined" ) return wrapperObj[handle]();
    }
            
    return {
        setFocus : function ( formId, callback ) {                
            var i, l, $ow_rest, prevZindex, zIndex = {};
            
            var focused    = this.focusedFormId,
                clicked    = formId,
                $ow        = core.form[formId].get$ow();

            // if selected window's id differs with previous active window...
            if ( clicked !== focused ) {
                zIndex         = getMaxZindex.bind(this)( core.form );
                prevZindex    = getZindex.bind(this)( $ow );

                setZindex.bind(this)( $ow, zIndex.max + 1, "set" );

                for ( var restId in core.form ) {
                    $ow_rest = core.form[restId-0].get$ow();
                    
                    if ( getZindex.bind(this)( $ow_rest ) > prevZindex ) {
                        setZindex.bind(this)( $ow_rest, -1, "assign" );
                    }
                }

                this.focusedFormId = clicked;
         //       if ( typeof callback.changed !== "undefined" ) callback.changed();

            } else {
                this.focusedFormId = clicked;
         //       if ( typeof callback.notChanged !== "undefined" ) callback.notChanged();
            }
            
            return    this;
        }
    }
}(exp.core, exp.eutil, exp.core.module));

exp.aligner = aligner;
})(exp);
