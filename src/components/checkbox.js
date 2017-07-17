/**
 * It's a custom checkbox plugin used to make origin checkbox submit value everytime.
 */

( function( cmtjq ) {

// TODO: Add option for multi select

	cmtjq.fn.cmtCheckbox = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtCheckbox.defaults, options );
		var checkboxes		= this;

		// Iterate and initialise all the fox sliders
		checkboxes.each( function() {

			var checkbox = cmtjq( this );

			init( checkbox );
		});

		// return control
		return;

		// == Private Functions == //

		function init( checkbox ) {

			if( checkbox.is( '[disabled]' ) ) {

				return;
			}

			var field 	= checkbox.find( "input[type='checkbox']" );
			var input 	= checkbox.find( "input[type='hidden']" );

			if( input.val() == 1 ) {

				field.prop( 'checked', true );
				field.val( 1 );
			}

			field.change( function() {

				if( field.is( ':checked' ) ) {

 					input.val( 1 );
					field.val( 1 );
 				}
 				else {

 					input.val( 0 );
					field.val( 0 );
 				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtCheckbox.defaults = {
		// options
	};

})( jQuery );