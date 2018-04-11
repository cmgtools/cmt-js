/**
 * CmtFieldGroup plugin allows to show/hide group of fields using checkbox within the element.
 */

( function( cmtjq ) {

// TODO: Add option for multi select

	cmtjq.fn.cmtFieldGroup = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtFieldGroup.defaults, options );
		var fieldGroups		= this;

		// Iterate and initialise all the fox sliders
		fieldGroups.each( function() {

			var fieldGroup = cmtjq( this );

			init( fieldGroup );
		});

		// return control
		return;

		// == Private Functions == //

		function init( fieldGroup ) {

			var checkbox = fieldGroup.find( "input[type='checkbox']" );

			if( checkbox.prop( 'checked' ) ) {

				var target	= fieldGroup.attr( 'group-target' );
				var alt		= fieldGroup.attr( 'group-alt' );

				jQuery( '.' + target ).show();
				jQuery( '.' + alt ).hide();
			}
			else {

				var target	= fieldGroup.attr( 'group-target' );
				var alt		= fieldGroup.attr( 'group-alt' );

				jQuery( '.' + target ).hide();
				jQuery( '.' + alt ).show();
			}

			fieldGroup.click( function() {

				if( checkbox.prop( 'checked' ) ) {

					var target	= fieldGroup.attr( 'group-target' );
					var alt		= fieldGroup.attr( 'group-alt' );

					jQuery( '.' + target ).fadeIn( 'slow' );
					jQuery( '.' + alt ).fadeOut( 'fast' );
				}
				else {

					var target	= fieldGroup.attr( 'group-target' );
					var alt		= fieldGroup.attr( 'group-alt' );

					jQuery( '.' + alt ).fadeIn( 'slow' );
					jQuery( '.' + target ).fadeOut( 'fast' );
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtFieldGroup.defaults = {
		// options
	};

})( jQuery );