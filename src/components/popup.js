/*
 * Dependencies: jquery
 */
( function( cmtjq ) {

	cmtjq.fn.cmtPopup = function( options ) {

		// == Init == //

		// Configure Popups
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtPopup.defaults, options );
		var elements		= this;
		var documentHeight 	= cmtjq( document ).height();
		var screenHeight	= cmtjq( window ).height();
		var screenWidth		= cmtjq( window ).width();

		// Iterate and initialise all the popups
		elements.each( function() {

			var element	= cmtjq( this );

			init( element );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Element
		function init( popup ) {

			var popupData = popup.children( ".popup-data" );

			// Close Listener
			popupData.children( ".popup-close" ).click( function() {

				popup.fadeOut( "slow" );
			});

			// Modal Window
			if( settings.modal ) {

				// Parent to cover document
				popup.css( { 'top': '0px', 'left': '0px', 'height': documentHeight, 'width': screenWidth } );
				
				// Background
				var bkg			= popup.find( ".popup-bkg" );
				
				if( bkg.length > 0 ) {
					
					bkg.css( { 'top': '0px', 'left': '0px', 'height': screenHeight, 'width': screenWidth } );
				}

				// Filler Layer to listen for close
				var bkgFiller	= popup.find( ".popup-bkg-filler" );

				if( bkgFiller.length > 0 ) {

					bkgFiller.css( { 'top': '0px', 'left': '0px', 'height': screenHeight, 'width': screenWidth } );
					
					bkgFiller.click( function() {
						
						popup.fadeOut( "fast" );
					});
				}

				// Child at center of parent
				popup.show(); // Need some better solution if it shows flicker effect

				var popupDataHeight	=  popupData.height();
				var popupDataWidth	=  popupData.width();

				popup.hide();

				popupData.css( { 'top': screenHeight/2 - popupDataHeight/2, 'left': screenWidth/2 - popupDataWidth/2 } );
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtPopup.defaults = {
		modal: true
	};

}( jQuery ) );


function showPopup( popupSelector ) {

	jQuery( popupSelector ).fadeIn( "slow" );
}

function closePopup( popupSelector ) {

	jQuery( popupSelector ).fadeOut( "slow" );
}

/* Show default error popup */
function showErrorPopup( errors ) {

	jQuery( "#error-popup .popup-content" ).html( errors );

	showPopup( "#error-popup" );
}

function hideErrorPopup() {

	closePopup( "#error-popup" );
}

/* Show default message popup */
function showMessagePopup( message ) {

	jQuery( "#message-popup .popup-content" ).html( message );

	showPopup( "#message-popup" );
}

function hideMessagePopup() {

	closePopup( "#message-popup" );
}