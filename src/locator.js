(function( hExplorizer ) {

hExplorizer.locator = (function () {
	function NewLocator( root ) {
		this.root	= root;
	}

	NewLocator.prototype = (function () {
		function mouseMove ( $ow, x, y, divX, divY ) {
        	$ow
        		.css({
        			"top"	: y	- divY,
        			"left"	: x	- divX   	});        			
        }  
	        				
		return {
			mouseDown : function ( x, y, $ow ) {
				var	pos			= $ow.position();
				var	prevLeft	= pos.left,
					prevTop		= pos.top,
					divX		= x - prevLeft, // divasion from handle central axis. 
					divY		= y - prevTop;	// divasion from handle central axis. 

				this.event	= function ( event ) {
				 	event.stopPropagation();
					mouseMove( $ow, event.pageX, event.pageY, divX, divY );
				};
				
				$(window)
					.bind( "mousemove", this.event );
	        }
	    }
	}());
	
	return	NewLocator;
}());

})( hExplorizer );
