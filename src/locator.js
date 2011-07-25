(function(exp){

var locator;
locator = (function(core, util){
    var ehandle;
    
    function calc() {
    }
    
    function mouseMove ($ow, owWidth, owHeight, wrapWidth, wrapHeight, x, y, divX, divY) {
        var _x, _y;
        
        // calculate and limit range.
        if (x - divX + owWidth > wrapWidth)
            _x = wrapWidth - owWidth;
        else if (x - divX < 0)
            _x = 0;
        else
            _x = x - divX;   
        
        if (y - divY + owHeight > wrapHeight)
            _y = wrapHeight - owHeight;
        else if (y - divY < 0)
            _y = 0;
        else
            _y = y - divY;    
        
        $ow
            .css({
                "top"  : _y,
                "left" : _x });    
         /*                   .css({
                "top"  : y - divY,
                "left" : x - divX });                  */  
    }  
                        
    return {
        mouseDown : function (x, y, $wrapper, $ow) {
            var pos         = $ow.position(),
                prevLeft    = pos.left,
                prevTop     = pos.top,
                divX        = x - prevLeft, // divasion from handle central axis. 
                divY        = y - prevTop,    // divasion from handle central axis. 
                wrapWidth   = $wrapper.width(),
                wrapHeight  = $wrapper.height(),
                owWidth     = $ow.width(),
                owHeight    = $ow.height();                    

            ehandle    = function ( event ) {
                //event.stopPropagation();
                mouseMove(
                    $ow,                    
                    owWidth, owHeight,
                    wrapWidth, wrapHeight,
                    event.pageX, event.pageY,
                    divX, divY );
            };
            
            $(window)
                .bind( "mousemove", ehandle );
        }
    }
}(exp.core, exp.eutil));

exp.locator = locator;
})(exp);
