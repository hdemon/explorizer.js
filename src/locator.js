(function(exp){

var locator;
locator = (function(core, util){
    var ehandle;
    function mouseMove ( $ow, x, y, divX, divY ) {
        $ow
            .css({
                "top"  : y - divY,
                "left" : x - divX });                    
    }  
                        
    return {
        mouseDown : function ( x, y, $ow ) {
            var pos         = $ow.position();
            var prevLeft    = pos.left,
                prevTop     = pos.top,
                divX        = x - prevLeft, // divasion from handle central axis. 
                divY        = y - prevTop;    // divasion from handle central axis. 

            ehandle    = function ( event ) {
                event.stopPropagation();
                mouseMove( $ow, event.pageX, event.pageY, divX, divY );
            };
            
            $(window)
                .bind( "mousemove", ehandle );
        }
    }
}(exp.core, exp.eutil, exp.core.module));

exp.locator = locator;
})(exp);
