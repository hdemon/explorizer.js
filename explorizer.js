"use strict";
"use warnings";

(function(window) {	
var hExplorizer = {};
﻿
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

(function( hExplorizer ) {

hExplorizer.util = hExplorizer.util || function () {
	var	ua	= navigator.userAgent;
	return {
		browser	: {
			"chrome"	: (ua.indexOf( "Chrome" ) 	!== -1),
			"firefox"	: (ua.indexOf( "Firefox" )	!== -1),
			"ie"		: (ua.indexOf( "MSIE" )		!== -1),
			"opera"		: (ua.indexOf( "Opera" )	!== -1),
			"safari"	: (ua.indexOf( "safari" )	!== -1)
		},
		preventSelect : function () {
			return (
				hExplorizer.util.browser.ie || hExplorizer.util.browser.firefox
					? "onmousemove=\"window.getSelection().removeAllRanges();\"" 
					: ""
			)
		}
	}
}();

// for non-ECMAScript 5th-compliant browser.
// bind method
if ( typeof Function.prototype.bind === "undefined" ) {
	Function.prototype.bind = function ( thisArg ) {
		var fn = this,
			slice	= Array.prototype.slice,
			args	= slice.call( arguments, 1 );

		return function () {
			return fn.apply( thisArg, args.concat( slice.call(arguments) ) );
		};
	};
}

})( hExplorizer );

﻿(function( hExplorizer ) {

hExplorizer.windowForm = (function () {
	var idCounter	= 0;

	function NewWindowForm( root ) {
		this.root		= root;
		this.formId		= idCounter;

		this.attrPrefix	= this.root.attrPrefix;
		this.width		= this.root.width;
		this.height		= this.root.height;
		this.minWidth	= this.root.minWidth;
		this.minHeight	= this.root.minHeight; 
		this.maxWidth	= this.root.maxWidth; 
		this.maxHeight	= this.root.maxHeight; 
		this.tBarHeight	= this.root.tBarHeight

		this.module	= {
			resizer		: new hExplorizer.resizer(this)	|| null,
	//		titleBar	: new hExplorizer.titleBar(this)	|| null
		};

		idCounter += 1;
	}

	NewWindowForm.prototype = (function () {
		var	form 			= "form",
			elem 			= "elem",
			content 		= "ct",
			innrWrap 		= "iw",
			outrWrap 		= "ow";

		function createWrapper () {
			this.$ow	= this.root.createDiv( this.root.$wrapper,	outrWrap,	this.formId );
			this.$iw	= this.root.createDiv( this.$ow, 			innrWrap,	this.formId );
			this.$ct	= this.root.createDiv( this.$iw, 			content,	this.formId );
		}

		function adjustSize () {
			var	x	= this.$ct.offset().left,
				y	= this.$ct.offset().top,
				h	= this.height	|| this.$ct.outerHeight(),
				w	= this.width	|| this.$ct.outerWidth();
		 
		 	// The CSS height of content (lowermost layer) change "auto".   
		 	this.$ct.css({
		 		"top"		: 0,
		 		"left"		: 0,
		 		"width"		: "",
		 		"height"	: ""
		 	});

			// Set the same location and size as the content element before altering.
			// The outer wrapper works indicator for location and size.
			this.$ow.css({
				"top"		: y,
				"left"		: x,
				"height"	: h,
				"width"		: w
			});
			// The inner wrapper confire display range. this width and height are "100%" for the outer wrapper.
		}

		function resetCtSize () {
			this.$ct
				.css({ "height": "" });
		}

		function fitCtSize () {
			// if the content's height is less than that of the inner wrapper, selection range is confired by
			// the content's size (because selection events work in the content object). And so the content's
			// size fit in the inner wrapper.
			if ( this.$ct.height() < this.$iw.height() ) {
				this.$ct
					.css({ "height": this.$iw.height() - 8	});
			}
		}

		return {
 			//public
			add : function () {
				createWrapper	.bind(this)();
				adjustSize		.bind(this)();

				this.$ct
					.css({ "padding" : 2 }); 	// to prevent display vertical-scrollbar over again

				this.module.resizer
					.set({
						"clsName"		: this.attrPrefix + this.root.lb.resize,
						"id"			: this.formId,
						"topGap"		: -25,		// for title bar's height
						"bottomGap"		: 5,
						"leftGap"		: 5,
						"zIndex"		: 3,
						"angleHandleSize": 25,
						"end"			: fitCtSize.bind(this),
						"start		"	: resetCtSize.bind(this),
						"wrapper"		: $("#wrapper")	})
					.add( this.$ow );

				var	$bar =
					this.root.module.titleBar
						.add( this.formId );

				return 	this.$ct;
			},

			initialize : function () {
				resetCtSize.bind(this)();
				fitCtSize.bind(this)();  

				this.$elem	= this.$ct.children( "." + this.root.attrPrefix + this.root.lb.elem  );
				this.numbering();
			},

			numbering : function () {
				for ( var i = 0, $elem = this.root.get$elem( this.formId ), l = $elem.length; i < l; i++ ) {
					$elem.eq(i)
						.attr( "id", this.root.attrPrefix + this.formId + "_" + this.root.lb.elem  + "_" + i );
				}
			},

			getFormId : function () {
				return this.formId;
			},

			get$elem : function () {
				return this.$ct.children( "." + this.root.attrPrefix + elem );
			},

			get$ct : function () {
				return this.$ct;
			}
		}
	}());

	return NewWindowForm;
}());


hExplorizer.explorizer = (function () {
	var idCounter	= 0;

	function NewExplorizer() {
		this._init( idCounter );
		idCounter += 1;
	}

	NewExplorizer.prototype = (function (args) {
		function initModule () {
			this.module	= {
				eventController : new hExplorizer.eventController	(this),
				aligner		: new hExplorizer	.aligner		(this),
	//			resizer		: new hExplorizer	.resizer		(this),
				selector	: new hExplorizer	.selector		(this),
				manipulator	: new hExplorizer	.manipulator	(this),
				titleBar	: new hExplorizer	.titleBar		(this),
				locator		: new hExplorizer	.locator		(this)
			};
		}
 
		function adjustSize () {
			for ( var i = 0, l = this.form.length; i < l; i++) {
				this.form[ i ].rootObj.adjustSize();
			}
		}

		function delayTrigger ( event, startX, startY, threshold, callback ) {
			// calculate torelance range.
			var	outOfRange	= (
				Math.sqrt(
					Math.pow( ( event.pageX - startX ), 2 ) +
					Math.pow( ( event.pageY - startY ), 2 ) 
				) > threshold
			);

			if ( outOfRange ) {
				this.removeTrigDelayer();
				callback();
			}
		}

		return {
			attrPrefix		: "hd_ex_",
			lb : {
				form 		: "form",
				elem 		: "elem",
				content 	: "ct",
				innrWrap 	: "iw",
				outrWrap 	: "ow",
				cursor 		: "cursor",
				cursor_copy	: "cursor_copy",
				cursor_move	: "cursor_move",
				cursor_text : "cursor_text",	
				slctBoxId	: "slctBox",
				unSelect 	: "ex_unselect",
				selecting 	: "ex_selecting",
				selected 	: "ex_selected",
				preselect 	: "ex_preselect",
				titleBar	: "titleBar",
				removeBtn 	: "removeBtn",
				titleSpace 	: "titleSpc",
				resize		: "resize"	
			},
 
 			_init : function ( id ) {
 				this.id			= id;
 				this.form		= [];
			},

 			set : function ( args ) {
 				args	= args || {};
 				args .className	= args .className || {};
 
 				// required
 				this.$wrapper	= args	.$wrapper;
 
 				// optional
 				// scroll								 
 				this.autoScroll		= args .autoScroll		|| ( hExplorizer.util.browser.ie || hExplorizer.util.browser.opera );
 				this.scrollWeight	= args .scrollWeight	|| 0.8;
 
 				// individual parameter
 				// css status
 				this.width			= ( typeof args .width		=== "undefined" ) ? 300		: args .width;	// initial value
 				this.height			= ( typeof args .height		=== "undefined" ) ? 400		: args .height;	// do.
 				this.minWidth		= ( typeof args .minWidth	=== "undefined" ) ? 300		: args .minWidth;
 				this.minHeight		= ( typeof args .minHeight	=== "undefined" ) ? 400		: args .minHeight;
 				this.maxWidth		= ( typeof args .maxWidth	=== "undefined" ) ? null	: args .maxWidth;
 				this.maxHeight		= ( typeof args .maxHeight	=== "undefined" ) ? null	: args .maxHeight;
 
 				this.tBarHeight		= ( typeof args .tBarHeight	=== "undefined" ) ? 30		: args .tBarHeight;

				this.callback	= {
					mouseDown_pre	: args .mouseDown_pre	|| function () {},
					mouseDown_after	: args .mouseDown_after	|| function () {},
					mouseUp_pre		: args .mouseUp_pre		|| function () {},
					mouseUp_after	: args .mouseUp_after	|| function () {}
				};

 				return	this;
 			},
  
 			add : function () {
 				var	that	= this;
 
 				// initialize modules
 				if ( typeof this.module === "undefined" ) {
 					initModule.bind(this)();
 				}
 
 				// create form object. This contains $ objects mainly.

				// create form root. And the content element ebject relocate
				// under "form.rootObj". $iw(inner wrapper) and $ow(outer wrapper)
				// locate there too.
 				var form	= new hExplorizer.windowForm( this ),
 					id		= form.getFormId();
 				this.form[ id ]	= form;
				form = null;
				var _form	= this.form[ id ];

				_form .add();

				_form.$ct
					.data({
						"formId"	: id
					});

				_form.$ow
					.css({ "z-index" : id });

				// reset and add event listener for the new windowForm.
 				this.module.eventController
 					.set({
 						"callback" : this.initialize.bind(this)
 					})
 					.initialize();

				// it enables window-form to move by dragging. 
		//		this.module.locator
		//			.add();
								 
 				this.id++;
 				return	_form.$ct;
 			},
 
 			initialize : function ( id ) {
 				this.module.eventController
 					.initialize();
 
 				// 変更があったformのみにinitializeを絞るべき。
 				for ( var i = 0, l = this.form.length; i < l; i++) {
 					var form	= this.form[ i ];
 					form .initialize();
				}
 			},

			createDiv : function ( $target, Name, formId ) {
				$target
					.append(
					    "<div " +
							"class=\""+
								this.attrPrefix +  Name +
							"\" " +
							"id=\""+
								this.attrPrefix + formId +"_"+  Name +
							"\" " +
							hExplorizer.util.preventSelect +
					    ">" +
					    "</div>"	);
				return	$( "#" + this.attrPrefix + formId +"_"+  Name );
			},

			parser : function ( $target ) {
				var	str		= $target.attr("id").split("_"),
					formId	= str[2]-0,
					part	= str[3],
					elemId	= str[4]-0;

				return {
					"formId" : formId,
					"part"	 : part,
					"elemId" : ( typeof elemId !== "undefined" ) ? elemId : false
				}
			},

			get$ow : function ( formId ) {
				if ( arguments[0] === "all" || arguments.length === 0 ) {
					return $( "." + this.attrPrefix + this.lb.outrWrap );
				} else {
					return $( "#" + this.attrPrefix + formId + "_" + this.lb.outrWrap );
				}
			},

			get$iw : function ( formId ) {
				return $( "#" + this.attrPrefix + formId + "_" + this.lb.innrWrap );
			},

			get$ct : function ( formId ) {
				if ( arguments[0] === "all" || arguments.length === 0 ) {
					return $( "." + this.attrPrefix + this.lb.content );
				} else {
					return $( "#" + this.attrPrefix + formId + "_" + this.lb.content );
				}
			},

			get$elem : function ( formId, elemId ) {
				if ( arguments.length === 1 ) {
					return this.get$ct( formId ).children( "." + this.attrPrefix + this.lb.elem );
				} else if ( arguments[0] === "all" || arguments.length === 0 ) {
					return $( "." + this.attrPrefix + this.lb.elem );
				} else {
					return $( "#" + this.attrPrefix + formId + "_" + this.lb.outrWrap );
				}
			},

			preselectElem : function ( formId, elemId ) {
				$( "#" + this.attrPrefix + formId + "_" + this.lb.elem + "_" + elemId )
					.removeClass( this.lb.selected  )
					.removeClass( this.lb.preselect  )
					.addClass	( this.lb.preselect  );
			},

			selectElem : function ( formId, elemId ) {
				$( "#" + this.attrPrefix + formId + "_" + this.lb.elem + "_" + elemId )
					.removeClass( this.lb.selected  )
					.removeClass( this.lb.preselect  )
					.addClass	( this.lb.selected  );
			},

			unselectElem : function ( formId, elemId ) {
				$( "#" + this.attrPrefix + formId + "_" + this.lb.elem + "_" + elemId )
					.removeClass( this.lb.selected  )
					.removeClass( this.lb.preselect  )
					.addClass	( this.lb.unSelect  );
			},

			unselectAllElem : function () {
				$( "." + this.attrPrefix + this.lb.elem )
					.removeClass( this.lb.selected  )
					.removeClass( this.lb.preselect  )
					.addClass	( this.lb.unSelect  );
			},

			selectPropery : function ( formId, elemId ) {
				$( "." + this.lb.preselect )
					.removeClass( this.lb.preselect  )
					.addClass	( this.lb.selected  );
			},

			isSelect : function ( formId, elemId, includePre ) {
				includePre = true;
				return (
					$( "#" + this.attrPrefix + formId + "_" + this.lb.elem + "_" + elemId )
						.is( "."+this.lb.selected + ((includePre) ? ", ."+this.lb.preselect : "") )
				)
			},

			cb : function ( funcObj, handleName, argsArray ) {
				if ( typeof funcObj[ handleName ] !== "undefined" ) {
					return funcObj[ handleName ].apply(this, argsArray);
				}
			},

			// triggerDelayer ---------------------------------------------------------------------
			setTrigDelayer : function ( startX, startY, torelance, callback ) {
				this.mouseMove_delayer = function ( event ) {
					delayTrigger.bind(this)(
						event,
						startX, startY,
						torelance,
						callback
					);
				}.bind(this);
				$(window).bind( "mousemove", this.mouseMove_delayer	.bind(this) );
			},

			removeTrigDelayer : function ( event ) {
				$(window).unbind( "mousemove" );
			}
 		}
 	}());

	return NewExplorizer;
}());

})( hExplorizer );

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

(function( hExplorizer ) {

hExplorizer.resizer = (function(){
	var NewResizer = function () {};

	NewResizer.prototype = (function(){ 
		var	angleStr	= "top bottom left right top_left top_right bottom_left bottom_right",
			angleArray	= angleStr	.split(" "),
			protoMember = {},
			handle = {};
				
		handle.top = {
			css : function () {
				return {
					"top":		0	- this.handleWidth + this.topGap,
					"left": 	0,
					"width": 	this.width,
					"height":	this.handleWidth,
					"z-index":	this.zIndex,
					"cursor":	"n-resize"
				}
			},
			mouseMove : function (event) {  this.$t.css( handle.top.range.bind(this)(event)); },
			mouseUp : function (event) {
				this.$handle["left"]	.css({ "height": this.$t.height() - this.topGap });
				this.$handle["right"]	.css({ "height": this.$t.height() - this.topGap });
			},
			range : function (event) {
				var	_height, top, height, accTerm, attMax, attMin, divY, priority, nowTop;
				
				nowTop		= event.pageY - this.divY_Hnd_top;
				divY		= this.prevTop - nowTop;
				_height		= (this.height - this.borderWidthY) + divY;
				accTerm		= (nowTop < this.wrap.top);
				attMax		= (_height > this.limit.maxY);
				attMin		= (_height < this.limit.minY);
				priority	= ( (this.prevBottom - this.limit.maxY) > (this.wrap.top) )

				if ( accTerm || attMax ){
					if ( priority ){
						top	= this.prevBottom - this.limit.maxY - this.divY_Hnd_top;
						height	= this.height - (top - this.prevTop) - this.borderWidthY;
					} else if ( nowTop < this.wrap.top ){
						top	= this.wrap.top;
						height	= this.prevBottom - this.wrap.top - this.borderWidthY;
					}
				} else if ( attMin ){
					top		= this.prevBottom - this.limit.minY - this.borderWidthY;// - this.divY_Hnd_top;
					height	= this.limit.minY;
				} else {
					top		= nowTop;
					height	= this.height - (top - this.prevTop) - this.borderWidthY;
				}

				return { "top" : top, "height" : height };
			}
		},

		handle.bottom = {
			css : function () {
				return {
					"bottom":	0	- this.handleWidth + this.bottomGap,
					"left": 	0,
					"width": 	this.width,
					"height":	this.handleWidth,
					"cursor":	"s-resize",
					"z-index":	this.zIndex
				}
			},
			mouseMove : function (event) { this.$t.css( handle.bottom.range.bind(this)(event)); },
			mouseUp : handle.top.mouseUp,
			range : function (event) {
				var	_height, top, height, accTerm, attMax, attMin, divY, priority, nowTop;

				nowTop		= event.pageY - this.divY_Hnd_bottom;
				divY		= nowTop - this.prevBottom;
				_height		= ( this.height - this.borderWidthY ) + divY;
				accTerm		= (nowTop > this.wrap.bottom);
				attMax		= (_height > this.limit.maxY);
				attMin		= (_height < this.limit.minY);
				priority	= ( (this.prevTop + this.limit.maxY) < (this.wrap.bottom) );

				if ( accTerm || attMax ){
					if ( priority ){
						height	= this.limit.maxY;
					} else {
						height	= this.wrap.bottom - this.prevTop;
					}
				} else if ( attMin ){
					height	= this.limit.minY;
				} else {
					height	= _height;
				}

				return { "height" : height };
			}
		},

		handle.left = {
			css : function () {
				return {
					"top":		0 + this.topGap,
					"left": 	0 - this.handleWidth + this.leftGap,
					"width": 	this.handleWidth,
					"height":	this.height - this.topGap,
					"cursor":	"e-resize",
					"z-index":	this.zIndex
				}
			},
			mouseMove : function (event) { this.$t.css( handle.left.range.bind(this)(event)); },
			mouseUp : function (event) {
				this.$handle["top"]		.css({ "width" : this.$t.width() });
				this.$handle["bottom"]	.css({ "width" : this.$t.width() });
			},
			range : function (event) {
				var	_width, left, width, accTerm, attMax, attMin, divX, priority, nowLeft;

				nowLeft		= event.pageX - this.divX_Hnd_left;
				divX		= this.prevLeft - nowLeft;
				_width		= (this.width - this.borderWidthX) + divX;
				accTerm		= (nowLeft < this.wrap.left);
				attMax		= (_width > this.limit.maxX);
				attMin		= (_width < this.limit.minX);
				priority	= ( (this.prevRight - this.limit.maxX) > (this.wrap.left) )

				if ( accTerm || attMax ){
					if ( priority ){
						left	= this.prevRight - this.limit.maxX - this.divX_Hnd_left;
						width	= this.width - (left - this.prevLeft) - this.borderWidthX;
					} else if ( nowLeft < this.wrap.left ){
						left	= this.wrap.left;
						width	= this.prevRight - this.wrap.left - this.borderWidthX;
					}
				} else if ( attMin ){
					left	= this.prevRight - this.limit.minX - this.borderWidthX;// - this.divY_Hnd_top;
					width	= this.limit.minX;
				} else {
					left	= nowLeft;
					width	= this.width - (left - this.prevLeft) - this.borderWidthX;
				}

				return { "left" : left, "width" : width };
			}
		},

		handle.right = {
			css : function () {
				return {
					"top":		0 + this.topGap,
					"right":	0 - this.handleWidth + this.rightGap,
					"width": 	this.handleWidth,
					"height":	this.height - this.topGap,
					"cursor":	"w-resize",
					"z-index":	this.zIndex
				}
			},
			mouseMove : function (event) { this.$t.css( handle.right.range.bind(this)(event)); },
			mouseUp : handle.left.mouseUp,
			range : function (event) {
				var	_width, left, width, accTerm, attMax, attMin, divX, priority, nowLeft;

				nowLeft		= event.pageX - this.divX_Hnd_right;
				divX		= nowLeft - this.prevRight;
				_width		= ( this.width - this.borderWidthX ) + divX;
				accTerm		= (nowLeft > this.wrap.right);
				attMax		= (_width > this.limit.maxX);
				attMin		= (_width < this.limit.minX);
				priority	= ( (this.prevLeft + this.limit.maxX) < (this.wrap.right) );

				if ( accTerm || attMax ){
					if ( priority ){
						width	= this.limit.maxX;
					} else {
						width	= this.wrap.right - this.prevLeft;
					}
				} else if ( attMin ){
					width	= this.limit.minX;
				} else {
					width	= _width;
				}

				return { "width" : width };
			}
		},

		handle.top_left = {
			css : function () {
				return {
					"top":		0	- this.handleWidth + this.topGap,
					"left": 	0	- this.handleWidth + this.leftGap,
					"width": 	this.angleHandleSize,
					"height":	this.angleHandleSize,
					"cursor":	"nw-resize",
					"z-index":	this.zIndex + 1
				}
			},
			mouseMove : function (event) { handle.top.mouseMove.bind(this)(event);  handle.left.mouseMove.bind(this)(event); },
			mouseUp : function (event) { handle.top.mouseUp.bind(this)(event);  handle.left.mouseUp.bind(this)(event); }
		},

		handle.top_right = {
			css : function () {
				return {
					"top":		0	- this.handleWidth + this.topGap,
					"right":	0	- this.handleWidth + this.rightGap,
					"width": 	this.angleHandleSize,
					"height":	this.angleHandleSize,
					"cursor":	"ne-resize",
					"z-index":	this.zIndex + 1
				}
			},
			mouseMove : function (event) { handle.top.mouseMove.bind(this)(event);  handle.right.mouseMove.bind(this)(event); },
			mouseUp : handle.top_left.mouseUp
		},

		handle.bottom_left = {
			css : function () {
				return {
					"bottom":	0	- this.handleWidth + this.bottomGap,
					"left": 	0	- this.handleWidth + this.leftGap,
					"width": 	this.angleHandleSize,
					"height":	this.angleHandleSize,
					"cursor":	"sw-resize",
					"z-index":	this.zIndex + 1
				}
			},
			mouseMove : function (event) { handle.bottom.mouseMove.bind(this)(event);  handle.left.mouseMove.bind(this)(event); },
			mouseUp : handle.top_left.mouseUp
		},

		handle.bottom_right = {
			css : function () {
				return {
					"bottom":	0	- this.handleWidth + this.bottomGap,
					"right":	0	- this.handleWidth + this.rightGap,
					"width": 	this.angleHandleSize,
					"height":	this.angleHandleSize,
					"cursor":	"se-resize",
					"z-index":	this.zIndex + 1
				}
			},
			mouseMove : function (event) { handle.bottom.mouseMove.bind(this)(event);  handle.right.mouseMove.bind(this)(event); },
			mouseUp : handle.top_left.mouseUp
		}

		function mouseDown_common ( x, y, angle ){
			var w	= this.$wrapper,
				wos	= w.offset();
			
			this.width			= this.$t.outerWidth(true);
			this.height			= this.$t.outerHeight(true);			
			this.prevTop		= this.$t.offset().top;
			this.prevLeft		= this.$t.offset().left;
			this.prevBottom	= this.prevTop + this.height;
			this.prevRight		= this.prevLeft + this.width;
			this.wrap	= {
				top 	: wos.top,
				bottom	: wos.top + w.height(),
				left 	: wos.left,
				right	: wos.left + w.width()
			};
			this.divX_Hnd_left		= x - this.prevLeft; // divasion from handle central axis. 
			this.divX_Hnd_right		= x - this.prevLeft - this.width; // divasion from handle central axis. 
			this.borderWidthX		= (	parseInt(this.$t.css("border-left-width")) +
										parseInt(this.$t.css("border-right-width"))	);
			this.divY_Hnd_top		= y - this.prevTop; // divasion from handle central axis. 
			this.divY_Hnd_bottom	= y - this.prevBottom; // divasion from handle central axis. 
			this.borderWidthY		= (	parseInt(this.$t.css("border-top-width")) +
										parseInt(this.$t.css("border-bottom-width")) );

			this.event.mouseMove[ angle ] = function (event) {
				handle[ angle ].mouseMove.bind(this)(event);
			}.bind(this);
			$(window).bind( "mousemove", this.event.mouseMove[ angle ] );
			
			this.event.mouseUp = protoMember.mouseUpEvent || function (event) {
				$(window)
					.unbind( "mouseup",	this.event.mouseUp );					
				handle[ angle ].mouseUp.bind(this)(event, this);
				this.callback.end();
			}.bind(this);
			$(window).bind( "mouseup", this.event.mouseUp );			
		}

		function createHandleDiv ( angle ) {
			this.$t
				.append(
				    "<div " +
						"class=\"" +
							this.clsName +" "+
							"hnd_" + angle +
						"\" " +
						"id=\"" +
							this.clsName +"_"+ angle +"_"+ this.id +
						"\" " +
						hExplorizer.util.preventSelect +
				    ">" +
				    "</div>"
				);
			return this.$t .children( "." + this.clsName ) .filter( ".hnd_" + angle );
		} 

		function setCss ( angle ) {
			this.$handle[ angle ].css( handle[ angle ].css.bind(this)() );
		}

		function setMouseDown ( angle ) {
			var that = this;
			this.event.mouseDown[ angle ] = function (event) {
				event.stopPropagation();
				mouseDown_common.bind(that)( event.pageX, event.pageY, angle );
				this.callback.start();
			}.bind(this);
						
			this.$handle[ angle ]
				.bind( "mousedown",	this.event.mouseDown[ angle ].bind(this) );
		}
		
		return {
			set : function (args) {
				args = args || { gap:null, limit:null };

				this.$wrapper			= args	.wrapper;
				this.clsName			= args	.clsName		|| "hd_ex_resize";
				this.id					= String( args.id )		|| null;
				this.angle				= args	.angle			|| angleStr;
				this.handleWidth		= args	.handleWidth	|| 15;
				this.angleHandleSize	= args	.angleHandleSize|| 15;
				this.zIndex				= args	.zIndex			|| 0;
				this.leftGap	= (typeof args	.leftGap !== "number") 	? 0 : args.leftGap,
				this.rightGap	= (typeof args	.rightGap !== "number")	? 0 : args.rightGap,
				this.topGap		= (typeof args	.topGap !== "number")	? 0 : args.topGap,
				this.bottomGap	= (typeof args	.bottomGap !== "number")? 0 : args.bottomGap
				this.limit		= {
					maxX	: args	.maxX,
					maxY	: args	.maxY,
					minX	: (typeof args.minX !== "number") ? 50 : args.minX,
					minY	: (typeof args.minY !== "number") ? 50 : args.minY
				};

				this.callback	= {
					start	: args .start	|| function(){},
					end		: args .end		|| function(){}
				};
				
				return	this;
			},

			add : function( $target ){
				this.$t	= $target;
				this.$handle = {};
				this.event = { mouseDown:{}, mouseMove:{}, mouseUp:{} };

				this.width	= this.$t.outerWidth(true);
				this.height	= this.$t.outerHeight(true);

				for ( var i=0, a=this.angle.split(" "), l=a.length; i<l; i++ ){
					var angle = String( a[i] );
					this.$handle[ angle ] = createHandleDiv.bind(this)( angle );
					setCss.bind(this)( angle );
					setMouseDown.bind(this)( angle );
				}
			
				return	this;
			}
		} //return
	}()); //prototype

	return NewResizer;
}()); //resize

})( hExplorizer );

(function( hExplorizer ) {

hExplorizer.selector = (function () {
	function NewSelector( root ) {
		this.root	= root;
		this.timer	= {};
	}

	NewSelector.prototype = (function () {
		var slctBoxId = "slctBox";

		function byDrag (
			event,
			startX, startY,
			wrapLeft, wrapTop, wrapHeight,
			xt, yt,
			$iw, $elem
		) {
			var	scrX	= $iw.scrollLeft(),
				scrY	= $iw.scrollTop(),

				xn		= event.pageX - wrapLeft,
				yn		= event.pageY - wrapTop,
				xns		= xn + scrX,
				yns		= yn + scrY,
				t;

			// calculate and limit range.
			if		(xns > xt)	{ xns = xt }
			else if	(xns < 0)	{ xns = 0 } 
			if		(yns > yt)	{ yns = yt }
			else if (yns < 0)	{ yns = 0 } 

			if		(startX > xns) { t = xns; xns = startX; startX = t; }
			if		(startY > yns) { t = yns; yns = startY; startY = t; }

			// scroll function for the browser who don't have auto-scroll func. ex ie, opera

			if ( this.root.autoScroll ) {
				if		(yn < 0) 			{ scrollCt.bind(this)( $iw, yn*this.root.scrollWeight ); }
				else if	(yn > wrapHeight)	{ scrollCt.bind(this)( $iw, (yn - wrapHeight)*this.root.scrollWeight ); }
				else						{ stopScrollCt.bind(this)(); } 
			}
			// draw a box that shows selecting range.
			this.$box
				.css({
					"left"	: startX,
					"top"	: startY,
					"width"	: xns-startX,
					"height": yns-startY });

			// determinate whether or not elements are in range
			for ( var i = 0, l = $elem.length; i < l; i++) {
				var $e		= $elem.eq( i ),
					pos		= $e.position();

				var	left	= pos.left	+ parseInt( $e.css( "margin-left" ) ),
					right	= pos.left	+ parseInt( $e.css( "margin-left" ) )	+ $e.width(),
					top		= pos.top	+ parseInt( $e.css( "margin-top" ) )	+scrY,
					bottom	= pos.top	+ parseInt( $e.css( "margin-top" ) )	+scrY+ $e.height();

				// in range?
				var	outRange	= ( left > xns || right < startX || top > yns || bottom < startY );
				if ( !outRange ) {
					$e	.removeClass( this.root.lb.unSelect  )
						.removeClass( this.root.lb.selected  )
						.removeClass( this.root.lb.preselect  )
						.addClass	( this.root.lb.preselect  );
					
				//	this.root.preselectElem( $e );
				// this.selectElem( $e );
				} else {
					if ( !event.ctrlKey && !event.shiftKey ) {
						$e	.removeClass( this.root.lb.selected  )
							.removeClass( this.root.lb.preselect  )
							.addClass	( this.root.lb.unSelect  );
					//	this.root.unselectElem($e);
					}
				}
			}
		}

		function scrollCt ( $iw, val ) {
			if ( this.timer === null || val !== this._preVal) {
				clearInterval(this.timer);
				this.timer	= setInterval(function () {//
					$iw.scrollTop( $iw.scrollTop() + val ); 
				}.bind(this), 1);
				this._preVal	= val;
			}
		}

		function stopScrollCt () {
			clearInterval(this.timer);
			this.timer = null;
		}
		
		function removeBox () {
			if ( this.$box ) this.$box.remove();
		}
		
		return {				
			setParam : function (args) {
				args = args || {};

 				this.timer		= {};
 				this.param		= {};
 				this.$preselect	= [];

				this.autoScroll		= args	.autoScroll		|| ( util.browser.ie || util.browser.opera );
				this.scrollWeight	= ( typeof args .scrollWeight === "undefined" )	? 1 : args. scrollWeight;

				return	this;
			},

	        onElem : function ( ctrlKey, shiftKey, formId, clickedId, cb ) {	        	
				var	p1, p2, i,
					isSelect = this.root.isSelect( formId, clickedId );
									
				if ( shiftKey ) {
		            // shiftを押しながら選択した場合、
		            // もしリセット後初めて押したのなら、その1つ前の選択を基点にする。   // 2回目以降であれば、基点は変えない。
		            if ( !this.prevShift ) {
		            	this.startId	= this.prevClicked;
		            }
		            
		            if ( this.startId > clickedId ) {
		            	p1 = clickedId,
		            	p2 = this.startId;
		            } else {
		            	p1 = this.startId,
		            	p2 = clickedId;
		            }
		            
		            if ( !ctrlKey ) this.root.unselectAllElem();
		            
		            for ( var i = p1, counter = 0; i <= p2; ++i ) {
						this.root.preselectElem( formId, i );
					}
					
					this.root.cb( cb, "selectWithShift", [ formId, clickedId ] );
				} else if ( ctrlKey ) {
					if ( isSelect ) { 
						this.root.unselectElem( formId, clickedId );
						this.root.cb( cb, "unselectByCtrl", [ formId, clickedId ] );
					} else {
						this.root.preselectElem( formId, clickedId );
						this.root.cb( cb, "preselectByCtrl", [ formId, clickedId ] );
			     	}
				} else if ( !ctrlKey ) {
					if ( isSelect ) { 
						this.root.cb( cb, "downOnSelected", [ formId, clickedId ] );
			   		} else {
						this.root.unselectAllElem();
						this.root.preselectElem( formId, clickedId );
						this.root.cb( cb, "preselect", [ formId, clickedId ] );
					}
				}
				this.prevClicked = clickedId;
		        this.prevShift = shiftKey;
			},

			onBack : function ( x, y, formId ) {				
				var	$ow			= this.root.get$ow( formId ),
					$iw			= this.root.get$iw( formId ),
					$ct			= this.root.get$ct( formId ),
					$elem		= this.root.get$elem( formId );
				
				this.noSelect	= true;
				
				// The following logic prevent the status changes into "byDrag" that is caused immediately, 
				// so as to keep the status "mouseDownonNonElement" in case of selecting no elements eventually.
				this.root.setTrigDelayer( x, y, 1, function () {
					var wrapPos		= $ow.position(),
						wrapHeight	= $ow.outerHeight(),
						wrapScrLeft	= $iw.scrollLeft(),
						wrapScrTop	= $iw.scrollTop(),
						fieldWidth	= $ct.width(),
						fieldHeight	= $ct.height(),

						wrapLeft	= wrapPos.left,
						wrapTop		= wrapPos.top,
						startX		= x - wrapLeft + wrapScrLeft,
						startY		= y - wrapTop + wrapScrTop,
						wrapBottom	= wrapTop + wrapHeight,
						xt			= fieldWidth	-2,
						yt			= fieldHeight	-2;

					this.noSelect	= false;
				
					this.$box = this.root.createDiv(
						$ct,
						slctBoxId,
						formId,
						hExplorizer.util.preventSelect
					);

					// bind new mousemove event.
					this.mouseMove_drag	= function ( event ) {
						byDrag.bind(this)(
							event,
							startX, startY,
							wrapLeft, wrapTop, wrapHeight,
							xt, yt,
							$iw, $elem
						);
					}.bind(this);

					$(window)
						.bind( "mousemove", this.mouseMove_drag );
				}.bind(this) );
			},

			mouseUp : function () {	        	
				stopScrollCt.bind(this)();
				removeBox.bind(this)();
				if	( this.noSelect ) this.root.unselectAllElem();
				this.noSelect	= false;
				return this;
			}
	    }
	}());

	return	NewSelector;
}());

})( hExplorizer );

(function( hExplorizer ) {

hExplorizer.titleBar = (function () {
	function NewTitleBar( root ) {
		this.root = root;	
	}

	NewTitleBar.prototype = (function () {
		var titleBar	= "titleBar",
			removeBtn 	= "removeBtn",
			titleSpace 	= "titleSpc";

		function adjustLocation () {
			this.$bar
				.css({
					"position"	: "absolute",
					"width"		: "100%",
					"height"	: this.root.tBarHeight });
		}

		return {
			add : function ( formId ) {				
				this.$bar	= this.root.createDiv(
					this.root.get$ow( formId ),
					titleBar,
					formId
				);
				
				this.$removeBtn = this.root.createDiv(
					this.$bar,
					removeBtn,
					formId
				);
				
				adjustLocation.bind(this)();

				return	this.$bar;
			},
			
			get$titleBar : function ( formId ) {
				if ( arguments[0] === "all" || arguments.length === 0 ) {
					return $( "." + this.root.attrPrefix + titleBar );
				} else {
					return $( "#" + this.root.attrPrefix + formId + "_" + titleBar );
				}
			}
	    }
	}());

	return	NewTitleBar;
}());

})( hExplorizer );

window.hExplorizer = hExplorizer;
})(window);
﻿
﻿"use strict";
"use warnings";

