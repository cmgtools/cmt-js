/*
 * Dependencies: jquery
 */

( function( cmt ) {

	cmt.fn.cmtSmoothScroll = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmt.extend( {}, cmt.fn.cmtSmoothScroll.defaults, options );
		var elements		= this;

		// Iterate and initialise all the page modules
		elements.each( function() {

			var element	= cmt( this );

			init( element );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Element
		function init( element ) {

			element.on( 'click', function ( e ) {

			    e.preventDefault();

			    var targetId 	= this.hash;
			    var target 		= cmt( targetId );
		
			    jQuery('html, body').stop().animate(
			    	{ 'scrollTop': ( target.offset().top ) }, 
			    	900, 
			    	'swing', 
			    	function () {
		
				        window.location.hash = targetId;				        
			    	}
			    );
			});
		}
	};

	// Default Settings
	cmt.fn.cmtSmoothScroll.defaults = {

	};

}( jQuery ) );