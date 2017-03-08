/**
 * Collapsible Menu plugin used to manage collapsible parent with our without children.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtCollapsibleMenu = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 	= cmtjq.extend( {}, cmtjq.fn.cmtCollapsibleMenu.defaults, options );
		var menus		= this;

		// Iterate and initialise all the menus
		menus.each( function() {

			var menu = cmtjq( this );

			init( menu );
		});

		// return control
		return;

		// == Private Functions == //

		function init( menu ) {

			menu.find( '.collapsible-tab.has-children' ).click( function() {

				var tab		= jQuery( this );
				var content = tab.children( '.tab-content' );

				// Expand only disabled tabs and keep active expanded
				if( !tab.hasClass( 'active' ) ) {

					if( !tab.hasClass( 'expanded' ) ) {

						// Slide Down Slowly
						tab.addClass( 'expanded' );
						content.slideDown( 'slow' );
					}
					else {

						// Slide Up Slowly
						tab.removeClass( 'expanded' );
						content.slideUp( 'slow' );
					}
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtCollapsibleMenu.defaults = {
		// options
	};

})( jQuery );