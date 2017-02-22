/**
 * Icon Picker is jQuery plugin to pick an icon from various icon libraries. It works together with
 * Icon Picker Plugin of CMSGears.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtIconPicker = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtIconPicker.defaults, options );
		var pickers			= this;

		// Iterate and initialise all the pickers
		pickers.each( function() {

			var picker = cmtjq( this );

			init( picker );
		});

		// return control
		return;

		// == Private Functions == //

		function init( picker ) {

			picker.find( '.choose-icon' ).click( function() {

				var element = jQuery( this );

				if( !element.hasClass( 'disabled' ) ) {

					picker.find( '.icon-sets' ).slideToggle( 'slow' );
				}
			});

			picker.find( '.icon-sets .wrap-icon' ).click( function() {

				var element 	= jQuery( this );
				var iconSets	= picker.find( '.icon-sets' );
				var sIcon		= element.find( '.picker-icon' );
				var iconClass	= 'picker-icon ' + sIcon.attr( 'icon' );
				var tIcon		= picker.find( '.choose-icon' );
				tIcon			= tIcon.find( '.picker-icon' );

				tIcon.attr( 'class', iconClass );

				picker.find( '.icon-field' ).val( sIcon.attr( 'icon' ) );

				iconSets.slideToggle( 'slow' );
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtIconPicker.defaults = {
		// default config
	};

})( jQuery );