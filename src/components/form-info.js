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

			form.find( ".btn-edit" ).click( function() {

				var info = jQuery( this ).parent().find( ".wrap-info" );
				var form = jQuery( this ).parent().find( ".wrap-form" );

				if( info.is( ":visible" ) ) {

					info.hide();
					form.fadeIn( "slow" );
				}
				else {

					info.show();
					form.fadeOut( "slow" );			
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtFormInfo.defaults = {
		// default config
	};

}( jQuery ) );