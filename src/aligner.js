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
	        	all$ow		= this.root.get$ow( "all" );
	        
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
	            var i, l, $ow_rest, prevZindex, zIndex = {};
	            
				var focused	= this.focusedFormId,
					clicked	= formId,
					$ow		= this.root.get$ow( formId );

				// if selected window's id differs with previous active window...
	            if ( clicked !== focused ) {
					zIndex 		= getMaxZindex.bind(this)( this.root.form );
					prevZindex	= getZindex.bind(this)( $ow );

					setZindex.bind(this)( $ow, zIndex.max + 1, "set" );

					for ( var restId in this.root.form ) {
						$ow_rest = this.root.get$ow( restId-0 );
						
						if ( getZindex.bind(this)( $ow_rest ) > prevZindex ) {
							setZindex.bind(this)( $ow_rest, -1, "assign" );
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
