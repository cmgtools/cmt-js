// B-popup ---------------------------------------------------

/* Show popup */
function showPopup( popupSelector ) {

	jQuery( popupSelector ).bPopup({
	    modalClose: false,
	    opacity: 0.6,
	    positionStyle: 'fixed' //'fixed' or 'absolute'
	});	
}

/* Close popup */
function closePopup( popupSelector ) {

	jQuery( popupSelector ).bPopup().close();
}

/* Show default error popup */
function showErrorPopup( errors ) {

	jQuery( "#error-popup .popup-elements" ).html( errors );

	showPopup( "#error-popup" );
}

function hideErrorPopup() {

	closePopup( "#error-popup" );
}

/* Show default message popup */
function showMessagePopup( message ) {

	jQuery( "#message-popup .popup-elements" ).html( message );

	showPopup( "#message-popup" );
}

function hideMessagePopup() {

	closePopup( "#message-popup" );
}