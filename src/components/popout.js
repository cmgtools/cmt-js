/**
 * The Popout Group plugin can be used to show popouts using popout trigger.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtPopoutGroup = function( options ) {

		// == Init == //

		// Configure Popups
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtPopoutGroup.defaults, options );
		var elements		= this;

		// Iterate and initialise all the popups
		elements.each( function() {

			var element	= cmtjq( this );

			init( element );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Element
		function init( popoutGroup ) {

			var trigger	= popoutGroup.find( '.popout-trigger' );

			trigger.click( function() {

				trigger.removeClass( 'active' );

				jQuery( this ).addClass( 'active' );

				var popoutId		= "#" + jQuery( this ).attr( 'popout' );
				var targetPopout 	= jQuery( popoutId );

				if( targetPopout.is( ':visible' ) ) {

					jQuery( this ).removeClass( 'active' );

					switch( settings.animation ) {

						case "down": {

							targetPopout.slideUp();

							break;
						}
					}
				}
				else {

					popoutGroup.find( '.popout' ).hide();

					switch( settings.animation ) {

						case "down": {

							targetPopout.slideDown();

							break;
						}
					}
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtPopoutGroup.defaults = {
		animation: "down"
	};

})( jQuery );
