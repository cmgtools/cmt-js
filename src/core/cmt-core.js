/*
 * Dependencies: jquery
 */

// Global Namespace for CMGTools
var Cmt = Cmt || {};

// CMGTools Utilities

Cmt.utils = {

	// Browser Features ------------------------------------------

	/**
	 * It detect whether browser supports canvas.
	 */
	isCanvasSupported: function() {
	
		// Canvas support
		var elem 			= document.createElement( 'canvas' );
		var canvasSupported = !!( elem.getContext && elem.getContext( '2d' ) );
	
		return canvasSupported;
	},

	/**
	 * It detect whether browser supports xhr.
	 */
	isXhrSupported: function() {
	
		var xhr	= new XMLHttpRequest();
	
		return xhr.upload;
	},

	/**
	 * It detect whether browser supports file api.
	 */
	isFileApiSupported: function() {
	
		return window.File && window.FileList && window.FileReader;	
	},

	/**
	 * It detect whether browser supports form data.
	 */
	isFormDataSupported: function() {
	
		return !! window.FormData;
	},
	
	/**
	 * It detect whether browser supports data url.
	 */
	isCanvasDataUrlSupported: function() {
	
		// Used image/png for testing purpose
	
		var cvsTest 			= document.createElement( "canvas" );
		var data				= cvsTest.toDataURL( "image/png" );
		var toDataUrlSupported	= data.indexOf( "data:image/png" ) == 0;
	
		return toDataUrlSupported;
	},
	
	// Image Processing ------------------------------------------
	
	/**
	 * It returns an array having width and height for the given image and target dimensions maintaining aspect ratio.
	 */
	arDimensions: function( image, targetWidth, targetHeight ) {

	        var ratio 	= 0;
	        var width 	= image.width;
	        var height 	= image.height;

	        // Check if the current width is larger than the max
	        if( width > targetWidth ) {

	            ratio 	= targetWidth / width;
	            height 	= height * ratio;
	            width 	= width * ratio;
	        }

	        // Check if current height is larger than max
	        if( height > targetHeight ) {

	            ratio 	= targetHeight / height;
	            width 	= width * ratio;
	        }

	        return new Array( width, height );
	},

	/**
	 * It draws the provided image file at center of canvas. We can read the image file by listening onchange event for file input.
	 */
	drawImageOnCanvas: function( canvas, imageFile ) {

		if( null != canvas && null != imageFile ) {

			var width		= canvas.width;
			var height		= canvas.height;

			var context 	= canvas.getContext( '2d' );
		    var image 		= new Image();
		    var image_url 	= window.URL || window.webkitURL;
		    var image_src 	= image_url.createObjectURL( imageFile );
		    image.src 		= image_src;

		    image.onload = function() {

		        var dims = Cmt.utils.arDimensions( image, width, height );
				
				context.translate( width/2, height/2 );

		        context.drawImage( image, -(dims[0] / 2), -(dims[1] / 2), dims[0], dims[1] );
				
				context.translate( -(width/2), -(height/2) );

		        image_url.revokeObjectURL( image_src );
		    };
		}
	},

	// Data Processing -------------------------------------------

	/**
	 * It reads elementId and convert the input fields present within the element to an html query.
	 */
	serialiseElement: function( elementId ) {

		var toReturn	= [];
		var els 		= jQuery( '#' + elementId ).find(':input').get();

		jQuery.each(els, function() {

			if ( this.name && !this.disabled && ( this.checked || /select|textarea/i.test( this.nodeName ) || /text|hidden|password/i.test( this.type ) ) ) {

				var val = jQuery( this ).val();

				toReturn.push( encodeURIComponent( this.name ) + "=" + encodeURIComponent( val ) );
			}
		});

		var elementData = toReturn.join( "&" ).replace( /%20/g, "+" );

		if( null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			elementData += "&_csrf=" + csrfToken;
		}

		return elementData;
	},

	/**
	 * It reads elementId and convert the input fields present within the element to json.
	 */
	elementToJson: function( elementId ) {

		var toReturn	= [];
		var els 		= jQuery( '#' + elementId ).find(':input').get();

		jQuery.each( els, function() {

			if ( this.name && !this.disabled && ( this.checked || /select|textarea/i.test( this.nodeName ) || /text|hidden|password/i.test( this.type ) ) ) {

				var val = jQuery( this ).val();

				formData.push( { name: this.name, value: val } );
			}
		});

		return Cmt.utils.generateJsonMap( formData );
	},

	/**
	 * It reads formId and convert the input fields present within the form to html request.
	 */
	serialiseForm: function( formId ) {

		// Generate form data for submission
		var formData	= null;

		if( typeof formId == 'string' ) {

			formData	= jQuery( '#' + formId ).serialize();	
		}
		else {

			formData	= formId.serialize();
		}

		if( null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			formData 	   += "&_csrf=" + csrfToken;
		}

		return formData;
	},

	/**
	 * It reads formId and convert the form input fields to a Json Array.
	 */
	formToJson: function( formId ) {

		// Generate form data for submission
		var formData	= null;

		if( typeof formId == 'string' ) {

			formData	= jQuery( '#' + formId ).serializeArray();	
		}
		else {

			formData	= formId.serializeArray();
		}

		return Cmt.utils.generateJsonMap( formData );
	},

	/**
	 * It reads an data array having name value pair and convert it to json format.
	 */
	generateJsonMap: function( dataArray ) {

		var json 		= {};

		// Append csrf token if required
		if( null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			dataArray.push( { name: "_csrf", value: csrfToken } );
		}

		jQuery.map( dataArray, function(n, i) {

			var _ = n.name.indexOf('[');

			if (_ > -1) {

				var o = json;
				_name = n.name.replace(/\]/gi, '').split('[');

				for (var i=0, len=_name.length; i<len; i++) {

					if (i == len-1) {

						if (o[_name[i]]) {

							if (typeof o[_name[i]] == 'string') {

								o[_name[i]] = [o[_name[i]]];
							}

							o[_name[i]].push(n.value);
						}

						else o[_name[i]] = n.value || '';
					}

					else o = o[_name[i]] = o[_name[i]] || {};
				}
			}
			else {

				if (json[n.name] !== undefined) {

					if (!json[n.name].push) {

						json[n.name] = [json[n.name]];
					}

					json[n.name].push(n.value || '');
				}
				else {

					json[n.name] = n.value || '';
				}	
			}
		});

		return json;
	}
};

/**
 * Read and edit URL parameters.
 */
String.prototype.urlParams = function( e, t ) {

	var n;
	var r 	= "";
	var i 	= $("<a />").attr( "href", this )[ 0 ];
	var s,o	= /\+/g;
	var u	= /([^&=]+)=?([^&]*)/g;
	var a	= function( e ) { return decodeURIComponent( e.replace( o, " " ) ); };
	var f 	= i.search.substring(1);
	n		= {};

	while( s = u.exec( f ) ) {

		n[ a( s[1] ) ] = a( s[2] );
	}

	if( !e && !t ) {

		return n;
	}
	else if( e && !t ) { 

		return n[e];
	}
	else {

		n[e]	= t; 
		var l	= [];

		for( var c in n ) {

			l.push( encodeURIComponent( c ) + "=" + encodeURIComponent( n[c] ) );
		}
		
		if( l.length > 0 ) {

			r = "?" + l.join( "&" );
		}
		
		return i.origin + i.pathname + r;
	}
};

function removeParam( key, sourceURL ) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}