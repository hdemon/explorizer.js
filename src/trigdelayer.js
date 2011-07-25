(function(explorizer) {

var util;
util = (function() {
    function delayTrigger ( event, startX, startY, threshold, removeTrigDelayer, callback ) {
        // calculate torelance range.
        var outOfRange = (
            Math.sqrt(
                Math.pow( ( event.pageX - startX ), 2 ) +
                Math.pow( ( event.pageY - startY ), 2 ) 
            ) > threshold
        );

        if ( outOfRange ) {
            removeTrigDelayer();
            callback();
        }
    }

    return {
        setTrigDelayer : function ( startX, startY, torelance, callback ) {
            this.mouseMove_delayer = function ( event ) {
                delayTrigger(
                    event,
                    startX, startY,
                    torelance,
                    this.removeTrigDelayer,
                    callback
                );
            };
            $(window).bind( "mousemove", this.mouseMove_delayer.bind(this) );
        },

        removeTrigDelayer : function ( event ) {
            $(window).unbind( "mousemove" );
        }
    }
}());

explorizer.util = util;
})(explorizer);
