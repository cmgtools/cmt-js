/* Browser Features  */

function isCanvasSupported() {

	var elem = document.createElement( 'canvas' );

	return !!( elem.getContext && elem.getContext( '2d' ) );
}

function isFileApiSupported() {

	var xhr = new XMLHttpRequest();

	return window.File && window.FileList && window.FileReader && xhr.upload;
}

function isFormDataSupported() {

	return !!window.FormData;
}

function isWebSocketSupported() {
	
	return window.WebSocket;
}