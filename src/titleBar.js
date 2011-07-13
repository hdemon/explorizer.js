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
