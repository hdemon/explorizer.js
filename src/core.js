(function( hExplorizer ) {

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
						"start"			: function(){
							resetCtSize.bind(this)();
							this.root.module.aligner
								.setFocus( this.formId );
						}.bind(this),
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
