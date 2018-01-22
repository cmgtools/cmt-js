/**
 * Browser utility provides commonly used browser feature detection methods.
 */

cmt.utils.browser = {

	/**
	 * Detect whether browser supports xhr.
	 */
	isXhr: function() {

		var xhr	= new XMLHttpRequest();

		return xhr.upload;
	},

	/**
	 * Detect whether browser supports file api.
	 */
	isFileApi: function() {

		return window.File && window.FileList && window.FileReader;
	},

	/**
	 * Detect whether browser supports form data.
	 */
	isFormData: function() {

		return !! window.FormData;
	},

	/**
	 * Detect whether browser supports canvas.
	 */
	isCanvas: function() {

		var elem 			= document.createElement( 'canvas' );
		var canvasSupported = !!( elem.getContext && elem.getContext( '2d' ) );

		return canvasSupported;
	},

	/**
	 * Detect whether browser supports canvas data url feature.
	 */
	isCanvasDataUrl: function() {

		// Used image/png for testing purpose

		var cvsTest 			= document.createElement( "canvas" );
		var data				= cvsTest.toDataURL( "image/png" );
		var toDataUrlSupported	= data.indexOf( "data:image/png" ) == 0;

		return toDataUrlSupported;
	}
};
