// CMGTools Utilities - Collection of commonly used utility functions available for CMGTools
Cmt.utils = {
	
};

// Browser Features ------------------------------------------

Cmt.utils.browser = {

	/**
	 * Detect whether browser supports canvas.
	 */
	isCanvas: function() {

		var elem 			= document.createElement( 'canvas' );
		var canvasSupported = !!( elem.getContext && elem.getContext( '2d' ) );

		return canvasSupported;
	},

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

Cmt.utils.image = {

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
	drawOnCanvas: function( canvas, imageFile ) {

		if( null != canvas && null != imageFile ) {

			var width		= canvas.width;
			var height		= canvas.height;

			var context 	= canvas.getContext( '2d' );
		    var image 		= new Image();
		    var image_url 	= window.URL || window.webkitURL;
		    var image_src 	= image_url.createObjectURL( imageFile );
		    image.src 		= image_src;

		    image.onload = function() {

		        var dims = Cmt.utils.image.arDimensions( image, width, height );
				
				context.translate( width/2, height/2 );

		        context.drawImage( image, -(dims[0] / 2), -(dims[1] / 2), dims[0], dims[1] );
				
				context.translate( -(width/2), -(height/2) );

		        image_url.revokeObjectURL( image_src );
		    };
		}
	}
};

// Data Processing -------------------------------------------

Cmt.utils.data = {

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

		return Cmt.utils.data.generateJsonMap( dataArr );
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

		return Cmt.utils.data.generateJsonMap( formData );
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

// UI Utilities ----------------------------------------------

Cmt.utils.ui = {

	/**
	 * Aligns child element content at the center of parent vertically.
	 */
	alignMiddle: function( parent, child ) {

		var parentHeight	= jQuery( parent ).height();

		jQuery( child ).height( parentHeight );

		jQuery( child ).css( "line-height", parentHeight );
	}
};