(function(window) {	
var hExplorizer = {};
﻿
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

(function( hExplorizer ) {

hExplorizer.util = hExplorizer.util || function () {
	var	ua	= navigator.userAgent;
	return {
		browser	: {
			"chrome"	: (ua.indexOf( "Chrome" ) 	!== -1),
			"firefox"	: (ua.indexOf( "Firefox" )	!== -1),
			"ie"		: (ua.indexOf( "MSIE" )		!== -1),
			"opera"		: (ua.indexOf( "Opera" )	!== -1),
			"safari"	: (ua.indexOf( "safari" )	!== -1)
		},
		preventSelect : function () {
			return (
				hExplorizer.util.browser.ie || hExplorizer.util.browser.firefox
					? "onmousemove=\"window.getSelection().removeAllRanges();\"" 
					: ""
			)
		}
	}
}();

// for non-ECMAScript 5th-compliant browser.
// bind method
if ( typeof Function.prototype.bind === "undefined" ) {
	Function.prototype.bind = function ( thisArg ) {
		var fn = this,
			slice	= Array.prototype.slice,
			args	= slice.call( arguments, 1 );

		return function () {
			return fn.apply( thisArg, args.concat( slice.call(arguments) ) );
		};
	};
}

})( hExplorizer );

﻿(function( hExplorizer ) {

hExplorizer.windowForm = (function () {
	var idCounter	= 0;

	function NewWindowForm( root ) {
		this.root		= root;
		this.formId		= idCounter;

		this.attrPrefix	= this.root.attrPrefix;
		this.width		= this.root.width;
		this.height		= this.root.height;
		this.minWidth	= this.root.minWidth;
		this.minHeight	= this.root.minHeight; 
		this.maxWidth	= this.root.maxWidth; 
		this.maxHeight	= this.root.maxHeight; 
		this.tBarHeight	= this.root.tBarHeight

		this.module	= {
			resizer		: new hExplorizer.resizer(this)	|| null,
	//		titleBar	: new hExplorizer.titleBar(this)	|| null
		};

		idCounter += 1;
	}

	NewWindowForm.prototype = (function () {
		var	form 			= "form",
			elem 			= "elem",
			content 		= "ct",
			innrWrap 		= "iw",
			outrWrap 		= "ow";

		function createWrapper () {
			this.$ow	= this.root.createDiv( this.root.$wrapper,	outrWrap,	this.formId );
			this.$iw	= this.root.createDiv( this.$ow, 			innrWrap,	this.formId );
			this.$ct	= this.root.createDiv( this.$iw, 			content,	this.formId );
		}

		function adjustSize () {
			var	x	= this.$ct.offset().left,
				y	= this.$ct.offset().top,
				h	= this.height	|| this.$ct.outerHeight(),
				w	= this.width	|| this.$ct.outerWidth();
		 
		 	// The CSS height of content (lowermost layer) change "auto".   
		 	this.$ct.css({
		 		"top"		: 0,
		 		"left"		: 0,
		 		"width"		: "",
		 		"height"	: ""
		 	});

			// Set the same location and size as the content element before altering.
			// The outer wrapper works indicator for location and size.
			this.$ow.css({
				"top"		: y,
				"left"		: x,
				"height"	: h,
				"width"		: w
			});
			// The inner wrapper confire display range. this width and height are "100%" for the outer wrapper.
		}

		function resetCtSize () {
			this.$ct
				.css({ "height": "" });
		}

		function fitCtSize () {
			// if the content's height is less than that of the inner wrapper, selection range is confired by
			// the content's size (because selection events work in the content object). And so the content's
			// size fit in the inner wrapper.
			if ( this.$ct.height() < this.$iw.height() ) {
				this.$ct
					.css({ "height": this.$iw.height() - 8	});
			}
		}

		return {
 			//public
			add : function () {
				createWrapper	.bind(this)();
				adjustSize		.bind(this)();

				this.$ct
					.css({ "padding" : 2 }); 	// to prevent display vertical-scrollbar over again

				this.module.resizer
					.set({
						"clsName"		: this.attrPrefix + this.root.lb.resize,
						"id"			: this.formId,
						"topGap"		: -25,		// for title bar's height
						"bottomGap"		: 5,
						"leftGap"		: 5,
						"zIndex"		: 3,
						"angleHandleSize": 25,
						"end"			: fitCtSize.bind(this),
						"start		"	: resetCtSize.bind(this),
						"wrapper"		: $("#wrapper")	})
					.add( this.$ow );

				var	$bar =
					this.root.module.titleBar
						.add( this.formId );

				return 	this.$ct;
			},

			initialize : function () {
				resetCtSize.bind(this)();
				fitCtSize.bind(this)();  

				this.$elem	= this.$ct.children( "." + this.root.attrPrefix + this.root.lb.elem  );
				this.numbering();
			},

			numbering : function () {
				for ( var i = 0, $elem = this.root.get$elem( this.formId ), l = $elem.length; i < l; i++ ) {
					$elem.eq(i)
						.attr( "id", this.root.attrPrefix + this.formId + "_" + this.root.lb.elem  + "_" + i );
				}
			},

			getFormId : function () {
				return this.formId;
			},

			get$elem : function () {
				return this.$ct.children( "." + this.root.attrPrefix + elem );
			},

			get$ct : function () {
				return this.$ct;
			}
		}
	}());

	return NewWindowForm;
}());


hExplorizer.explorizer = (function () {
	var idCounter	= 0;

	function NewExplorizer() {
		this._init( idCounter );
		idCounter += 1;
	}

	NewExplorizer.prototype = (function (args) {
		function initModule () {
			this.module	= {
				eventController : new hExplorizer.eventController	(this),
				aligner		: new hExplorizer	.aligner		(this),
	//			resizer		: new hExplorizer	.resizer		(this),
				selector	: new hExplorizer	.selector		(this),
				manipulator	: new hExplorizer	.manipulator	(this),
				titleBar	: new hExplorizer	.titleBar		(this),
				locator		: new hExplorizer	.locator		(this)
			};
		}
 
		function adjustSize () {
			for ( var i = 0, l = this.form.length; i < l; i++) {
				this.form[ i ].rootObj.adjustSize();
			}
		}

		function delayTrigger ( event, startX, startY, threshold, callback ) {
			// calculate torelance range.
			var	outOfRange	= (
				Math.sqrt(
					Math.pow( ( event.pageX - startX ), 2 ) +
					Math.pow( ( event.pageY - startY ), 2 ) 
				) > threshold
			);

			if ( outOfRange ) {
				this.removeTrigDelayer();
				callback();
			}
		}

		return {
			attrPrefix		: "hd_ex_",
			lb : {
				form 		: "form",
				elem 		: "elem",
				content 	: "ct",
				innrWrap 	: "iw",
				outrWrap 	: "ow",
				cursor 		: "cursor",
				cursor_copy	: "cursor_copy",
				cursor_move	: "cursor_move",
				cursor_text : "cursor_text",	
				slctBoxId	: "slctBox",
				unSelect 	: "ex_unselect",
				selecting 	: "ex_selecting",
				selected 	: "ex_selected",
				preselect 	: "ex_preselect",
				titleBar	: "titleBar",
				removeBtn 	: "removeBtn",
				titleSpace 	: "titleSpc",
				resize		: "resize"	
			},
 
 			_init : function ( id ) {
 				this.id			= id;
 				this.form		= [];
			},

 			set : function ( args ) {
 				args	= args || {};
 				args .className	= args .className || {};
 
 				// required
 				this.$wrapper	= args	.$wrapper;
 
 				// optional
 				// scroll								 
 				this.autoScroll		= args .autoScroll		|| ( hExplorizer.util.browser.ie || hExplorizer.util.browser.opera );
 				this.scrollWeight	= args .scrollWeight	|| 0.8;
 
 				// individual parameter
 				// css status
 				this.width			= ( typeof args .width		=== "undefined" ) ? 300		: args .width;	// initial value
 				this.height			= ( typeof args .height		=== "undefined" ) ? 400		: args .height;	// do.
 				this.minWidth		= ( typeof args .minWidth	=== "undefined" ) ? 300		: args .minWidth;
 				this.minHeight		= ( typeof args .minHeight	=== "undefined" ) ? 400		: args .minHeight;
 				this.maxWidth		= ( typeof args .maxWidth	=== "undefined" ) ? null	: args .maxWidth;
 				this.maxHeight		= ( typeof args .maxHeight	=== "undefined" ) ? null	: args .maxHeight;
 
 				this.tBarHeight		= ( typeof args .tBarHeight	=== "undefined" ) ? 30		: args .tBarHeight;

				this.callback	= {
					mouseDown_pre	: args .mouseDown_pre	|| function () {},
					mouseDown_after	: args .mouseDown_after	|| function () {},
					mouseUp_pre		: args .mouseUp_pre		|| function () {},
					mouseUp_after	: args .mouseUp_after	|| function () {}
				};

 				return	this;
 			},
  
 			add : function () {
 				var	that	= this;
 
 				// initialize modules
 				if ( typeof this.module === "undefined" ) {
 					initModule.bind(this)();
 				}
 
 				// create form object. This contains $ objects mainly.

				// create form root. And the content element ebject relocate
				// under "form.rootObj". $iw(inner wrapper) and $ow(outer wrapper)
				// locate there too.
 				var form	= new hExplorizer.windowForm( this ),
 					id		= form.getFormId();
 				this.form[ id ]	= form;
				form = null;
				var _form	= this.form[ id ];

				_form .add();

				_form.$ct
					.data({
						"formId"	: id
					});

				_form.$ow
					.css({ "z-index" : id });

				// reset and add event listener for the new windowForm.
 				this.module.eventController
 					.set({
 						"callback" : this.initialize.bind(this)
 					})
 					.initialize();

				// it enables window-form to move by dragging. 
		//		this.module.locator
		//			.add();
								 
 				this.id++;
 				return	_form.$ct;
 			},
 
 			initialize : function ( id ) {
 				this.module.eventController
 					.initialize();
 
 				// 変更があったformのみにinitializeを絞るべき。
 				for ( var i = 0, l = this.form.length; i < l; i++) {
 					var form	= this.form[ i ];
 					form .initialize();
				}
 			},

			createDiv : function ( $target, Name, formId ) {
				$target
					.append(
					    "<div " +
							"class=\""+
								this.attrPrefix +  Name +
							"\" " +
							"id=\""+
								this.attrPrefix + formId +"_"+  Name +
							"\" " +
							hExplorizer.util.preventSelect +
					    ">" +
					    "</div>"	);
				return	$( "#" + this.attrPrefix + formId +"_"+  Name );
			},

			parser : function ( $target ) {
				var	str		= $target.attr("id").split("_"),
					formId	= str[2]-0,
					part	= str[3],
					elemId	= str[4]-0;

				return {
					"formId" : formId,
					"part"	 : part,
					"elemId" : ( typeof elemId !== "undefined" ) ? elemId : false
				}
			},

			get$ow : function ( formId ) {
				if ( arguments[0] === "all" || arguments.length === 0 ) {
					return $( "." + this.attrPrefix + this.lb.outrWrap );
				} else {
					return $( "#" + this.attrPrefix + formId + "_" + this.lb.outrWrap );
				}
			},

			get$iw : function ( formId ) {
				return $( "#" + this.attrPrefix + formId + "_" + this.lb.innrWrap );
			},

			get$ct : function ( formId ) {
				if ( arguments[0] === "all" || arguments.length === 0 ) {
					return $( "." + this.attrPrefix + this.lb.content );
				} else {
					return $( "#" + this.attrPrefix + formId + "_" + this.lb.content );
				}
			},

			get$elem : function ( formId, elemId ) {
				if ( arguments.length === 1 ) {
					return this.get$ct( formId ).children( "." + this.attrPrefix + this.lb.elem );
				} else if ( arguments[0] === "all" || arguments.length === 0 ) {
					return $( "." + this.attrPrefix + this.lb.elem );
				} else {
					return $( "#" + this.attrPrefix + formId + "_" + this.lb.outrWrap );
				}
			},

			preselectElem : function ( formId, elemId ) {
				$( "#" + this.attrPrefix + formId + "_" + this.lb.elem + "_" + elemId )
					.removeClass( this.lb.selected  )
					.removeClass( this.lb.preselect  )
					.addClass	( this.lb.preselect  );
			},

			selectElem : function ( formId, elemId ) {
				$( "#" + this.attrPrefix + formId + "_" + this.lb.elem + "_" + elemId )
					.removeClass( this.lb.selected  )
					.removeClass( this.lb.preselect  )
					.addClass	( this.lb.selected  );
			},

			unselectElem : function ( formId, elemId ) {
				$( "#" + this.attrPrefix + formId + "_" + this.lb.elem + "_" + elemId )
					.removeClass( this.lb.selected  )
					.removeClass( this.lb.preselect  )
					.addClass	( this.lb.unSelect  );
			},

			unselectAllElem : function () {
				$( "." + this.attrPrefix + this.lb.elem )
					.removeClass( this.lb.selected  )
					.removeClass( this.lb.preselect  )
					.addClass	( this.lb.unSelect  );
			},

			selectPropery : function ( formId, elemId ) {
				$( "." + this.lb.preselect )
					.removeClass( this.lb.preselect  )
					.addClass	( this.lb.selected  );
			},

			isSelect : function ( formId, elemId, includePre ) {
				includePre = true;
				return (
					$( "#" + this.attrPrefix + formId + "_" + this.lb.elem + "_" + elemId )
						.is( "."+this.lb.selected + ((includePre) ? ", ."+this.lb.preselect : "") )
				)
			},

			cb : function ( funcObj, handleName, argsArray ) {
				if ( typeof funcObj[ handleName ] !== "undefined" ) {
					return funcObj[ handleName ].apply(this, argsArray);
				}
			},

			// triggerDelayer ---------------------------------------------------------------------
			setTrigDelayer : function ( startX, startY, torelance, callback ) {
				this.mouseMove_delayer = function ( event ) {
					delayTrigger.bind(this)(
						event,
						startX, startY,
						torelance,
						callback
					);
				}.bind(this);
				$(window).bind( "mousemove", this.mouseMove_delayer	.bind(this) );
			},

			removeTrigDelayer : function ( event ) {
				$(window).unbind( "mousemove" );
			}
 		}
 	}());

	return NewExplorizer;
}());

})( hExplorizer );

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

(function( hExplorizer ) {

hExplorizer.resizer = (function(){
	var NewResizer = function () {};

	NewResizer.prototype = (function(){ 
		var	angleStr	= "top bottom left right top_left top_right bottom_left bottom_right",
			angleArray	= angleStr	.split(" "),
			protoMember = {},
			handle = {};
				
		handle.top = {
			css : function () {
				return {
					"top":		0	- this.handleWidth + this.topGap,
					"left": 	0,
					"width": 	this.width,
					"height":	this.handleWidth,
					"z-index":	this.zIndex,
					"cursor":	"n-resize"
				}
			},
			mouseMove : function (event) {  this.$t.css( handle.top.range.bind(this)(event)); },
			mouseUp : function (event) {
				this.$handle["left"]	.css({ "height": this.$t.height() - this.topGap });
				this.$handle["right"]	.css({ "height": this.$t.height() - this.topGap });
			},
			range : function (event) {
				var	_height, top, height, accTerm, attMax, attMin, divY, priority, nowTop;
				
				nowTop		= event.pageY - this.divY_Hnd_top;
				divY		= this.prevTop - nowTop;
				_height		= (this.height - this.borderWidthY) + divY;
				accTerm		= (nowTop < this.wrap.top);
				attMax		= (_height > this.limit.maxY);
				attMin		= (_height < this.limit.minY);
				priority	= ( (this.prevBottom - this.limit.maxY) > (this.wrap.top) )

				if ( accTerm || attMax ){
					if ( priority ){
						top	= this.prevBottom - this.limit.maxY - this.divY_Hnd_top;
						height	= this.height - (top - this.prevTop) - this.borderWidthY;
					} else if ( nowTop < this.wrap.top ){
						top	= this.wrap.top;
						height	= this.prevBottom - this.wrap.top - this.borderWidthY;
					}
				} else if ( attMin ){
					top		= this.prevBottom - this.limit.minY - this.borderWidthY;// - this.divY_Hnd_top;
					height	= this.limit.minY;
				} else {
					top		= nowTop;
					height	= this.height - (top - this.prevTop) - this.borderWidthY;
				}

				return { "top" : top, "height" : height };
			}
		},

		handle.bottom = {
			css : function () {
				return {
					"bottom":	0	- this.handleWidth + this.bottomGap,
					"left": 	0,
					"width": 	this.width,
					"height":	this.handleWidth,
					"cursor":	"s-resize",
					"z-index":	this.zIndex
				}
			},
			mouseMove : function (event) { this.$t.css( handle.bottom.range.bind(this)(event)); },
			mouseUp : handle.top.mouseUp,
			range : function (event) {
				var	_height, top, height, accTerm, attMax, attMin, divY, priority, nowTop;

				nowTop		= event.pageY - this.divY_Hnd_bottom;
				divY		= nowTop - this.prevBottom;
				_height		= ( this.height - this.borderWidthY ) + divY;
				accTerm		= (nowTop > this.wrap.bottom);
				attMax		= (_height > this.limit.maxY);
				attMin		= (_height < this.limit.minY);
				priority	= ( (this.prevTop + this.limit.maxY) < (this.wrap.bottom) );

				if ( accTerm || attMax ){
					if ( priority ){
						height	= this.limit.maxY;
					} else {
						height	= this.wrap.bottom - this.prevTop;
					}
				} else if ( attMin ){
					height	= this.limit.minY;
				} else {
					height	= _height;
				}

				return { "height" : height };
			}
		},

		handle.left = {
			css : function () {
				return {
					"top":		0 + this.topGap,
					"left": 	0 - this.handleWidth + this.leftGap,
					"width": 	this.handleWidth,
					"height":	this.height - this.topGap,
					"cursor":	"e-resize",
					"z-index":	this.zIndex
				}
			},
			mouseMove : function (event) { this.$t.css( handle.left.range.bind(this)(event)); },
			mouseUp : function (event) {
				this.$handle["top"]		.css({ "width" : this.$t.width() });
				this.$handle["bottom"]	.css({ "width" : this.$t.width() });
			},
			range : function (event) {
				var	_width, left, width, accTerm, attMax, attMin, divX, priority, nowLeft;

				nowLeft		= event.pageX - this.divX_Hnd_left;
				divX		= this.prevLeft - nowLeft;
				_width		= (this.width - this.borderWidthX) + divX;
				accTerm		= (nowLeft < this.wrap.left);
				attMax		= (_width > this.limit.maxX);
				attMin		= (_width < this.limit.minX);
				priority	= ( (this.prevRight - this.limit.maxX) > (this.wrap.left) )

				if ( accTerm || attMax ){
					if ( priority ){
						left	= this.prevRight - this.limit.maxX - this.divX_Hnd_left;
						width	= this.width - (left - this.prevLeft) - this.borderWidthX;
					} else if ( nowLeft < this.wrap.left ){
						left	= this.wrap.left;
						width	= this.prevRight - this.wrap.left - this.borderWidthX;
					}
				} else if ( attMin ){
					left	= this.prevRight - this.limit.minX - this.borderWidthX;// - this.divY_Hnd_top;
					width	= this.limit.minX;
				} else {
					left	= nowLeft;
					width	= this.width - (left - this.prevLeft) - this.borderWidthX;
				}

				return { "left" : left, "width" : width };
			}
		},

		handle.right = {
			css : function () {
				return {
					"top":		0 + this.topGap,
					"right":	0 - this.handleWidth + this.rightGap,
					"width": 	this.handleWidth,
					"height":	this.height - this.topGap,
					"cursor":	"w-resize",
					"z-index":	this.zIndex
				}
			},
			mouseMove : function (event) { this.$t.css( handle.right.range.bind(this)(event)); },
			mouseUp : handle.left.mouseUp,
			range : function (event) {
				var	_width, left, width, accTerm, attMax, attMin, divX, priority, nowLeft;

				nowLeft		= event.pageX - this.divX_Hnd_right;
				divX		= nowLeft - this.prevRight;
				_width		= ( this.width - this.borderWidthX ) + divX;
				accTerm		= (nowLeft > this.wrap.right);
				attMax		= (_width > this.limit.maxX);
				attMin		= (_width < this.limit.minX);
				priority	= ( (this.prevLeft + this.limit.maxX) < (this.wrap.right) );

				if ( accTerm || attMax ){
					if ( priority ){
						width	= this.limit.maxX;
					} else {
						width	= this.wrap.right - this.prevLeft;
					}
				} else if ( attMin ){
					width	= this.limit.minX;
				} else {
					width	= _width;
				}

				return { "width" : width };
			}
		},

		handle.top_left = {
			css : function () {
				return {
					"top":		0	- this.handleWidth + this.topGap,
					"left": 	0	- this.handleWidth + this.leftGap,
					"width": 	this.angleHandleSize,
					"height":	this.angleHandleSize,
					"cursor":	"nw-resize",
					"z-index":	this.zIndex + 1
				}
			},
			mouseMove : function (event) { handle.top.mouseMove.bind(this)(event);  handle.left.mouseMove.bind(this)(event); },
			mouseUp : function (event) { handle.top.mouseUp.bind(this)(event);  handle.left.mouseUp.bind(this)(event); }
		},

		handle.top_right = {
			css : function () {
				return {
					"top":		0	- this.handleWidth + this.topGap,
					"right":	0	- this.handleWidth + this.rightGap,
					"width": 	this.angleHandleSize,
					"height":	this.angleHandleSize,
					"cursor":	"ne-resize",
					"z-index":	this.zIndex + 1
				}
			},
			mouseMove : function (event) { handle.top.mouseMove.bind(this)(event);  handle.right.mouseMove.bind(this)(event); },
			mouseUp : handle.top_left.mouseUp
		},

		handle.bottom_left = {
			css : function () {
				return {
					"bottom":	0	- this.handleWidth + this.bottomGap,
					"left": 	0	- this.handleWidth + this.leftGap,
					"width": 	this.angleHandleSize,
					"height":	this.angleHandleSize,
					"cursor":	"sw-resize",
					"z-index":	this.zIndex + 1
				}
			},
			mouseMove : function (event) { handle.bottom.mouseMove.bind(this)(event);  handle.left.mouseMove.bind(this)(event); },
			mouseUp : handle.top_left.mouseUp
		},

		handle.bottom_right = {
			css : function () {
				return {
					"bottom":	0	- this.handleWidth + this.bottomGap,
					"right":	0	- this.handleWidth + this.rightGap,
					"width": 	this.angleHandleSize,
					"height":	this.angleHandleSize,
					"cursor":	"se-resize",
					"z-index":	this.zIndex + 1
				}
			},
			mouseMove : function (event) { handle.bottom.mouseMove.bind(this)(event);  handle.right.mouseMove.bind(this)(event); },
			mouseUp : handle.top_left.mouseUp
		}

		function mouseDown_common ( x, y, angle ){
			var w	= this.$wrapper,
				wos	= w.offset();
			
			this.width			= this.$t.outerWidth(true);
			this.height			= this.$t.outerHeight(true);			
			this.prevTop		= this.$t.offset().top;
			this.prevLeft		= this.$t.offset().left;
			this.prevBottom	= this.prevTop + this.height;
			this.prevRight		= this.prevLeft + this.width;
			this.wrap	= {
				top 	: wos.top,
				bottom	: wos.top + w.height(),
				left 	: wos.left,
				right	: wos.left + w.width()
			};
			this.divX_Hnd_left		= x - this.prevLeft; // divasion from handle central axis. 
			this.divX_Hnd_right		= x - this.prevLeft - this.width; // divasion from handle central axis. 
			this.borderWidthX		= (	parseInt(this.$t.css("border-left-width")) +
										parseInt(this.$t.css("border-right-width"))	);
			this.divY_Hnd_top		= y - this.prevTop; // divasion from handle central axis. 
			this.divY_Hnd_bottom	= y - this.prevBottom; // divasion from handle central axis. 
			this.borderWidthY		= (	parseInt(this.$t.css("border-top-width")) +
										parseInt(this.$t.css("border-bottom-width")) );

			this.event.mouseMove[ angle ] = function (event) {
				handle[ angle ].mouseMove.bind(this)(event);
			}.bind(this);
			$(window).bind( "mousemove", this.event.mouseMove[ angle ] );
			
			this.event.mouseUp = protoMember.mouseUpEvent || function (event) {
				$(window)
					.unbind( "mouseup",	this.event.mouseUp );					
				handle[ angle ].mouseUp.bind(this)(event, this);
				this.callback.end();
			}.bind(this);
			$(window).bind( "mouseup", this.event.mouseUp );			
		}

		function createHandleDiv ( angle ) {
			this.$t
				.append(
				    "<div " +
						"class=\"" +
							this.clsName +" "+
							"hnd_" + angle +
						"\" " +
						"id=\"" +
							this.clsName +"_"+ angle +"_"+ this.id +
						"\" " +
						hExplorizer.util.preventSelect +
				    ">" +
				    "</div>"
				);
			return this.$t .children( "." + this.clsName ) .filter( ".hnd_" + angle );
		} 

		function setCss ( angle ) {
			this.$handle[ angle ].css( handle[ angle ].css.bind(this)() );
		}

		function setMouseDown ( angle ) {
			var that = this;
			this.event.mouseDown[ angle ] = function (event) {
				event.stopPropagation();
				mouseDown_common.bind(that)( event.pageX, event.pageY, angle );
				this.callback.start();
			}.bind(this);
						
			this.$handle[ angle ]
				.bind( "mousedown",	this.event.mouseDown[ angle ].bind(this) );
		}
		
		return {
			set : function (args) {
				args = args || { gap:null, limit:null };

				this.$wrapper			= args	.wrapper;
				this.clsName			= args	.clsName		|| "hd_ex_resize";
				this.id					= String( args.id )		|| null;
				this.angle				= args	.angle			|| angleStr;
				this.handleWidth		= args	.handleWidth	|| 15;
				this.angleHandleSize	= args	.angleHandleSize|| 15;
				this.zIndex				= args	.zIndex			|| 0;
				this.leftGap	= (typeof args	.leftGap !== "number") 	? 0 : args.leftGap,
				this.rightGap	= (typeof args	.rightGap !== "number")	? 0 : args.rightGap,
				this.topGap		= (typeof args	.topGap !== "number")	? 0 : args.topGap,
				this.bottomGap	= (typeof args	.bottomGap !== "number")? 0 : args.bottomGap
				this.limit		= {
					maxX	: args	.maxX,
					maxY	: args	.maxY,
					minX	: (typeof args.minX !== "number") ? 50 : args.minX,
					minY	: (typeof args.minY !== "number") ? 50 : args.minY
				};

				this.callback	= {
					start	: args .start	|| function(){},
					end		: args .end		|| function(){}
				};
				
				return	this;
			},

			add : function( $target ){
				this.$t	= $target;
				this.$handle = {};
				this.event = { mouseDown:{}, mouseMove:{}, mouseUp:{} };

				this.width	= this.$t.outerWidth(true);
				this.height	= this.$t.outerHeight(true);

				for ( var i=0, a=this.angle.split(" "), l=a.length; i<l; i++ ){
					var angle = String( a[i] );
					this.$handle[ angle ] = createHandleDiv.bind(this)( angle );
					setCss.bind(this)( angle );
					setMouseDown.bind(this)( angle );
				}
			
				return	this;
			}
		} //return
	}()); //prototype

	return NewResizer;
}()); //resize

})( hExplorizer );

(function( hExplorizer ) {

hExplorizer.selector = (function () {
	function NewSelector( root ) {
		this.root	= root;
		this.timer	= {};
	}

	NewSelector.prototype = (function () {
		var slctBoxId = "slctBox";

		function byDrag (
			event,
			startX, startY,
			wrapLeft, wrapTop, wrapHeight,
			xt, yt,
			$iw, $elem
		) {
			var	scrX	= $iw.scrollLeft(),
				scrY	= $iw.scrollTop(),

				xn		= event.pageX - wrapLeft,
				yn		= event.pageY - wrapTop,
				xns		= xn + scrX,
				yns		= yn + scrY,
				t;

			// calculate and limit range.
			if		(xns > xt)	{ xns = xt }
			else if	(xns < 0)	{ xns = 0 } 
			if		(yns > yt)	{ yns = yt }
			else if (yns < 0)	{ yns = 0 } 

			if		(startX > xns) { t = xns; xns = startX; startX = t; }
			if		(startY > yns) { t = yns; yns = startY; startY = t; }

			// scroll function for the browser who don't have auto-scroll func. ex ie, opera

			if ( this.root.autoScroll ) {
				if		(yn < 0) 			{ scrollCt.bind(this)( $iw, yn*this.root.scrollWeight ); }
				else if	(yn > wrapHeight)	{ scrollCt.bind(this)( $iw, (yn - wrapHeight)*this.root.scrollWeight ); }
				else						{ stopScrollCt.bind(this)(); } 
			}
			// draw a box that shows selecting range.
			this.$box
				.css({
					"left"	: startX,
					"top"	: startY,
					"width"	: xns-startX,
					"height": yns-startY });

			// determinate whether or not elements are in range
			for ( var i = 0, l = $elem.length; i < l; i++) {
				var $e		= $elem.eq( i ),
					pos		= $e.position();

				var	left	= pos.left	+ parseInt( $e.css( "margin-left" ) ),
					right	= pos.left	+ parseInt( $e.css( "margin-left" ) )	+ $e.width(),
					top		= pos.top	+ parseInt( $e.css( "margin-top" ) )	+scrY,
					bottom	= pos.top	+ parseInt( $e.css( "margin-top" ) )	+scrY+ $e.height();

				// in range?
				var	outRange	= ( left > xns || right < startX || top > yns || bottom < startY );
				if ( !outRange ) {
					$e	.removeClass( this.root.lb.unSelect  )
						.removeClass( this.root.lb.selected  )
						.removeClass( this.root.lb.preselect  )
						.addClass	( this.root.lb.preselect  );
					
				//	this.root.preselectElem( $e );
				// this.selectElem( $e );
				} else {
					if ( !event.ctrlKey && !event.shiftKey ) {
						$e	.removeClass( this.root.lb.selected  )
							.removeClass( this.root.lb.preselect  )
							.addClass	( this.root.lb.unSelect  );
					//	this.root.unselectElem($e);
					}
				}
			}
		}

		function scrollCt ( $iw, val ) {
			if ( this.timer === null || val !== this._preVal) {
				clearInterval(this.timer);
				this.timer	= setInterval(function () {//
					$iw.scrollTop( $iw.scrollTop() + val ); 
				}.bind(this), 1);
				this._preVal	= val;
			}
		}

		function stopScrollCt () {
			clearInterval(this.timer);
			this.timer = null;
		}
		
		function removeBox () {
			if ( this.$box ) this.$box.remove();
		}
		
		return {				
			setParam : function (args) {
				args = args || {};

 				this.timer		= {};
 				this.param		= {};
 				this.$preselect	= [];

				this.autoScroll		= args	.autoScroll		|| ( util.browser.ie || util.browser.opera );
				this.scrollWeight	= ( typeof args .scrollWeight === "undefined" )	? 1 : args. scrollWeight;

				return	this;
			},

	        onElem : function ( ctrlKey, shiftKey, formId, clickedId, cb ) {	        	
				var	p1, p2, i,
					isSelect = this.root.isSelect( formId, clickedId );
									
				if ( shiftKey ) {
		            // shiftを押しながら選択した場合、
		            // もしリセット後初めて押したのなら、その1つ前の選択を基点にする。   // 2回目以降であれば、基点は変えない。
		            if ( !this.prevShift ) {
		            	this.startId	= this.prevClicked;
		            }
		            
		            if ( this.startId > clickedId ) {
		            	p1 = clickedId,
		            	p2 = this.startId;
		            } else {
		            	p1 = this.startId,
		            	p2 = clickedId;
		            }
		            
		            if ( !ctrlKey ) this.root.unselectAllElem();
		            
		            for ( var i = p1, counter = 0; i <= p2; ++i ) {
						this.root.preselectElem( formId, i );
					}
					
					this.root.cb( cb, "selectWithShift", [ formId, clickedId ] );
				} else if ( ctrlKey ) {
					if ( isSelect ) { 
						this.root.unselectElem( formId, clickedId );
						this.root.cb( cb, "unselectByCtrl", [ formId, clickedId ] );
					} else {
						this.root.preselectElem( formId, clickedId );
						this.root.cb( cb, "preselectByCtrl", [ formId, clickedId ] );
			     	}
				} else if ( !ctrlKey ) {
					if ( isSelect ) { 
						this.root.cb( cb, "downOnSelected", [ formId, clickedId ] );
			   		} else {
						this.root.unselectAllElem();
						this.root.preselectElem( formId, clickedId );
						this.root.cb( cb, "preselect", [ formId, clickedId ] );
					}
				}
				this.prevClicked = clickedId;
		        this.prevShift = shiftKey;
			},

			onBack : function ( x, y, formId ) {				
				var	$ow			= this.root.get$ow( formId ),
					$iw			= this.root.get$iw( formId ),
					$ct			= this.root.get$ct( formId ),
					$elem		= this.root.get$elem( formId );
				
				this.noSelect	= true;
				
				// The following logic prevent the status changes into "byDrag" that is caused immediately, 
				// so as to keep the status "mouseDownonNonElement" in case of selecting no elements eventually.
				this.root.setTrigDelayer( x, y, 1, function () {
					var wrapPos		= $ow.position(),
						wrapHeight	= $ow.outerHeight(),
						wrapScrLeft	= $iw.scrollLeft(),
						wrapScrTop	= $iw.scrollTop(),
						fieldWidth	= $ct.width(),
						fieldHeight	= $ct.height(),

						wrapLeft	= wrapPos.left,
						wrapTop		= wrapPos.top,
						startX		= x - wrapLeft + wrapScrLeft,
						startY		= y - wrapTop + wrapScrTop,
						wrapBottom	= wrapTop + wrapHeight,
						xt			= fieldWidth	-2,
						yt			= fieldHeight	-2;

					this.noSelect	= false;
				
					this.$box = this.root.createDiv(
						$ct,
						slctBoxId,
						formId,
						hExplorizer.util.preventSelect
					);

					// bind new mousemove event.
					this.mouseMove_drag	= function ( event ) {
						byDrag.bind(this)(
							event,
							startX, startY,
							wrapLeft, wrapTop, wrapHeight,
							xt, yt,
							$iw, $elem
						);
					}.bind(this);

					$(window)
						.bind( "mousemove", this.mouseMove_drag );
				}.bind(this) );
			},

			mouseUp : function () {	        	
				stopScrollCt.bind(this)();
				removeBox.bind(this)();
				if	( this.noSelect ) this.root.unselectAllElem();
				this.noSelect	= false;
				return this;
			}
	    }
	}());

	return	NewSelector;
}());

})( hExplorizer );

(function( hExplorizer ) {

hExplorizer.titleBar = (function () {
	function NewTitleBar( root ) {
		this.root = root;	
	}

	NewTitleBar.prototype = (function () {
		var titleBar	= "titleBar",
			removeBtn 	= "removeBtn",
			titleSpace 	= "titleSpc";

		function adjustLocation () {
			this.$bar
				.css({
					"position"	: "absolute",
					"width"		: "100%",
					"height"	: this.root.tBarHeight });
		}

		return {
			add : function ( formId ) {				
				this.$bar	= this.root.createDiv(
					this.root.get$ow( formId ),
					titleBar,
					formId
				);
				
				this.$removeBtn = this.root.createDiv(
					this.$bar,
					removeBtn,
					formId
				);
				
				adjustLocation.bind(this)();

				return	this.$bar;
			},
			
			get$titleBar : function ( formId ) {
				if ( arguments[0] === "all" || arguments.length === 0 ) {
					return $( "." + this.root.attrPrefix + titleBar );
				} else {
					return $( "#" + this.root.attrPrefix + formId + "_" + titleBar );
				}
			}
	    }
	}());

	return	NewTitleBar;
}());

})( hExplorizer );

window.hExplorizer = hExplorizer;
})(window);
﻿
