/**
 * Tabs plugin can be used to for tabs arrangement.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtTabs = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtTabs.defaults, options );
		var tabPanels		= this;

		// Iterate and initialise all the tabs
		tabPanels.each( function() {

			var tabPanel = cmtjq( this );

			init( tabPanel );
		});

		// return control
		return;

		// == Private Functions == //

		function init( tabPanel ) {

			var links	= tabPanel.find( '.tab-link' );
			var tabs	= tabPanel.find( '.tab-content' );

			// Activate first
			jQuery( links[ 0 ] ).addClass( 'active' );
			jQuery( tabs[ 0 ] ).addClass( 'active' );
			jQuery( tabs[ 0 ] ).fadeIn( 'slow' );

			// Listen click
			links.click( function() {

				var target = jQuery( this ).attr( 'target' );

				// Deactivate
				links.removeClass( 'active' );
				tabs.removeClass( 'active' );
				tabs.hide();

				// Activate
				jQuery( this ).addClass( 'active' );
				jQuery( target ).addClass( 'active' );
				jQuery( target ).fadeIn( 'slow' );
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtTabs.defaults = {
		// default config
	};

})( jQuery );
