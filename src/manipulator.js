(function( hExplorizer ) {

hExplorizer.manipulator = (function () {
	function NewManipulator ( root ) {
		this.root	= root;
	}

	NewManipulator.prototype = (function () {
		function dragElement( event ) {
			setCurStatus.bind(this)( event.ctrlKey );
			displayCursor.bind(this)( event.pageX, event.pageY );
		}

		function setCurStatus( ctrlKey ) {
			var newClass =
				ctrlKey 
					? ( this.root.lb.cursor_copy )
					: ( this.root.lb.cursor_move );

			if ( this.$cursor != null ){
				this.$cursor
					.removeClass( this.root.lb.cursor_copy )
					.removeClass( this.root.lb.cursor_move )
					.addClass( newClass );
			}

			this.mode = ( ctrlKey ) ? "copy" : "move"; 
		}

		function displayCursor( x, y ) {
			this.$cursor
				.css({
					"top"	: y,
					"left"	: x
				})
				.children()
				.text( this.elemNum );
		}

		function createCursor () {
			$("body")
				.append(
				    "<div " +
						"id=\""+
							this.root.attrPrefix + this.root.lb.cursor +
						"\" " +
						"class=\""+
							this.root.lb.cursor_move +
						"\"" +
						hExplorizer.util.preventSelect +
				    ">" +
						"<div " +
							"id=\""+
								this.root.attrPrefix + this.root.lb.cursor_text +
							"\"" +
							hExplorizer.util.preventSelect +
					    ">" +
						"</div>" +
					"</div>"
				);	
				
			return $( "#" + this.root.attrPrefix + this.root.lb.cursor );
		}

		function copyElements ( $elem, formId ) {
			this.root.get$ct( formId )
				.append( $elem.clone() );
		}

		function moveElements ( $elem, formId ) {
			copyElements.bind(this)( $elem, formId );
			$elem.remove();
		}

		return {
			manipulate : function ( event, formId ) {
				this.targetFormId = null;
				this.baseFormId = formId;
				this.elemNum =
					this.root.get$elem()
						.filter( "." + this.root.lb.selected +",." + this.root.lb.preselect )
						.size();

				var	callback = function () {
					this.$cursor= createCursor.bind(this)();
					$(window)
						.bind( "mousemove", dragElement.bind(this)	);
					this.active = true;
				}.bind(this);

				this.root.setTrigDelayer( event.pageX, event.pageY, 18, callback );
			},

			set_tFormId : function ( targetFormId ) {
				this.targetFormId = targetFormId;
			},

			mouseUp : function ( targetFormId, callback ) {
				var m 		= this.root.module,
					$elem	= $( "." + this.root.lb.selected );

				if ( this.active ) {
					if ( this.mode === "copy" ) {
						copyElements.bind(this)( $elem, targetFormId );
					} else if ( this.mode === "move" ) {
						moveElements.bind(this)( $elem, targetFormId );
					}
					callback( this.baseFormId, targetFormId );
				}

				this.targetFormId = null;
				this.active = false;

				this.removeCursor();
		//		removeEvent.bind(this)();
			},
			
			setCurStatus : function ( ctrlKey ) {
				setCurStatus.bind(this)( ctrlKey );
			},
			
			removeCursor : function () {
				if ( typeof this.$cursor !== "undefined" ) this.$cursor.remove();
			}
		};
	}());

	return NewManipulator;
}());
})( hExplorizer );
