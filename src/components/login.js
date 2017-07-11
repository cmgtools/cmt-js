/**
 * Login & Register can be used to toggle between login, register and forgot-password forms.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtLoginRegister = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtLoginRegister.defaults, options );
		var boxes			= this;

		// Iterate and initialise all the pickers
		boxes.each( function() {

			var box = cmtjq( this );

			init( box );
		});

		// return control
		return;

		// == Private Functions == //

		function init( box ) {

			var loginBox	= box.find( '.box-login' );
			var signupBox	= box.find( '.box-signup' );
			var forgotBox	= box.find( '.box-forgot' );

			box.find( '.btn-login' ).click( function( event ) {

				event.preventDefault();

				if( loginBox.is( ':visible' ) ) {

					loginBox.slideUp( 'fast' );
				}
				else {
					signupBox.slideUp( 'fast' );
					forgotBox.slideUp( 'fast' );

					loginBox.slideDown( 'slow' );
				}
			});

			box.find( '.btn-forgot' ).click( function( event ) {

				event.preventDefault();

				if( forgotBox.is( ':visible' ) ) {

					forgotBox.slideUp( 'fast' );
				}
				else {

					signupBox.slideUp( 'fast' );
					loginBox.slideUp( 'fast' );

					forgotBox.slideDown( 'slow' );
				}
			});

			box.find( '.btn-signup' ).click( function( event ) {

				event.preventDefault();

				if( signupBox.is( ':visible' ) ) {

					signupBox.slideUp( 'fast' );
				}
				else {
					loginBox.slideUp( 'fast' );
					forgotBox.slideUp( 'fast' );

					signupBox.slideDown( 'slow' );
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtLoginRegister.defaults = {
		// default config
	};

})( jQuery );
