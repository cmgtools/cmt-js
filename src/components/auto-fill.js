/**
 * Auto Suggest is jQuery plugin which change the default behaviour of input field. It shows
 * auto suggestions as user type and provide options to select single or multiple values.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtAutoFill = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtAutoFill.defaults, options );
		var fillers			= this;

		// Iterate and initialise all the fillers
		fillers.each( function() {

			var filler = cmtjq( this );

			init( filler );
		});

		// return control
		return;

		// == Private Functions == //

		function init( filler ) {

			// TODO: add logic to handle single and multi selects

			// Auto Fill
			filler.find( '.auto-fill-text' ).blur( function() {

				var wrapFill	= jQuery( this ).closest( '.wrap-fill' );

				wrapFill.find( '.wrap-auto-list' ).slideUp();

				// Clear fields
				wrapFill.find( '.fill-clear' ).val( '' );
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtAutoFill.defaults = {
		// default config
	};

})( jQuery );