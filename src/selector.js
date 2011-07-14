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
