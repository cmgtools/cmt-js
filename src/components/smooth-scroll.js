/**
 * Smooth Scroll plugin can be used to listen for hash tags to scroll smoothly to pre-defined page sections.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtSmoothScroll = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtSmoothScroll.defaults, options );
		var elements		= this;

		// Iterate and initialise all the page modules
		elements.each( function() {

			var element	= cmtjq( this );

			init( element );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Element
		function init( element ) {

			element.on( 'click', function ( e ) {

				var targetId	= this.hash;

				// Process only if hash is set
				if ( null != targetId && targetId.length > 0 ) {

					// Prevent default anchor behavior
			    	e.preventDefault();

					// Find target element
			    	var target 	= cmtjq( targetId );

			    	cmtjq( 'html, body' ).stop().animate(
			    		{ 'scrollTop': ( target.offset().top ) },
			    		900,
			    		'swing',
			    		function () {

							// Add hash to url
				        	window.location.hash = targetId;
			    		}
			    	);
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtSmoothScroll.defaults = {

	};

})( jQuery );
