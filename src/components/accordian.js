/**
 * Accordian plugin can be used to for accordian to control multiple elements with header.
 * Only one element will have active view.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtAccordian = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 	= cmtjq.extend( {}, cmtjq.fn.cmtAccordian.defaults, options );
		var accordians	= this;

		// Iterate and initialise all the accordians
		accordians.each( function() {

			var accordian = cmtjq( this );

			init( accordian );
		});

		// return control
		return;

		// == Private Functions == //

		function init( accordian ) {

			var triggers	= accordian.find( '.accordian-trigger' );
			var views		= accordian.find( '.accordian-view' );

			views.hide();

			// Activate first
			if( settings.showFirst ) {

				jQuery( views[ 0 ] ).addClass( 'active' );
				jQuery( views[ 0 ] ).slideDown( 'slow' );
			}

			// Listen click
			triggers.click( function() {
				
				var trigger		= jQuery( this );
				var view		= trigger.next( '.accordian-view' );
				var activeView	= accordian.find( '.accordian-view.active' );

				if( trigger.hasClass( 'active' ) ) {
					
					trigger.removeClass( 'active' );
					activeView.removeClass( 'active' );
					
					activeView.slideUp( 'slow' );
				} 
				else {

					// Deactivate
					activeView.slideUp( 'slow' );

					activeView.removeClass( 'active' );
					triggers.removeClass( 'active' );

					// Activate
					jQuery( this ).addClass( 'active' );
					jQuery( view ).addClass( 'active' );
					view.slideDown( 'slow' );
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtAccordian.defaults = {
		showFirst: false
	};

})( jQuery );
