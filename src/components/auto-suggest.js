/**
 * Auto Suggest is jQuery plugin which change the default behaviour of input field. It shows
 * auto suggestions as user type and provide options to select single or multiple values.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtAutoSuggest = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtAutoSuggest.defaults, options );
		var fields			= this;

		// Iterate and initialise all the fields
		fields.each( function() {

			var field = cmtjq( this );

			init( field );
		});

		// return control
		return;

		// == Private Functions == //

		function init( field ) {

			// TODO: add logic to handle single and multi selects
		}
	};

	// Default Settings
	cmtjq.fn.cmtAutoSuggest.defaults = {
		// default config
	};

})( jQuery );