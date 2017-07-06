/**
 * Form Info is a small plugin to flip form information and form fields. The form information can be formed only by labels whereas fields can be formed using labels and form elements.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtFormInfo = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtFormInfo.defaults, options );
		var forms			= this;

		// Iterate and initialise all the menus
		forms.each( function() {

			var form = cmtjq( this );

			init( form );
		});

		// return control
		return;

		// == Private Functions == //

		function init( form ) {

			form.find( '.box-form-trigger' ).click( function() {

				var parent	= jQuery( this ).closest( '.box-form' );
				var info 	= parent.find( '.box-form-info-wrap' );
				var content = parent.find( '.box-form-content-wrap' );

				if( info.is( ':visible' ) ) {

					info.hide();
					content.fadeIn( 'slow' );
				}
				else {

					info.fadeIn( 'fast' );
					content.hide();
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtFormInfo.defaults = {
		// default config
	};

})( jQuery );
