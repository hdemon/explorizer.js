(function(exp){

var locator;
locator = (function(core, util){
    var ehandle;

    function mouseMove ($ow, owWidth, owHeight, wrapWidth, wrapHeight, tBarHeight, relX, relY) {
        var x, y;
        
        // calculate and limit range.
        if (relX + owWidth > wrapWidth)
            x = wrapWidth - owWidth;
        else if (relX < 0)
            x = 0;
        else
            x = relX;   
        
        if (relY + owHeight > wrapHeight)
            y = wrapHeight - owHeight;
        else if (relY - tBarHeight < 0)
            y = tBarHeight;
        else
            y = relY;   
        
        $ow
            .css({
                "top"  : y,
                "left" : x });
    }  
                        
    return {
        mouseDown : function (absX, absY, $ow, $titleBar) {
            var op          = $ow.position(),
                prevAbsLeft = op.left,
                prevAbsTop  = op.top,
                divX        = absX - prevAbsLeft, // divasion from handle central axis. 
                divY        = absY - prevAbsTop,  // divasion from handle central axis.
                
                $w          = core.get$wrapper(),
                wp          = $w.position(),
                wrapWidth   = $w.innerWidth(),
                wrapHeight  = $w.innerHeight(),
                owWidth     = $ow.width(),
                owHeight    = $ow.height(),
                tBarHeight  = $titleBar.height();  
                
            ehandle = function(event) {
                //event.stopPropagation();
                mouseMove(
                    $ow,                    
                    owWidth, owHeight,
                    wrapWidth, wrapHeight,
                    tBarHeight,
                    event.pageX - divX + wp.left, event.pageY - divY + wp.top );
            };
            
            $(window)
                .bind( "mousemove", ehandle );
        }
    }
}(exp.core, exp.eutil));

exp.locator = locator;
})(exp);
