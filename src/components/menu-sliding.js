( function( cmtjq ) {

	cmtjq.fn.cmtSlidingMenu = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtSlidingMenu.defaults, options );
		var menus			= this;

		// Iterate and initialise all the menus
		menus.each( function() {

			var menu = cmtjq( this );

			init( menu );
		});

		// return control
		return;

		// == Private Functions == //

		function init( menu ) {
			
			if( settings.mainMenu ) {

				var documentHeight 	= cmtjq( document ).height();
				var screenWidth		= cmtjq( window ).width();

				// Parent to cover document
				menu.css( { 'top': '0px', 'left': '0px', 'height': documentHeight, 'width': screenWidth } );
			}

			cmtjq( settings.trigger ).click( function() {

				menu.fadeIn();

				var slider	= menu.find( '.vnav-slider' );

				if( settings.position == 'left' ) {
					
					slider.animate( { left: 0 } );
				}
				else if( settings.position == 'right' ) {

					slider.animate( { right: 0 } );
				}
			});
			
			menu.find( '.btn-close' ).click( function() {
				
				menu.fadeOut();
				
				var slider	= menu.find( '.vnav-slider' );

				if( settings.position == 'left' ) {

					slider.animate( { left: -( slider.width() ) } );
				}
				else if( settings.position == 'right' ) {
					
					slider.animate( { right: -( slider.width() ) } );
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtSlidingMenu.defaults = {
		position: 'left',
		trigger: null,
		mainMenu: false
	};

}( jQuery ) );