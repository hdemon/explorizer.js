(function(hdemon) {

var util;
util = (function() {
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
}());

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

hdemon.util = util;
})(hdemon);
