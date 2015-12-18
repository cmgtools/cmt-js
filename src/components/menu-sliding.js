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
			
			if( null != settings.showTrigger ) {

				cmtjq( settings.showTrigger ).click( function() {
	
					menu.fadeIn();
	
					var slider	= menu.find( '.vnav-slider' );
	
					if( settings.position == 'left' ) {
						
						slider.animate( { left: 0 } );
					}
					else if( settings.position == 'right' ) {
	
						slider.animate( { right: 0 } );
					}
				});
			}

			if( null != settings.hideTrigger ) {

				cmtjq( settings.hideTrigger ).click( function() {
	
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

			// Filler Layer to listen for close
			var bkgFiller	= menu.find( ".popup-bkg-filler" );

			if( bkgFiller.length > 0 ) {

				bkgFiller.css( { 'top': '0px', 'left': '0px', 'height': documentHeight, 'width': screenWidth } );

				bkgFiller.click( function() {

					menu.fadeOut( "fast" );
				});
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtSlidingMenu.defaults = {
		position: 'left',
		showTrigger: null,
		hideTrigger: null,
		mainMenu: false
	};

}( jQuery ) );