/**
 * Sidebar plugin used to manage collapsible parent with our without children.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtCollapsibleMenu = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtCollapsibleMenu.defaults, options );
		var sidebars		= this;

		// Iterate and initialise all the fox sliders
		sidebars.each( function() {

			var sidebar = cmtjq( this );

			init( sidebar );
		});

		// return control
		return;

		// == Private Functions == //

		function init( sidebar ) {

			// Initialise Sidebar Accordion
			sidebar.find( '.collapsible-tab.has-children' ).click( function() {

				var child = jQuery( this ).children( '.collapsible-tab-content' );

				if( !jQuery( this ).hasClass( 'active' ) ) {

					if( !child.hasClass( 'expanded' ) ) {

						// Slide Down Slowly
						jQuery( this ).addClass( 'pactive' );
						child.addClass( 'expanded' );
						child.slideDown( 'slow' );
					}
					else {

						// Slide Up Slowly
						jQuery( this ).removeClass( 'pactive' );
						child.removeClass( 'expanded' );
						child.slideUp( 'slow' );
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