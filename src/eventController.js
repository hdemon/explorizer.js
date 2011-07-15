(function( hExplorizer ) {

hExplorizer.eventController = (function () {
	function NewEventController( root ) {
		this.r	= root;
	}

	NewEventController.prototype = (function () {
		var handle,
			$window = $(window);

		function setEvent (
			$allElem,
			$allContent,
			$allTitleBar,
			$allRemoveBtn,
			$allmaximizeBtn,
			$allminimizeBtn
		) {
			var _this = this;
			this.handle = this.handle || {
				mouseDown_elem : function ( event ) {
					var $this	= $( this ),
						info	=  _this.r.parser( $this ),
						formId	= info.formId,
						part	= info.part,
						elemId	= info.elemId;

					event.stopPropagation();
					mouseDown_elem.bind(_this)( event, formId, elemId );
				},

				mouseDown_content : function ( event ) {
					var $this	= $( this ),
						info	=  _this.r.parser( $this ),
						formId	= info.formId,
						part	= info.part,
						elemId	= info.elemId;

					event.stopPropagation();
					mouseDown_content.bind(_this)( event, formId, part, elemId );
				},

				mouseDown_titleBar : function ( event ) {
					var	$this	= $( this ),
						info	=  _this.r.parser( $this ),
						formId	= info.formId,
						$ow		=  _this.r.get$ow( formId );

					event.stopPropagation();
					mouseDown_titleBar.bind(_this)( event, formId, $ow );
				},

				mouseUp	: function ( event ) {
					event.stopPropagation();

					mouseUp_1.bind(_this)( event );

					if (  _this.m.manipulator.active ) {
						// wait to acquire targetFormId ------
						var timer = setInterval(function () { var tFormId =  _this.m.manipulator.targetFormId; 
						if ( tFormId !== null ) { clearInterval(timer); 
						// -----------------------------------
						mouseUp_2.bind(_this)( tFormId );
						mouseUp_3.bind(_this)( event );
						 _this.initialize();
						// logic ends-------------------------
						}}, 1);
						// -----------------------------------
					}
					
					mouseUp_3.bind(_this)( event );
				},

				mouseUp_content	: function ( event ) {
					 _this.m.manipulator.set_tFormId(  _this.r.parser( $(this) ).formId );
				},

				keyDown : function ( event ) {
					_this.m.manipulator.setCurStatus( event.ctrlKey );
				},

				keyUp : function ( event ) {
					_this.m.manipulator.setCurStatus( event.ctrlKey );
				}
			};
			
			$allElem
				.unbind	( "mousedown" )
				.bind	( "mousedown",	this.handle.mouseDown_elem );

			$allContent
				.unbind	( "mousedown" )
				.bind	( "mousedown",	this.handle.mouseDown_content )
				.unbind	( "mouseup" )
				.bind	( "mouseup",	this.handle.mouseUp_content );

			$allTitleBar
				.unbind	( "mousedown" )
				.bind	( "mousedown",	this.handle.mouseDown_titleBar	);

			$window
				.unbind	( "mouseup" )
				.bind	( "mouseup",	this.handle.mouseUp );
	
			document.removeEventListener( "keydown",this.handle.keyDown, false );
			document.addEventListener	( "keydown",this.handle.keyDown, false );
			document.removeEventListener( "keyup",	this.handle.keyDown, false );
			document.addEventListener	( "keyup",	this.handle.keyDown, false );
		}

		// method
		function alignment ( formId ){
			this.m.aligner
				.setFocus( formId, {
					"changed" : function () { this.r.unselectAllElem() }.bind(this)
				});
		}

		function mouseDown_elem ( event, formId, elemId ) {
			alignment.bind(this)( formId );
	
			var manipulate = function(){ this.m.manipulator.manipulate( event, formId ); };
			
			this.m.selector
				.onElem( event.ctrlKey, event.shiftKey, formId, elemId, {
					downOnSelected	: manipulate.bind(this),
					selectWithShift	: manipulate.bind(this),
					preselectByCtrl	: manipulate.bind(this),
					preselect	 	: manipulate.bind(this)
				});
		}

		function mouseDown_content ( event, formId, part, elemId ) {
			alignment.bind(this)( formId );

			this.m.selector
				.onBack( event.pageX, event.pageY, formId );
		}

		function mouseDown_titleBar ( event, formId, $ow ) {
			alignment.bind(this)( formId );

			this.m.locator
				.mouseDown( event.pageX, event.pageY, $ow );
		}

		function mouseUp_1 ( event ) {
	       	$window
	       		.unbind( "mousemove" );
			this.m.selector
				.mouseUp();

			this.r.selectPropery();
		}

		// following event is only called for manipulation, 
		// and is called after "mouseUp_1" function certainly.
		function mouseUp_2 ( targetFormId, nextProcess ) {
			this.m.manipulator
				.mouseUp( targetFormId, function ( baseFormId, targetFormId ) {
					this.r.form[ baseFormId ]
						.numbering();
					this.r.form[ targetFormId ]
						.numbering();
					this.r.unselectAllElem();
				}.bind(this));
		}
		
		function mouseUp_3 () {
			this.m.manipulator.removeCursor();
			this.callback();
		}

		return {
			set : function(args){
				this.callback = args. callback || function(){};
				return this;
			},
				
			initialize : function () {	
				this.m = this.r.module;
				setEvent.bind(this)(
					this.r.get$elem( "all" ),
					this.r.get$ct( "all" ),
					this.r.module.titleBar.get$titleBar( "all" ),
					this.r.module.titleBar.get$titleBar( "all" ),
					this.r.module.titleBar.get$titleBar( "all" )
				);
			}
	    }
	}());

	return	NewEventController;
}());

})( hExplorizer );