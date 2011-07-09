(function( hExplorizer ) {

hExplorizer.aligner = ( function () {
	function NewAligner( root ) {
		this.root = root;
	}
	
	NewAligner.prototype = ( function () {		
		function getZindex ( $ow ) {
			return $ow
				.css( "z-index" );
		}

		function getMaxZindex ( formObj ) {
        	var	zIndexArray	= [],
	        	all$ow		= r.get$ow( "all" );
	        
			for ( var i = 0, l = all$ow.length; i < l; i++) {
            	zIndexArray.push( getZindex( all$ow.eq( i ) ) );
            }
            
            return {
            	"max" : Math.max.apply( null, zIndexArray ),
            	"min" : Math.min.apply( null, zIndexArray )
			}
		}

		function setZindex ( $ow, val, method ) {
			var	current	= $ow.css("z-index")-0;

			switch ( method ) {
				case "assign":
					$ow.css({ "z-index":  current + val	});
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
				_this = this; r = this.root; 
				
	            var i, l, $ow_rest, prevZindex, zIndex = {};
	            
				var focused	= this.focusedFormId,
					clicked	= formId,
					$ow		= r.get$ow( formId );

				// if selected window's id differs with previous active window...
	            if ( clicked !== focused ) {
					zIndex 		= getMaxZindex( r.form );
					prevZindex	= getZindex( $ow );

					setZindex( $ow, zIndex.max + 1, "set" );

					for ( var restId in r.form ) {
						$ow_rest = r.get$ow( restId-0 );
						
						if ( getZindex( $ow_rest ) > prevZindex ) {
							setZindex( $ow_rest, -1, "assign" );
						}
					}

					this.focusedFormId = clicked;
		            if ( typeof callback.changed !== "undefined" ) callback.changed();
	  
	            } else {
					this.focusedFormId = clicked;
		            if ( typeof callback.notChanged !== "undefined" ) callback.notChanged();
	            }
	            
	            return	this;
			}
		};
	}());

	return NewAligner;
}());

})( hExplorizer );
