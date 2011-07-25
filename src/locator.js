(function(exp){

var locator;
locator = (function(core, util){
    var ehandle;
    
    function calc() {
    }
    
    function mouseMove ($ow, owWidth, owHeight, wrapWidth, wrapHeight, tBarHeight, x, y) {
        var _x, _y;
        
        // calculate and limit range.
        if (x + owWidth > wrapWidth)
            _x = wrapWidth - owWidth;
        else if (x < 0)
            _x = 0;
        else
            _x = x;   
        
        if (y + owHeight > wrapHeight)
            _y = wrapHeight - owHeight;
        else if (y - tBarHeight < 0)
            _y = tBarHeight;
        else
            _y = y;    
        
        $ow
            .css({
                "top"  : _y,
                "left" : _x });
    }  
                        
    return {
        mouseDown : function (x, y, $ow, $titleBar) {
            var pos         = $ow.position(),
                prevLeft    = pos.left,
                prevTop     = pos.top,
                divX        = x - prevLeft, // divasion from handle central axis. 
                divY        = y - prevTop,    // divasion from handle central axis. 
                wrapWidth   = core.get$wrapper().width(),
                wrapHeight  = core.get$wrapper().height(),
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
                    event.pageX - divX, event.pageY - divY );
            };
            
            $(window)
                .bind( "mousemove", ehandle );
        }
    }
}(exp.core, exp.eutil));

exp.locator = locator;
})(exp);
