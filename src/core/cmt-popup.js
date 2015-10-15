/*
 * Dependencies: jquery
 */
( function( cmt ) {

	cmt.fn.cmtPopup = function( options ) {

		// == Init == //

		// Configure Popups
		var settings 		= cmt.extend( {}, cmt.fn.cmtPopup.defaults, options );
		var elements		= this;
		var documentHeight 	= cmt( document ).height();
		var screenHeight	= cmt( window ).height();
		var screenWidth		= cmt( window ).width();

		// Iterate and initialise all the popups
		elements.each( function() {

			var element	= cmt( this );

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
	
				// background to cover window
				popup.children( ".popup-background" ).css( { 'top': '0px', 'left': '0px', 'height': screenHeight, 'width': screenWidth } );
	
				// Child at center of parent
				popupData.css( { 'top': screenHeight/2 - popupData.height()/2, 'left': screenWidth/2 - popupData.width()/2 } );
			}
		}
	};

	// Default Settings
	cmt.fn.cmtPopup.defaults = {
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