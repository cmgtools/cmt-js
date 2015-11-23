/*
 * Dependencies: jquery
 */

/**
 * CMGTools Utilities - Collection of commonly used utility functions available for CMGTools.
 */
cmt.utils = {};

// Browser Features ------------------------------------------

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
	
// Image Processing ------------------------------------------

/**
 * Image utility provides commonly used image processing methods.
 */
cmt.utils.image = {

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
	 * It draws the provided image file at center of canvas.
	 */
	drawAtCanvasCenter: function( canvas, imageUrl ) {

		if( null != canvas && null != imageUrl ) {

			var width		= canvas.width;
			var height		= canvas.height;

			var context 	= canvas.getContext( '2d' );
		    var image 		= new Image();
		    var image_url 	= window.URL || window.webkitURL;
		    var image_src 	= image_url.createObjectURL( imageUrl );
		    image.src 		= image_src;

		    image.onload = function() {

		        var dims = cmt.utils.image.arDimensions( image, width, height );

				context.translate( width/2, height/2 );

		        context.drawImage( image, -(dims[0] / 2), -(dims[1] / 2), dims[0], dims[1] );

				context.translate( -(width/2), -(height/2) );

		        image_url.revokeObjectURL( image_src );
		    };
		}
	}
};

// Data Processing -------------------------------------------

/**
 * Data utility provides methods to convert form elements to json format. The json data can be used to send request to server side apis.
 */
cmt.utils.data = {

	/**
	 * It reads elementId and convert the input fields present within the element to parameters url.
	 */
	serialiseElement: function( elementId ) {

		var dataArr		= [];
		var elements 	= jQuery( '#' + elementId ).find( ':input' ).get();

		jQuery.each( elements, function() {

			if ( this.name && !this.disabled && ( this.checked || /select|textarea/i.test( this.nodeName ) || /text|hidden|password/i.test( this.type ) ) ) {

				var val = jQuery( this ).val();

				dataArr.push( encodeURIComponent( this.name ) + "=" + encodeURIComponent( val ) );
			}
		});

		// Form the data url having all the parameters
		var dataUrl = dataArr.join( "&" ).replace( /%20/g, "+" );

		// Append CSRF token if available
		if( null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			dataUrl += "&_csrf=" + csrfToken;
		}

		return dataUrl;
	},

	/**
	 * It reads elementId and convert the input fields present within the element to json.
	 */
	elementToJson: function( elementId ) {

		var dataArr		= [];
		var elements 	= jQuery( '#' + elementId ).find(':input').get();

		jQuery.each( elements, function() {

			if ( this.name && !this.disabled && ( this.checked || /select|textarea/i.test( this.nodeName ) || /text|hidden|password/i.test( this.type ) ) ) {

				var val = jQuery( this ).val();

				dataArr.push( { name: this.name, value: val } );
			}
		});

		return cmt.utils.data.generateJsonMap( dataArr );
	},

	/**
	 * It reads formId and convert the input fields present within the form to parameters url. It use the serialize function provided by jQuery.
	 */
	serialiseForm: function( formId ) {

		// Generate form data for submission
		var dataUrl	= null;

		if( typeof formId == 'string' ) {

			dataUrl	= jQuery( '#' + formId ).serialize();	
		}
		else {

			dataUrl	= formId.serialize();
		}

		// Append CSRF token if available
		if( null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			dataUrl 	   += "&_csrf=" + csrfToken;
		}

		return dataUrl;
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

		return cmt.utils.data.generateJsonMap( formData );
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
	},

	/**
	 * Edit parameter for the given URL.
	 */
	updateUrlParam: function( sourceUrl, e, t ) {

		var n;
		var r 	= "";
		var i 	= jQuery( "<a />" ).attr( "href", sourceUrl )[ 0 ];
		var s,o	= /\+/g;
		var u	= /([^&=]+)=?([^&]*)/g;
		var a	= function( e ) { return decodeURIComponent( e.replace( o, " " ) ); };
		var f 	= i.search.substring( 1 );
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
	},

	/**
	 * Remove parameter from the given url.
	 */
	removeParam: function( sourceUrl, key ) {

	    var baseUrl 	= sourceUrl.split( "?" )[ 0 ];
		var param		= null;
		var paramsArr 	= [];
		var queryString = ( sourceUrl.indexOf( "?" ) !== -1 ) ? sourceUrl.split( "?" )[ 1 ] : "";

	    if( queryString !== "" ) {

	        paramsArr = queryString.split( "&" );

	        for( var i = paramsArr.length - 1; i >= 0; i -= 1 ) {

	            param = paramsArr[ i ].split( "=" )[ 0 ];

	            if( param === key ) {

	                paramsArr.splice( i, 1 );
	            }
	        }

	        baseUrl = baseUrl + "?" + paramsArr.join( "&" );
	    }

	    return baseUrl;
	}
};

// Object Utilities ------------------------------------------

/**
 * Object utility provides methods to initialise or manipulate objects.
 */
cmt.utils.object = {

	/**
	 * Return object/instance associated to given string with namespace. It also check the type of Object.
	 */
	strToObject: function( str ) {

	    var arr 		= str.split( "." );
		var objClass	= ( window || this );

	    for( var i = 0, arrLength = arr.length; i < arrLength; i++ ) {

	        objClass	= objClass[ arr[ i ] ];
	    }

		var obj		= new objClass;

		if ( typeof obj !== 'object' ) {

			throw new Error( str +" not found" );
		}

		return obj;
	}
};

// UI Utilities ----------------------------------------------

/**
 * UI utility provides methods to format or manage UI elements.
 */
cmt.utils.ui = {

	/**
	 * Aligns child element content at the center of parent vertically and horizontally. It expect parent to be positioned.
	 */
	alignMiddle: function( parent, child ) {

		var parent			= jQuery( parent );
		var child			= jQuery( child );

		var parentHeight	= parent.height();
		var parentWidth		= parent.width();
		var childHeight		= child.height();
		var childWidth		= child.width();

		if( childHeight <= parentHeight && childWidth <= parentWidth ) {

			var top 	= (parentHeight - childHeight) / 2;
			var left 	= (parentWidth - childWidth) / 2;

			child.css( { "position": "absolute", "top": top, "left": left } );	
		}
	}
};

// Common fixes -----------------------------------------------

//Crockford's approach to add inheritance. It works for all browsers. Object.create() is still not supported by all browsers.
Function.prototype.inherits = function( parent ) {

	var d	= 0;
	var p 	= ( this.prototype = new parent() );

	this.prototype.uber	= function( name ) {

		var f;
		var r;
		var t = d;
		var v = parent.prototype;

		if( t ) {

			while( t ) {

	              v		= v.constructor.prototype;
	              t 	-= 1;
			}
	
			f = v[ name ];
		}
		else {

			f	= p[ name ];
	
			if( f == this[ name ] ) {

				f = v[ name ];
			}
		}

		d		+= 1;
		r		 = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
		d		-= 1;

		return r;
	};
};

// Fix hash tag issues for SNS login
if( window.location.hash == '#_=_' ) {

    if( history.replaceState ) {

        var cleanHref = window.location.href.split( '#' )[ 0 ];

        history.replaceState( null, null, cleanHref );
    }
    else {

        window.location.hash = '';
    }
}