/**
 * CMGTools JS - v1.0.0-alpha1 - 2016-03-04
 * Description: CMGTools JS is a JavaScript library which provide utilities, ui components and MVC framework implementation for CMSGears.
 * License: GPLv3
 * Author: Bhagwat Singh Chouhan
 */

/**
 * The library CMGTools JS require JQuery for most of it's usage. 
 */

// Global Namespace for CMGTools
var cmt = cmt || {};

/**
 * CMGTools Utilities - Collection of commonly used utility functions available for CMGTools.
 */

// Global Namespace for CMGTools utilities
cmt.utils = cmt.utils || {};

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

/**
 * Data utility provides methods to convert form elements to json format and to manipulate url parameters. The json data can be used to send request to server side apis.
 */

cmt.utils.data = {

	/**
	 * It reads elementId and convert the input fields present within the element to parameters url.
	 */
	serialiseElement: function( elementId, csrf ) {

		var dataArr		= [];
		var elements 	= null;
		
		if( typeof( csrf ) === 'undefined' ) csrf = true;
		
		if( typeof elementId == 'string' ) {

			elements 	= jQuery( '#' + elementId ).find( ':input' ).get();	
		}
		else {

			elements	= elementId.find( ':input' ).get();
		}

		jQuery.each( elements, function() {

			if ( this.name && !this.disabled && ( this.checked || /select|textarea/i.test( this.nodeName ) || /text|hidden|password/i.test( this.type ) ) ) {

				var val = jQuery( this ).val();

				dataArr.push( encodeURIComponent( this.name ) + "=" + encodeURIComponent( val ) );
			}
		});

		// Form the data url having all the parameters
		var dataUrl = dataArr.join( "&" ).replace( /%20/g, "+" );

		// Append CSRF token if available
		if( csrf && null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			dataUrl += "&_csrf=" + csrfToken;
		}

		return dataUrl;
	},

	/**
	 * It reads elementId and convert the input fields present within the element to json.
	 */
	elementToJson: function( elementId, csrf ) {

		var dataArr		= [];
		var elements 	= null;
		
		if( typeof( csrf ) === 'undefined' ) csrf = true;
		
		if( typeof elementId == 'string' ) {

			elements 	= jQuery( '#' + elementId ).find( ':input' ).get();	
		}
		else {

			elements	= elementId.find( ':input' ).get();
		}

		jQuery.each( elements, function() {

			if ( this.name && !this.disabled && ( this.checked || /select|textarea/i.test( this.nodeName ) || /text|hidden|password/i.test( this.type ) ) ) {

				var val = jQuery( this ).val();

				dataArr.push( { name: this.name, value: val } );
			}
		});

		return cmt.utils.data.generateJsonMap( dataArr, csrf );
	},

	/**
	 * It reads formId and convert the input fields present within the form to parameters url. It use the serialize function provided by jQuery.
	 */
	serialiseForm: function( formId, csrf ) {

		// Generate form data for submission
		var dataUrl	= null;
		
		if( typeof( csrf ) === 'undefined' ) csrf = true;
		
		if( typeof formId == 'string' ) {

			dataUrl	= jQuery( '#' + formId ).serialize();	
		}
		else {

			dataUrl	= formId.serialize();
		}

		// Append CSRF token if available
		if( csrf && null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			dataUrl 	   += "&_csrf=" + csrfToken;
		}

		return dataUrl;
	},

	/**
	 * It reads formId and convert the form input fields to a Json Array.
	 */
	formToJson: function( formId, csrf ) {

		// Generate form data for submission
		var formData	= null;

		if( typeof( csrf ) === 'undefined' ) csrf = true;

		if( typeof formId == 'string' ) {

			formData	= jQuery( '#' + formId ).serializeArray();	
		}
		else {

			formData	= formId.serializeArray();
		}

		return cmt.utils.data.generateJsonMap( formData, csrf );
	},

	/**
	 * It reads an data array having name value pair and convert it to json format.
	 */
	generateJsonMap: function( dataArray, csrf ) {

		var json 		= {};

		// Append csrf token if required
		if( csrf && null != jQuery( 'meta[name=csrf-token]' ) ) {

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
	 * Add/Update parameter for the given URL.
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

		if( baseUrl.slice( -1 ) == '?' ) {

			baseUrl	= baseUrl.slice( 0, -1 );
		}

	    return baseUrl;
	}
};

// Inheritance - Crockford's approach to add inheritance. It works for all browsers. Object.create() is still not supported by all browsers.
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

// Hash Tag - Fix hash tag issues for SNS login
if( window.location.hash == '#_=_' ) {

    if( history.replaceState ) {

        var cleanHref = window.location.href.split( '#' )[ 0 ];

        history.replaceState( null, null, cleanHref );
    }
    else {

        window.location.hash = '';
    }
}

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

/**
 * Block component used to configure page blocks. It can be used to configure blocks height, css and parallax nature.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtBlock = function( options ) {

		// == Init == //

		// Configure Blocks
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtBlock.defaults, options );
		var blocks			= this;
		var screenHeight	= cmtjq( window ).height();
		var screenWidth		= cmtjq( window ).width();
		var blocksConfig	= settings.blocks;
		var blocksKeys		= Object.keys( blocksConfig );

		// Iterate and initialise all the page blocks
		blocks.each( function() {

			var block	= cmtjq( this );

			init( block );
		});

		// Initialise parallax
		if( settings.backgroundParallax ) {

			cmtjq( window ).scroll( scrollBackground );
		}

		// return control
		return;

		// == Private Functions == //

		// Initialise Block
		function init( block ) {

			// -- Apply Block Specific Settings
			if( cmtjq.inArray( block.attr( "id" ), blocksKeys ) >= 0 ) {

				var blockConfig				= blocksConfig[ block.attr( "id" ) ];
				var height					= blockConfig[ "height" ];
				var fullHeight				= blockConfig[ "fullHeight" ];
				var halfHeight				= blockConfig[ "halfHeight" ];
				var heightAuto				= blockConfig[ "heightAuto" ];
				var heightAutoMobile		= blockConfig[ "heightAutoMobile" ];
				var heightAutoMobileWidth	= blockConfig[ "heightAutoMobileWidth" ];
				var css 					= blockConfig[ "css" ];

				// Check whether pre-defined height is required
				if( null != height && height ) {

					block.css( { 'height': height + "px" } );
				}

				// Apply auto height
				if( null != heightAuto && heightAuto ) {

					if( null != height && height ) {

						block.css( { 'height': 'auto', 'min-height': height + "px" } );
					}
					else if( null != fullHeight && fullHeight ) {

						block.css( { 'height': 'auto', 'min-height': screenHeight + "px" } );
					}
					else if( null != halfHeight && halfHeight ) {

						block.css( { 'height': 'auto', 'min-height': ( screenHeight / 2 ) + "px" } );
					}
					else {
						
						block.css( { 'height': 'auto' } );
					}
				}

				// Apply Full Height
				if( null == height && null == heightAuto && ( null != fullHeight && fullHeight ) ) {

					block.css( { 'height': screenHeight + "px" } );
				}

				// Apply Half Height
				if( null == height && null == heightAuto && ( null != halfHeight && halfHeight ) ) {

					block.css( { 'height': ( screenHeight / 2 ) + "px" } );
				}

				// Check whether min height and height auto is required for mobile to handle overlapped content
				if( null != heightAutoMobile && heightAutoMobile ) {

					if( window.innerWidth <= heightAutoMobileWidth ) {

						block.css( { 'height': 'auto', 'min-height': screenHeight + "px" } );

						var contentWrap = block.children( ".block-wrap-content" );

						if( contentWrap.hasClass( "valign-center" ) ) {

							contentWrap.removeClass( "valign-center" );
						}
					}
				}

				// adjust content wrap and block height in case content height exceeds
				var contentWrap	= block.find( ".block-wrap-content" );
				var content		= block.find( ".block-content" );

				if( content !== undefined && ( content.height() > contentWrap.height() ) ) {

					var newHeight 	= ( content.height() + 100 ) + 'px';
					var diff		= content.height() - contentWrap.height();

					contentWrap.height( newHeight );

					newHeight = ( block.height() + diff + 100 ) + 'px';

					block.height( newHeight );
				}

				// Check whether additional css is required
				if( null != css && css ) {

					block.css( css );
				}
			}
			// -- Apply Common Settings for all the Blocks
			else {

				// Apply Full Height
				if( settings.fullHeight ) {

					if( settings.heightAuto ) {

						block.css( { 'height': 'auto', 'min-height': screenHeight + "px" } );
					}
					else {

						block.css( { 'height': screenHeight + "px" } );
					}
				}

				// Apply Half Height
				if( settings.halfHeight ) {

					if( settings.heightAuto ) {

						block.css( { 'height': 'auto', 'min-height': ( screenHeight / 2 ) + "px" } );
					}
					else {

						block.css( { 'height': ( screenHeight / 2 ) + "px" } );
					}
				}
			}
		}

		// Initialise parallax
		function scrollBackground() {

			var winHeight 	= cmtjq( window ).height();
		    var winTop 		= cmtjq( window ).scrollTop();
		    var winBottom 	= winTop + winHeight;
		    var winCurrent 	= winTop + winHeight / 2;
		    
		    blocks.each( function( i ) {

		        var block 			= cmtjq( this );
		        var blockHeight 	= block.height();
		        var blockTop 		= block.offset().top;
		        var blockBottom 	= blockTop + blockHeight;
		        var background		= block.children( ".block-bkg-parallax" );

		        if( null != background && background.length > 0 && winBottom > blockTop && winTop < blockBottom ) {

					var bkgWidth 		= background.width();
	            	var bkgHeight 		= background.height();
		            var min 			= 0;
		            var max 			= bkgHeight - winHeight;
		            var heightOverflow 	= blockHeight < winHeight ? bkgHeight - blockHeight : bkgHeight - winHeight;
		            blockTop 			= blockTop - heightOverflow;
		            blockBottom 		= blockBottom + heightOverflow;
		            var value 			= min + (max - min) * ( winCurrent - blockTop ) / ( blockBottom - blockTop );

		            background.css( "background-position", "50% " + value + "px" );
		        }
		    });
		}
	};

	// Default Settings
	cmtjq.fn.cmtBlock.defaults = {
		// Controls
		fullHeight: true,
		halfHeight: false,
		heightAuto: false,
		backgroundParallax: true,
		blocks: {
			/* An array of blocks which need extra configuration. Ex:
			<Block Selector ID>: {
				height: 250,
				fullHeight: false,
				heightAuto: false,
				heightAutoMobile: false,
				heightAutoMobileWidth: 1024,
				css: { color: 'white' }
			}
			*/
		}
	};

})( jQuery );

/**
 * It's a custom checkbox plugin used to make origin checkbox submit value everytime.
 */

( function( cmtjq ) {

// TODO: Add option for multi select

	cmtjq.fn.cmtCheckbox = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtCheckbox.defaults, options );
		var checkboxes		= this;

		// Iterate and initialise all the fox sliders
		checkboxes.each( function() {

			var checkbox = cmtjq( this );

			init( checkbox );
		});

		// return control
		return;

		// == Private Functions == //

		function init( checkbox ) {

			var field 	= checkbox.find( "input[type='checkbox']" );
			var input 	= checkbox.find( "input[type='hidden']" );

			if( input.val() == 1 ) {

				field.prop( 'checked', true );
			}

			field.change( function() {

				if( field.is( ':checked' ) ) {

 					input.val( 1 );
 				}
 				else {

 					input.val( 0 );
 				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtCheckbox.defaults = {
		// options
	};

})( jQuery );

/**
 * File Uploader plugin can be used to upload files. The appropriate backend code should be able to handle the file sent by this plugin.
 * It works fine for CMSGears using it's File Uploader and Avatar Uploader widgets.
 */

// TODO: Validate for max file size if possible

// File Uploader Plugin
( function( cmtjq ) {

	cmtjq.fn.cmtFileUploader = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtFileUploader.defaults, options );
		var fileUploaders	= this;

		// Iterate and initialise all the uploaders
		fileUploaders.each( function() {

			var fileUploader = cmtjq( this );

			init( fileUploader );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Uploader
		function init( fileUploader ) {

			// Show/Hide file chooser - either of the option must exist to choose file
			var btnShowChooser	= fileUploader.find( ".btn-show-chooser, .btn-direct-chooser" );

			if( btnShowChooser.length > 0 ) {

				btnShowChooser.click( function() {

					// Show Chooser
					fileUploader.find( ".wrap-chooser" ).toggle( "slow" );

					// Hide Postaction
					fileUploader.find( ".post-action" ).hide();

					// Clear Old Values
					if( cmt.utils.browser.isCanvas() && fileUploader.attr( "type" ) == "image" ) {

						fileUploader.find( ".preview canvas" ).hide();
					}

					fileUploader.find( ".chooser .input, .direct-chooser .input" ).val("");

					var progressContainer	= fileUploader.find( ".preloader .preloader-bar" );
	
					// Modern Uploader
					if ( cmt.utils.browser.isFileApi() ) {
	
						progressContainer.css( "width", "0%" );
					}
					// Form Data Uploader
					else if( cmt.utils.browser.isFormData() ) {
	
						progressContainer.html( "" );
					}
				});
			}

			// Modern Uploader
			if ( cmt.utils.browser.isFileApi() ) {

				// Traditional way using input
				var inputField = fileUploader.find( ".chooser .input, .direct-chooser .input" );

				inputField.change( function( event ) {

					handleFile( event, fileUploader );
				});

				// Modern way using Drag n Drop
				var dragElement = fileUploader.find( ".preview .wrap-drag" );

				dragElement.bind( 'dragover', function( event ) { 

					handleDragging( event );
				});
		
				dragElement.bind( 'dragleave', function( event ) { 
		
					handleDragging( event );
				});
		
				dragElement.bind( 'drop', function( event ) {

					handleFile( event, fileUploader );
				});
			}
			// Form Data Uploader
			else if( cmt.utils.browser.isFormData() ) {

				var directory	= fileUploader.attr( "directory" );
				var type		= fileUploader.attr( "type" );
				var inputField 	= fileUploader.find( ".chooser .input, .direct-chooser .input" );

				inputField.change( function( event ) {

					uploadTraditionalFile( fileUploader, directory, type ); 
				} );
			}
		}

		function handleDragging( event ) {

			event.stopPropagation();
			event.preventDefault();

			// TODO: add class hover to drag
			// event.target.className = ( event.type == "dragover" ? "hover" : "" );
		}

		function handleFile( event, fileUploader ) {

			var directory	= fileUploader.attr( "directory" );
			var type		= fileUploader.attr( "type" );

			// cancel event and add hover styling
			handleDragging( event );

			// FileList
			var files = event.target.files || event.originalEvent.dataTransfer.files;

			// Draw if image
			if( settings.preview && cmt.utils.browser.isCanvas() && type == "image" ) {

				var canvas		= fileUploader.find( ".preview canvas" );

				canvas.show();

				cmt.utils.image.drawAtCanvasCenter( canvas[0], files[0] );
			}

			// Upload File
			uploadFile( fileUploader, directory, type, files[0] );
		}

		function uploadFile( fileUploader, directory, type, file ) {

			var xhr 				= new XMLHttpRequest();
			var fileType			= file.type.toLowerCase();
			var isValidFile			= jQuery.inArray( fileType, settings.fileFormats );
			var progressContainer	= fileUploader.find( ".preloader .preloader-bar" );
			var formData 			= new FormData();

			// append form data
			formData.append( 'file', file );

			// reset progress bar
			progressContainer.css( "width", "0%" );

			// upload file
			if( xhr.upload && isValidFile ) {

				// Upload progress
				xhr.upload.onprogress = function( e ) {

					if( e.lengthComputable ) {

						var progress = Math.round( ( e.loaded * 100 ) / e.total );

						progressContainer.css( "width", progress + "%" );
					}
				};

				// file received/failed
				xhr.onreadystatechange = function( e ) {

					if ( xhr.readyState == 4 ) {

						if( xhr.status == 200 ) {

							var jsonResponse 	= JSON.parse( xhr.responseText );

							if( jsonResponse[ 'result' ] == 1 ) {

								var responseData	= jsonResponse[ 'data' ];

								if( settings.uploadListener ) {

									settings.uploadListener( fileUploader.attr( "id" ), directory, type, responseData );
								}
								else {

									fileUploaded( fileUploader, directory, type, responseData );
								}
							}
							else {
								
								var responseData	= jsonResponse[ 'errors' ];

								alert( responseData.error );
							}
						}
					}
				};

				var urlParams	= fileUploadUrl + "?directory=" + encodeURIComponent( directory ) + "&type=" + encodeURIComponent( type );

				// start upload
				xhr.open("POST", urlParams, true );
				xhr.send( formData );
			}
			else {

				alert( "File format not allowed." );
			}
		}

		// TODO; Test it well
		function uploadTraditionalFile( fileUploader, directory, type ) {

			var progressContainer	= fileUploader.find( ".preloader .preloader-bar" );
			var fileList			= fileUploader.find( ".chooser .input, .direct-chooser .input" );
			var file 				= fileList.files[0];
			var formData 			= new FormData();
			fileName 				= file.name;

			// Show progress
			progressContainer.html( "Uploading file" );

			formData.append( 'file', file );

			var urlParams	= fileUploadUrl + "?directory=" + encodeURIComponent( directory ) + "&type=" + encodeURIComponent( type );

			jQuery.ajax({
			  type:			"POST",
			  url: 			urlParams,
			  data: 		formData,
		      cache: 		false,
		      contentType: 	false,
		      processData: 	false,
			  dataType:		'json',
			}).done( function( response ) {

				progress.html( "File uploaded" );

				if( response['result'] == 1 ) {

					if( settings.uploadListener ) {

						settings.uploadListener( fileUploader.attr( "id" ), directory, type, response['data'] );
					}
					else {

						fileUploaded( fileUploader, directory, type, response['data'] );
					}
				}
				else {

					alert( "File upload failed." );
				}
			});
		}

		// default post processor for uploaded files.
		function fileUploaded( fileUploader, directory, type, result ) {

			var fileName	= result[ 'name' ] + "." + result[ 'extension' ];

			switch( type ) {
				
				case "image": {

					fileUploader.find( ".postview .wrap-file" ).html( "<img src='" + result['tempUrl'] + "' class='fluid' />" );
	
					var fileFields	= fileUploader.find( ".fields" );
	
					fileFields.children( ".name" ).val( result[ 'name' ] );
					fileFields.children( ".extension" ).val( result[ 'extension' ] );
					fileFields.children( ".change" ).val( 1 );

					break;
				}
				case "video": {

					fileUploader.find( ".postview .wrap-file" ).html( "<video src='" + result['tempUrl'] + "' controls class='fluid'>Video not supported.</video>" );

					var fileFields	= fileUploader.find( ".fields" );
	
					fileFields.children( ".name" ).val( result[ 'name' ] );
					fileFields.children( ".extension" ).val( result[ 'extension' ] );
					fileFields.children( ".change" ).val( 1 );
					
					break;
				}
				case "document":
				case "compressed": {

					fileUploader.find( ".postview .wrap-file" ).html( "<i class='cmti cmti-3x cmti-check'></i>" );

					var fileFields	= fileUploader.find( ".fields" );
	
					fileFields.children( ".name" ).val( result[ 'name' ] );
					fileFields.children( ".extension" ).val( result[ 'extension' ] );
					fileFields.children( ".change" ).val( 1 );
					
					break;
				}
			}

			// Show Hide
			fileUploader.find( ".wrap-chooser" ).hide();
			fileUploader.find( ".post-action" ).show();
		}
	};

	// Default Settings
	cmtjq.fn.cmtFileUploader.defaults = {
		fileFormats: [ "jpg", "jpeg", "png", "gif", "pdf", "csv" ],
		uploadListener: null,
		preview: true
	};

})( jQuery );

/**
 * Form Info is a small plugin to flip form information and form fields. The form information can be formed only by labels whereas fields can be formed using labels and form elements.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtFormInfo = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtFormInfo.defaults, options );
		var forms			= this;

		// Iterate and initialise all the menus
		forms.each( function() {

			var form = cmtjq( this );

			init( form );
		});

		// return control
		return;

		// == Private Functions == //

		function init( form ) {

			form.find( ".btn-edit" ).click( function() {

				var info = jQuery( this ).parent().find( ".wrap-info" );
				var form = jQuery( this ).parent().find( ".wrap-form" );

				if( info.is( ":visible" ) ) {

					info.hide();
					form.fadeIn( "slow" );
				}
				else {

					info.fadeIn( "fast" );
					form.hide();			
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtFormInfo.defaults = {
		// default config
	};

})( jQuery );

/**
 * Perspective Header plugin can be used to change header styling by adding header-small class on scolling a pre-defined amount.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtHeader = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtHeader.defaults, options );
		var screenWidth		= window.innerWidth;
		var headers			= this;

		// Iterate and initialise all the page modules
		headers.each( function() {

			var header	= cmtjq( this );

			init( header );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Header
		function init( header ) {

			if( screenWidth > settings.minWidth ) {

			    window.addEventListener( 'scroll', function( e ) {

			        var distanceY		= window.pageYOffset || document.documentElement.scrollTop;
			        var scrollDistance 	= settings.scrollDistance;
	
			        if ( distanceY > scrollDistance ) {
	
			            header.addClass( "header-small" );
			            
			            if( header.hasClass( "hidden" ) ) {
			            	
			            	header.slideDown( 'slow' ); 
			            }
			        }
			        else {

			            if ( header.hasClass( "header-small" ) ) {
			
			                header.removeClass( "header-small" );
			            }

			            if( header.hasClass( "hidden" ) ) {
			            	
			            	header.slideUp( 'false' ); 
			            }
			        }
			    });
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtHeader.defaults = {
		minWidth: 1024,
		scrollDistance: 300
	};

})( jQuery );

/**
 * LatLongPicker allows us to set marker based on given longitude, latidude. 
 * It also find the latitude/longitude for given address and set marker accordingly.
 */

( function( cmtjq ) {

	cmtjq.fn.latLongPicker = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 	= cmtjq.extend( {}, cmtjq.fn.latLongPicker.defaults, options );
		var maps		= this;

		// Iterate and initialise all the page blocks
		maps.each( function() {

			var mapPicker	= cmtjq( this );

			init( mapPicker );
		});

		// return control
		return;

		// == Private Functions == //

		function init( mapPicker ) {

			// Initialise Google Map
			var gMap	= initMapPicker( mapPicker );
		}

		function initMapPicker( mapPicker ) {

			var mapOptions 	= cmtjq.extend( true, {}, settings.mapOptions );
			var element 	= mapPicker.find( '.google-map' ).get( 0 );
			var latitude 	= mapPicker.find( '.latitude' );
			var longitude 	= mapPicker.find( '.longitude' );
			var zoom 		= mapPicker.find( '.zoom' );

			// Found fields
			if( latitude.length > 0 && longitude.length > 0 ) {

				latitude	= parseFloat( latitude.val() );
				longitude	= parseFloat( longitude.val() );
				zoom		= parseInt( zoom.val() );

				if( !cmtjq.isNumeric( latitude ) && !cmtjq.isNumeric( longitude ) ) {

					latitude	= settings.latitude;
					longitude	= settings.longitude;

					mapPicker.find( '.latitude' ).val( latitude );
					mapPicker.find( '.longitude' ).val( longitude );
				}

				// Update Zoom Level
				if( cmtjq.isNumeric( zoom ) ) {

					mapOptions.zoom = zoom;
				}
			}

			// Default map type
			if( null == mapOptions.mapTypeId ) {

				mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
			}

			mapOptions.center	= new google.maps.LatLng( latitude, longitude );
			var gMap 			= new google.maps.Map( element, mapOptions );
			var marker			= initMarker( mapPicker, gMap, mapOptions );

			// search locations using geocoder 
			if( settings.geocoder ) {

				var geocoder 		= new google.maps.Geocoder();
	
				mapPicker.find( '.search-box' ).change( function() {
	
					var address	= cmtjq( this ).val();
	
					geocoder.geocode( { 'address': address }, function( results, status ) {
	
						if( status == google.maps.GeocoderStatus.OK ) {

							var location	= results[ 0 ].geometry.location;

							updateCenter( mapPicker, gMap, location, marker );
						}
					});
				});
			}

			// search locations using places for text
			if( settings.places ) {

				var placeService	= new google.maps.places.PlacesService( gMap );

				mapPicker.find( '.search-box' ).change( function() {

					var address	= cmtjq( this ).val();
					var request = { query: address };

					placeService.textSearch( request, function( results, status ) {

						if( status == google.maps.places.PlacesServiceStatus.OK ) {

							var location	= results[ 0 ].geometry.location;

							updateCenter( mapPicker, gMap, location, marker );
						}
					});
				});
			}

			return gMap;
		}

		function initMarker( mapPicker, gMap, mapOptions ) {

			var marker = new google.maps.Marker({
								position: mapOptions.center,
								map: gMap,
								title: settings.markerTitle,
								draggable: true
							});

			google.maps.event.addListener( marker, 'dragend', function( evt ) {

				updatePosition( mapPicker, gMap, marker.position );
			});

			google.maps.event.addListener( gMap, 'dblclick', function( evt ) {

				updatePositionWithMarker( mapPicker, gMap, evt.latLng, marker );
			});

			google.maps.event.addListener( gMap, 'click', function( evt ) {

				updatePositionWithMarker( mapPicker, gMap, evt.latLng, marker );
			});

			google.maps.event.addListener( gMap, 'zoom_changed', function() {

				resetZoom( mapPicker, gMap );
			});
			
			return marker;
		}

		function updatePosition( mapPicker, gMap, position ) {

			mapPicker.find( '.latitude' ).val( position.lat );
			mapPicker.find( '.longitude' ).val( position.lng );
			
			resetZoom( mapPicker, gMap );
		}

		function updatePositionWithMarker( mapPicker, gMap, position, marker ) {

			updatePosition( mapPicker, gMap, position );

			marker.setPosition( position );
		}

		function resetZoom( mapPicker, gMap ) {

			mapPicker.find( '.zoom' ).val( gMap.getZoom() );
		}

		function updateCenter( mapPicker, gMap, position, marker ) {

			updatePosition( mapPicker, gMap, position );
			
			gMap.setCenter( position );
			marker.setPosition( position );
		}
	};

	// Default Settings
	cmtjq.fn.latLongPicker.defaults = {
		map: null,
		latitude: 0,
		longitude: 0,
		markerTitle: 'My Location',
		geocoder: false,
		places: true,
		mapOptions : {
	    	zoom: 3,
	    	mapTypeId: null,
	    	mapTypeControl: false,
			zoomControlOptions: true,
			disableDoubleClickZoom: true
		}
	};

})( jQuery );

/**
 * Sliding Menu is a special pop-up displayed on clicking the element defined while initialising the plugin.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtSlidingMenu = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtSlidingMenu.defaults, options );
		var menus			= this;

		// Iterate and initialise all the menus
		menus.each( function() {

			var menu = cmtjq( this );

			init( menu );
		});

		// return control
		return;

		// == Private Functions == //

		function init( menu ) {
			
			if( settings.mainMenu ) {

				var documentHeight 	= cmtjq( document ).height();
				var screenWidth		= cmtjq( window ).width();

				// Parent to cover document
				menu.css( { 'top': '0px', 'left': '0px', 'height': documentHeight, 'width': screenWidth } );
			}
			
			if( null != settings.showTrigger ) {

				cmtjq( settings.showTrigger ).click( function() {
	
					menu.fadeIn();
	
					var slider	= menu.find( '.vnav-slider' );
	
					if( settings.position == 'left' ) {
						
						slider.animate( { left: 0 } );
					}
					else if( settings.position == 'right' ) {
	
						slider.animate( { right: 0 } );
					}
				});
			}

			if( null != settings.hideTrigger ) {

				cmtjq( settings.hideTrigger ).click( function() {
	
					menu.fadeOut();
					
					var slider	= menu.find( '.vnav-slider' );
	
					if( settings.position == 'left' ) {
	
						slider.animate( { left: -( slider.width() ) } );
					}
					else if( settings.position == 'right' ) {
						
						slider.animate( { right: -( slider.width() ) } );
					}
				});
			}

			menu.find( '.btn-close' ).click( function() {
				
				menu.fadeOut();
				
				var slider	= menu.find( '.vnav-slider' );

				if( settings.position == 'left' ) {

					slider.animate( { left: -( slider.width() ) } );
				}
				else if( settings.position == 'right' ) {
					
					slider.animate( { right: -( slider.width() ) } );
				}
			});

			// Filler Layer to listen for close
			var bkgFiller	= menu.find( ".popup-bkg-filler" );

			if( bkgFiller.length > 0 ) {

				bkgFiller.css( { 'top': '0px', 'left': '0px', 'height': documentHeight, 'width': screenWidth } );

				bkgFiller.click( function() {

					menu.fadeOut( "fast" );
				});
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtSlidingMenu.defaults = {
		position: 'left',
		showTrigger: null,
		hideTrigger: null,
		mainMenu: false
	};

})( jQuery );

/**
 * The Pop-up plugin can be used to show pop-ups. Most common usage is modal dialogs.
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

})( jQuery );


function showPopup( popupSelector ) {

	jQuery( popupSelector ).fadeIn( "slow" );
}

function closePopup( popupSelector ) {

	jQuery( popupSelector ).fadeOut( "slow" );
}

/* Show default error popup */
function showErrorPopup( errors ) {

	jQuery( "#popup-error .popup-content" ).html( errors );

	showPopup( "#popup-error" );
}

function hideErrorPopup() {

	closePopup( "#popup-error" );
}

/* Show default message popup */
function showMessagePopup( message ) {

	jQuery( "#popup-message .popup-content" ).html( message );

	showPopup( "#popup-message" );
}

function hideMessagePopup() {

	closePopup( "#popup-message" );
}

/**
 * It's a custom select plugin used to wrap original select using overlapping html elements and hiding the select element.
 */

( function( cmtjq ) {

// TODO: Add option for multi select

	cmtjq.fn.cmtSelect = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtSelect.defaults, options );
		var dropDowns		= this;

		// Iterate and initialise all the fox sliders
		dropDowns.each( function() {

			var dropDown = cmtjq( this );

			init( dropDown );
		});

		// return control
		return;

		// == Private Functions == //
		
		/**
		 * 1. Find the selected option if there is any.
		 * 2. Wrap the select in a div and access the wrapper div.
		 * 3. If copyId config is set, the select id attribute will be moved to wrapper div.
		 * 4. The class cmt-select-wrap will be assigned to wrapper div.
		 * 5. If wrapperClass config is set, these additional classes will be assigned to wrapper div.
		 * 6. The icon span having class s-icon will be created. If iconClass and iconHtml are set, the icon span will be assigned these classes and html.
		 * 7. The custom select div will be created having class cmt-select and child div element having class cmt-selected.
		 * 8. The span having class s-text will be appended to cmt-selected div. The span s-icon will follow s-text.
		 * 9. A ul having class cmt-select-list will be appended to cmt-select.
		 * 10. The select options will be iterated and li elements will be formed and appended to cmt-select-list.
		 * 11. The custom select i.e. cmt-select will be appended to wrapper div i.e. cmt-select-wrap.
		 * 12. The cmt-select-list will be hidden by default.
		 * 13. If select is disabled, disabled class will be assigned to custom select.
		 * 14. Toggle behaviour added to cmt-selected for cmt-select-list.
		 * 15. Click listener added to all the list elements to change select value and update s-text of cmt-selected.
		 * 16. Global listener added to hide select list if user click on other area.
		 */
		function init( dropDown ) {

			// Find Selected Option
			var selected	= dropDown.children( 'option:selected' );

			// Wrap Select
			dropDown.wrap( '<div></div>' );

			var wrapper		= dropDown.parent();

			if( settings.copyId ) {

				// Find select Id
				var selectId	= dropDown.attr( 'id' );

				// Transfer Id to wrapper
				if( null != selectId && selectId.length > 0 ) {

					// Remove select Id
					dropDown.attr( 'id', null );

					// Move id to wrapper div
					wrapper.attr( 'id', selectId );
				}
			}

			// Assign class to wrapper
			wrapper.addClass( 'cmt-select-wrap' );

			if( null != settings.wrapperClass ) {

				wrapper.addClass( settings.wrapperClass );
			}

			// Generate Icon Html
			var iconHtml	= '<span class="s-icon">';

			if( null != settings.iconClass ) {

				iconHtml	= '<span class="s-icon ' + settings.iconClass + '">';
			}
			
			if( null != settings.iconHtml ) {

				iconHtml	+= settings.iconHtml + "</span>";
			}
			else {

				iconHtml	+= "</span>";
			}

			// Generate Custom Select Html
			var customHtml	= "<div class='cmt-select'><div class='cmt-selected'><span class='s-text'>" + selected.html() + "</span>" + iconHtml + "</div><ul class='cmt-select-list'>";

			// Iterate select options
		    dropDown.find( 'option' ).each( function( index ) {

				customHtml += '<li data-value="' + jQuery( this ).val() + '">' + jQuery( this ).html() + '</li>';
		    });

			customHtml += '</ul></div>';

			// Append Custom Select to wrapper
			wrapper.append( customHtml );

			var customSelect	= wrapper.children( '.cmt-select' );
			var customSelected	= wrapper.children( '.cmt-select' ).children( '.cmt-selected' );
			var customList		= wrapper.children( '.cmt-select' ).children( '.cmt-select-list' );
			
			// Hide List by default
			customList.hide();
			
			// Detect whether disabled
			var disabled = dropDown.attr( 'disabled' );
			
			if( disabled == 'disabled' || disabled ) {
				
				customSelected.addClass( 'disabled' );
			}
			else {

				// Add listener to selected val
				customSelected.click( function( e ) {

					var visible = customList.is( ':visible' );

					customList.hide();
					jQuery( document ).unbind( 'keyup' );

					if( !visible ) {

						customList.show();

						jQuery( document ).on( 'keyup', function( e ) {

							var character = String.fromCharCode( e.keyCode );

							customList.children( 'li' ).each( function() {

								var item = jQuery( this );

								if( item.html().substr( 0, 1 ).toUpperCase() == character ) {

									customList.animate( { scrollTop: item.offset().top - customList.offset().top + customList.scrollTop() } );

									return false;
							    }
							});
						});
					}

					e.stopPropagation();
				});

				// Update selected value
				customList.children( 'li' ).click( function() {

					var selected	= jQuery( this );
					var parent		= selected.parents().eq( 1 );

					parent.children( '.cmt-selected' ).children( '.s-text' ).html( selected.html() );
					parent.parent().children( 'select' ).val( selected.attr( 'data-value' ) ).change();

					customList.hide();
					jQuery( document ).unbind( 'keyup' );
				});

				cmtjq( document ).on( 'click', function( e ) {

			        if ( cmtjq( e.target ).closest( customList ).length === 0 ) {

			            customList.hide();
			            jQuery( document ).unbind( 'keyup' );
			        }
				});
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtSelect.defaults = {
		multi: false,
		copyId: false,
		wrapperClass: null,
		iconClass: null,
		iconHtml: null
	};

	// Utility method to reset the select after getting new values
	cmtjq.fn.cmtSelect.resetSelect = function( selectWrap, optionsHtml ) {

		var dropDown	= selectWrap.find( 'select' );

		dropDown.html( optionsHtml );

		var selected	= dropDown.children( 'option:selected' );
	 	var list		= selectWrap.find( '.cmt-select-list' );
	 	var sText		= selectWrap.find( '.cmt-selected' ).children( '.s-text' );
		var listHtml	= '';

		dropDown.children( 'option' ).each( function( index ) {

			listHtml += '<li data-value="' + jQuery( this ).val() + '">' + jQuery( this ).html() + '</li>';
		});

		sText.html( selected.html() );
		list.html( listHtml );

		list.children( 'li' ).click( function() {

			var selected	= jQuery( this );
			var parent		= selected.parents().eq( 1 );

			sText.html( selected.html() );
			dropDown.val( selected.attr( 'data-value' ) ).change();

			list.hide();
			jQuery( document ).unbind( 'keyup' );
		});
	};

})( jQuery );

/**
 * A simple slider(simplified version of FoxSlider arranged in filmstrip fashion) to slide UI elements in circular fashion. We can use FoxSlider for more complex scenarios.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtSlider = function( options ) {

		// == Init =================================================================== //

		// Configure Sliders
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtSlider, options );
		var sliders			= this;

		// Iterate and initialise all the fox sliders
		sliders.each( function() {

			var slider	= cmtjq( this );

			init( slider );
		});

		// Windows resize
		cmtjq( window ).resize(function() {

			// Iterate and resize all the fox sliders
			sliders.each( function() {

				var slider	= cmtjq( this );

				normaliseSlides( slider );
			});
		});

		// return control
		return;

		// == Private Functions ===================================================== //

		// == Bootstrap ==================================== //

		// Initialise Slider
		function init( slider ) {

			// Update Slider html
			initSliderHtml( slider );

			// Set Slider and Slides based on configuration params
			normaliseSlides( slider );

			// Initialise controls
			initControls( slider );
		}

		// Update Slider html
		function initSliderHtml( slider ) {

			// Add slide class to all the slides
			slider.children().each( function() {

				var slide = cmtjq( this );

				slide.addClass( 'slide' );
			});

			// wrap the slides
			var sliderHtml		= '<div class="slides-wrap">' + slider.html() + '</div>';
			sliderHtml		   += '<div class="control control-left"></div><div class="control control-right"></div>';

			slider.html( sliderHtml );
		}

		// Make filmstrip of all slides
		function normaliseSlides( slider ) {

			// Calculate and set Slider Width
			var sliderWidth		= slider.width();
			var sliderHeight	= slider.height();
			var slidesWrapper	= slider.find( '.slides-wrap' );
			var slidesSelector	= slider.find( '.slide' );

			var slideWidth		= slidesSelector.width();
			var slidesCount		= slidesSelector.length;

			// Initialise Slide position
			var currentPosition	= 0;

			slidesWrapper.width( slideWidth * slidesCount );

			// Set slides position on filmstrip
			slidesSelector.each( function( count ) {

				var currentSlide	= cmtjq( this );

				currentSlide.css( 'left', currentPosition );

				currentSlide.attr( 'slide', count );

				currentPosition += slideWidth;

				resetSlide( slider, currentSlide );
			});

			if( slidesWrapper.width() < slider.width() ) {

				if( null != settings.smallerContent ) {
	
					settings.smallerContent( slider, slidesWrapper );
				}
			}
		}

		// Initialise the Slider controls
		function initControls( slider ) {
			
			var slidesWrapper	= slider.find( '.slides-wrap' );

			if( slidesWrapper.width() < slider.width() ) {

				return;
			}

			// Show Controls
			var controls 		= slider.find( '.controls' );
			var lControlContent	= settings.lControlContent;
			var rControlContent	= settings.rControlContent;

			// Init Listeners				
			var leftControl		= slider.find( '.control-left' );
			var rightControl	= slider.find( '.control-right' );

			leftControl.html( lControlContent );
			rightControl.html( rControlContent );

			leftControl.click( function() {

				showPrevSlide( cmtjq( this ).closest( '.cmt-slider' ) );
			});

			rightControl.click( function() {

				showNextSlide( cmtjq( this ).closest( '.cmt-slider' ) );
			});
		}

		function resetSlide( slider, slide ) {

			if( null != settings.onSlideClick ) {

				// remove existing click event
				slide.unbind( 'click' );

				// reset click event
				slide.click( function() {

					settings.onSlideClick( slider, slide, slide.attr( 'slide' ) );
				});
			}
		}

		// == Slides Movements ============================= //

		// Calculate and re-position slides to form filmstrip
		function resetSlides( slider ) {

			var slidesSelector	= slider.find( '.slide' );
			var slideWidth		= slidesSelector.width();
			var currentPosition	= 0;
			var filmstrip		= slider.find( '.slides-wrap' );

			// reset filmstrip
			filmstrip.css( { left: 0 + 'px', 'right' : '' } );

			slidesSelector.each( function() {

				cmtjq( this ).css( { 'left': currentPosition + 'px', 'right' : '' } );
				cmtjq( this ).removeClass( 'active' );

				currentPosition += slideWidth;
			});
		}

		// Show Previous Slide on clicking next button
		function showNextSlide( slider ) {

			var slidesSelector	= slider.find( '.slide' );
			var firstSlide		= slidesSelector.first();
			var slideWidth		= firstSlide.width();
			var filmstrip		= slider.find( '.slides-wrap' );

			// do pre processing
			if( null != settings.preSlideChange ) {

				settings.preSlideChange( slider, firstSlide, firstSlide.attr( 'slide' ) );				
			}

			// do animation - animate slider
			filmstrip.animate(
				{ left: -slideWidth },
				{
					duration: 500,
					complete: function() {

						var slider = cmtjq( this ).parent();

						// Remove first and append to last
						var slidesSelector	= slider.find( '.slide' );
						var firstSlide		= slidesSelector.first();
						firstSlide.insertAfter( slidesSelector.eq( slidesSelector.length - 1 ) );
						firstSlide.css( 'right', -slideWidth );

						resetSlides( slider );
						//resetSlide( slider, firstSlide );
					}
				}
			);

			firstSlide	= slidesSelector.first();

			// do post processing
			if( null != settings.postSlideChange ) {

				settings.postSlideChange( slider, firstSlide, firstSlide.attr( 'slide' ) );				
			}
		}

		// Show Next Slide on clicking previous button
		function showPrevSlide( slider ) {

			var slidesSelector	= slider.find( '.slide' );
			var firstSlide		= slidesSelector.first();
			var slideWidth		= firstSlide.width();
			var filmstrip		= slider.find( '.slides-wrap' );

			// do pre processing
			if( null != settings.preSlideChange ) {

				settings.preSlideChange( slider, firstSlide, firstSlide.attr( 'slide' ) );
			}

			// Remove last and append to first
			var lastSlide		= slidesSelector.last();
			lastSlide.insertBefore( slidesSelector.eq(0) );
			lastSlide.css( 'left', -slideWidth );
			var activeSlide		= lastSlide.attr( 'slide' );

			// do animation - animate slider
			filmstrip.animate(
				{ left: slideWidth },
				{
					duration: 500,
					complete: function() {

						var slider = cmtjq( this ).parent();

						resetSlides( slider );
					}
				}
			);

			firstSlide	= slidesSelector.first();

			// do post processing
			if( null != settings.postSlideChange ) {

				settings.postSlideChange( slider, firstSlide, firstSlide.attr( 'slide' ) );				
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtSlider.defaults = {
		// Controls
		lControlContent: null,
		rControlContent: null,
		// Callback - Content is less than slider
		smallerContent: null,
		// Listener Callback for slide click
		onSlideClick: null,
		// Listener Callback for pre processing
		preSlideChange: null,
		// Listener Callback for post processing
		postSlideChange: null
	};

})( jQuery );

/**
 * Smooth Scroll plugin can be used to listen for hash tags to scroll smoothly to pre-defined page sections.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtSmoothScroll = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtSmoothScroll.defaults, options );
		var elements		= this;

		// Iterate and initialise all the page modules
		elements.each( function() {

			var element	= cmtjq( this );

			init( element );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Element
		function init( element ) {

			element.on( 'click', function ( e ) {

			    e.preventDefault();

			    var targetId 	= this.hash;
			    var target 		= cmtjq( targetId );
		
			    jQuery('html, body').stop().animate(
			    	{ 'scrollTop': ( target.offset().top ) }, 
			    	900, 
			    	'swing', 
			    	function () {
		
				        window.location.hash = targetId;				        
			    	}
			    );
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtSmoothScroll.defaults = {

	};

})( jQuery );

// TODO: Add Data Binding Support to bind data sent by server to respective ui component
// TODO: Add Data Binding with Pagination for Data Grid
// TODO: Add Page History and Caching Support

/**
 * CMGTools API library provide methods to process AJAX request. These requests can be either form or regular
 */

cmt.api = {};

/**
 * Key Concepts
 * -------------------------
 * 1. Application
 * 2. Controller
 * 3. Action
 * 4. User
 * 5. Route
 * 6. Request Element
 * 7. Trigger Element
 * 8. Get, Post, Put and Delete
 * 9. View
 * 
 * An application is a collection of app config and controllers. Each controller can define several actions that can be executed by app user. 
 * A project can create multiple applications based on it's needs. The request triggers present within request elements use the Request Processing Engine 
 * to fire submitted requests to controllers for pre and post processing. The request elements can also specify the controller, action, route, method and 
 * consist of at least one trigger to fire the request.
 * 
 * Apart from request elements and request triggers, we can also call the application methods to process request directly via get, post, put or delete.
 * 
 * The CMT API does not provided functionality to render view, leaving the view template engine as a choice for developer. Moustache, Handlebars are few 
 * among the well know templating engines used to render view. These can be used to render view while post processing a particular request utilising data 
 * sent back by server. 
 */

cmt.api.Application = function( options ) {

	/**
	 * Config Object
	 */
	this.config = {
		json: false, 				// Identify whether all the request must be processed using json format
		basePath: null,				// Base path to be used to create requests.
		csrfGet: false,				// CSRF Token for Get Request
		errorClass: '.error',		// Default css class for error elements
		messageClass: '.message',	// Default css class for showing request result as message
		spinnerClass: '.spinner'	// Default css class for showing spinner till the request gets processed
	};

	// Merge default config and application options
	jQuery.extend( this.config, options );

	// Default controller to be used as fallback in case no controller is mentioned
	var defaultController	= cmt.api.Application.CONTROLLER_DEFAULT;

	// TODO: Add Apix and REST based default controllers to handle CRUD operations.

	// TODO: Add routing table to automatically detect controller based on request route.

	/**
	 * -----------------------------
	 * Routing
	 * -----------------------------
	 * Request routing in CMGTools JS - MVC is handled by controllers map which is an associative array of controller name and classpath. The app should 
	 * know all the controllers it's dealing with. It also maintains a seperate map of active controllers which are already initialised. The active controllers map 
	 * is associative array of controller name and object.
	 * 
	 * The Request Processing Engine use the pre-defined controllers to process a request and fallback to default controller and action in case it does not 
	 * find appropriate controller and action.
	 */

	/**
	 * An exhaustive map of all the controllers (alias, classpath) available for the application. Each application can use this map to maintain it's controllers list.
	 */
	this.controllers 						= [];
	this.controllers[ defaultController ] 	= 'cmt.api.controllers.DefaultController';

	/**
	 * Map of all the active controllers (alias, object) which are already initialised. It will save us from re-initialising controllers.
	 */
	this.activeControllers 	= [];
};

/**
 * App Globals
 */

//Defaults
cmt.api.Application.CONTROLLER_DEFAULT	= 'default';			// Default Controller Alias
cmt.api.Application.ACTION_DEFAULT		= 'default';			// Default Controller's default Action

// Static - Attributes - Request Element
cmt.api.Application.STATIC_CONTROLLER	=  'cmt-controller';	// Controller attribute set on request element.
cmt.api.Application.STATIC_ACTION		=  'cmt-action';		// Action attribute set on request element.
cmt.api.Application.STATIC_CUSTOM		=  'cmt-custom';		// Identify whether custom data is required.
cmt.api.Application.STATIC_ID			=  'id';				// Id to uniquely identify request element.
cmt.api.Application.STATIC_KEEP			=  'cmt-keep';			// The keep attribute specify whether request element's form fields need to be retained on success.

// Static - Attributes - Errors
cmt.api.Application.STATIC_ERROR		=  'cmt-error';			// The error element to display model property validation failure.

// Static - Triggers
cmt.api.Application.STATIC_CLICK		=  '.cmt-click';		// The class to be set for trigger element which fire request on click.
cmt.api.Application.STATIC_CHANGE		=  '.cmt-change';		// The class to be set for trigger element which fire request on value change.
cmt.api.Application.STATIC_KEY_UP		=  '.cmt-key-up';		// The class to be set for trigger element which fire request on key up.
cmt.api.Application.STATIC_BLUR			=  '.cmt-blur';			// The class to be set for trigger element which fire request on key up.

/**
 * -----------------------------
 * Request Processing Engine (RPE)
 * -----------------------------
 * The Request Processing Engine (RPE) process the requests by initialising the request elements having appropriate trigger. 
 * These triggers can be form submit, button click, select change. We can use the jQuery plugin to register these triggers. Example:
 * 
 * jQuery( '<selector>' ).cmtRequestProcessor( { app: <application> } );
 * 
 * The selectors passed to request processor plugin forming the view i.e. request element can wrap form elements and the trigger element. A request can be fired 
 * based on trigger type and user action. The request triggers pass request to RPE which further find the appropriate controller and initialise it for 
 * first time and update active controllers map. RPE is responsible for calling pre processor method(if exist) for identified action and pass request to
 * backend. RPE also process response sent back by server and pass it to post processor method(if exist). The controller might define pre and post processor methods 
 * for an action. The post processor method can define logic to handle response and use appropriate templating engine to update view.
 */

// Controller Detection ----------------------------------

cmt.api.Application.prototype.findController = function( alias ) {

	// Return active controller
	if( this.activeControllers[ alias ] ) {

		return this.activeControllers[ alias ];
	}
	// Create a controller instance from registered controllers
	else {

		try {

			// Check whether controller is registered and throw exception
			if( this.controllers[ alias ] == undefined ) throw 'Controller with alias ' + alias + ' is not registered with this application.';

			var controller 	= cmt.utils.object.strToObject( this.controllers[ alias ] );

			// Initialise Controller
			controller.init();

			// Add to active registry
			this.activeControllers[ alias ] = controller;

			return this.activeControllers[ alias ];
		}
		catch( err ) {

			console.log( err );

			console.log( 'Falling back to default controller.' );

			if( this.controllers[ cmt.api.Application.CONTROLLER_DEFAULT ] !== undefined ) {

				return this.findController( cmt.api.Application.CONTROLLER_DEFAULT );
			}
		}
	}
};

// Register Request Elements -----------------------------

/**
 * Initialise request elements
 * @param requestElements - All the request elements having trigger passed by JQuery selector using application plugin.
 */
cmt.api.Application.prototype.registerElements = function( requestElements ) {

	var app	= this;

	// Iterate and initialise all the requests
	requestElements.each( function() {

		var requestElement = jQuery( this );

		// Form Submits
		if( requestElement.is( 'form' ) ) {

			requestElement.unbind( 'submit' );

			requestElement.submit( function( event ) {

				event.preventDefault();

				app.triggerRequest( requestElement, true );
			});
		}

		// Button Clicks
		var clickTrigger = requestElement.find( cmt.api.Application.STATIC_CLICK );

		if( clickTrigger.length > 0 ) {

			clickTrigger.unbind( 'click' );

			clickTrigger.click( function( event ) {

				event.preventDefault();

				app.triggerRequest( requestElement, false );
			});
		}

		// Select Change
		var selectTrigger = requestElement.find( cmt.api.Application.STATIC_CHANGE );

		if( selectTrigger.length > 0 ) {

			selectTrigger.unbind( 'change' );

			selectTrigger.change( function() {

				app.triggerRequest( requestElement, false );
			});
		}

		// Key Up
		var keyupTrigger = requestElement.find( cmt.api.Application.STATIC_KEY_UP );

		if( keyupTrigger.length > 0 ) {

			keyupTrigger.unbind( 'keyup' );

			keyupTrigger.keyup( function() {

				app.triggerRequest( requestElement, false );
			});
		}

		// Blur
		var blurTrigger = requestElement.find( cmt.api.Application.STATIC_BLUR );

		if( blurTrigger.length > 0 ) {

			blurTrigger.unbind( 'blur' );

			blurTrigger.blur( function() {

				app.triggerRequest( requestElement, false );
			});
		}
	});
};

// Handle Request Elements Triggers ----------------------

cmt.api.Application.prototype.triggerRequest = function( requestElement, isForm ) {

	var controllerName	= requestElement.attr( cmt.api.Application.STATIC_CONTROLLER );
	var actionName		= requestElement.attr( cmt.api.Application.STATIC_ACTION );

	// Use default controller
	if( null == controllerName ) {

		controllerName = cmt.api.Application.CONTROLLER_DEFAULT;
	}

	// Use default action
	if( null == actionName ) {

		actionName = cmt.api.Application.ACTION_DEFAULT;
	}

	// Search Controller
	var controller	= this.findController( controllerName );

	if( isForm ) {

		if( this.config.json ) {

			this.handleJsonForm( requestElement, controller, actionName );
		}
		else {

			this.handleDataForm( requestElement, controller, actionName );
		}
	}
	else {

		this.handleRequest( requestElement, controller, actionName );
	}
};

cmt.api.Application.prototype.handleJsonForm = function( requestElement, controller, actionName ) {

	// Pre process
	if( this.preProcessRequest( requestElement, controller, actionName ) ) {

		// Generate form data for submission
		var formData	= controller.requestData;
		var method		= requestElement.attr( 'method' );

		if( !requestElement.is( '[' + cmt.api.Application.STATIC_CUSTOM + ']' ) ) {

			if( null != method && method.toLowerCase() == 'get' && !this.config.csrfGet ) {

				formData	= cmt.utils.data.formToJson( requestElement, false );
			}
			else {

				formData	= cmt.utils.data.formToJson( requestElement );
			}
		}

		// process request
		this.processRequest( requestElement, controller, actionName, formData );
	}

	return false;
};

cmt.api.Application.prototype.handleDataForm = function( requestElement, controller, actionName ) {

	// Pre process
	if( this.preProcessRequest( requestElement, controller, actionName ) ) {

		// Generate form data for submission
		var formData	= controller.requestData;
		var method		= requestElement.attr( 'method' );

		if( !requestElement.is( '[' + cmt.api.Application.STATIC_CUSTOM + ']' ) ) {

			if( null != method && method.toLowerCase() == 'get' && !this.config.csrfGet ) {

				formData	= cmt.utils.data.serialiseForm( requestElement, false );
			}
			else {

				formData	= cmt.utils.data.serialiseForm( requestElement );
			}
		}

		// Process request
		this.processRequest( requestElement, controller, actionName, formData );
	}

	return false;
};

cmt.api.Application.prototype.handleRequest = function( requestElement, controller, actionName ) {

	// Pre process
	if( this.preProcessRequest( requestElement, controller, actionName ) ) {

		// Generate request data for submission
		var requestData	= controller.requestData;
		var method		= requestElement.attr( 'method' );

		if( !requestElement.is( '[' + cmt.api.Application.STATIC_CUSTOM + ']' ) ) {

			if( null != method && method.toLowerCase() == 'get' && !this.config.csrfGet ) {

				requestData	= cmt.utils.data.serialiseElement( requestElement, false );
			}
			else {

				requestData	= cmt.utils.data.serialiseElement( requestElement );
			}
		}

		// Process request
		this.processRequest( requestElement, controller, actionName, requestData );
	}

	return false;
};

// Process Request Elements Triggers ---------------------

cmt.api.Application.prototype.preProcessRequest = function( requestElement, controller, actionName ) {

	var preAction	= actionName + 'ActionPre';

	// Hide message element
	requestElement.find( this.config.messageClass ).hide();

	// Hide all errors
	requestElement.find( this.config.errorClass ).hide();

	// Pre Process Request
	if( typeof controller[ preAction ] !== 'undefined' && !( controller[ preAction ]( requestElement ) ) ) {

		return false;
	}

	// Show Spinner
	requestElement.find( this.config.spinnerClass ).show();
	
	return true;
};

cmt.api.Application.prototype.processRequest = function( requestElement, controller, actionName, requestData ) {

	var app			= this;
	var httpMethod	= 'post';
	var actionUrl	= requestElement.attr( 'action' );

	// Set method if exist
	if( requestElement.attr( 'method' ) ) {

		httpMethod	= requestElement.attr( 'method' );
	}

	if( null != app.config.basePath ) {

		actionUrl	= app.config.basePath + actionUrl;
	}

	if( this.config.json ) {

		jQuery.ajax({
			type: httpMethod,
			url: actionUrl,
			data: requestData,
			dataType: 'JSON',
			contentType: 'application/json;charset=UTF-8',
			success: function( response, textStatus, XMLHttpRequest ) {
	
				// Process response
				app.processResponse( requestElement, controller, actionName, response );
			}
		});
	}
	else {

		jQuery.ajax({
			type: httpMethod,
			url: actionUrl,
			data: requestData,
			dataType: 'JSON',
			success: function( response, textStatus, XMLHttpRequest ) {
	
				// Process response
				app.processResponse( requestElement, controller, actionName, response );
			}
		});
	}
};

cmt.api.Application.prototype.processResponse = function( requestElement, controller, actionName, response ) {

	var result 	= response[ 'result' ];
	var errors	= response[ 'errors' ];

	if( result == 1 ) {

		// Check to clear form data
		if( !requestElement.is( '[' + cmt.api.Application.STATIC_KEEP + ']' ) ) {
	
			// Clear all form fields
			requestElement.find( ' input[type="text"]' ).val( '' );
			requestElement.find( ' input[type="password"]' ).val( '' );
			requestElement.find( ' textarea' ).val( '' );
		}

		// Hide all errors
		requestElement.find( this.config.errorClass ).hide();
	}
	else if( result == 0 ) {

		// Show Errors
		for( var key in errors ) {

        	var fieldName 		= key;
        	var errorMessage 	= errors[ key ];
        	var errorField		= requestElement.find( ' span[' + cmt.api.Application.STATIC_ERROR + '="' + fieldName + '"]' );

        	errorField.html( errorMessage );
        	errorField.show();
    	}
	}

	this.postProcessResponse( requestElement, controller, actionName, response );
};

cmt.api.Application.prototype.postProcessResponse = function( requestElement, controller, actionName, response ) {

	var message		= requestElement.find( this.config.messageClass );
	var messageStr 	= response[ 'message' ];
	var postAction	= actionName + 'ActionPost';

	// Show message
	message.html( messageStr );
	message.show();

	// Hide Spinner
	requestElement.find( this.config.spinnerClass ).hide();

	// Pass the data for post processing
	if( typeof controller[ postAction ] !== 'undefined' ) {

		controller[ postAction ]( response[ 'result' ], requestElement, response );
	}
};

// Init Request Elements registration --------------------

/**
 * JQuery Plugin to initialise request elements having request triggers for the given application.
 */
( function( cmtjq ) {

	cmtjq.fn.cmtRequestProcessor = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 	= cmtjq.extend( {}, cmtjq.fn.cmtRequestProcessor.defaults, options );
		var app			= settings.app;

		if( null != app ) {

			// Initialise application
			app.controllers	= cmtjq.extend( [], app.controllers, settings.controllers );

			app.registerElements( this );
		}

		// return control
		return;
	};

	// Default Settings
	cmtjq.fn.cmtRequestProcessor.defaults = {
		// The app which must handle these selectors
		app: null,
		// Used to add controllers dynamically
		controllers: []
	};

}( jQuery ) );

/**
 * Controller namespace providing base class for all the Controllers.
 */

cmt.api.controllers = cmt.api.controllers || {};

cmt.api.controllers.BaseController = function() {

	// Base Controller
};

cmt.api.controllers.BaseController.prototype.init = function() {

	// Init method to initialise controller
};

/** 
 * The DefaultController and classes extending it can be used to post arbitrary requests to server using the possible request triggers. 
 * It provides a default action as a fallback in case action is not specified by the Request Element.
 */
cmt.api.controllers.DefaultController = function() {

	this.requestData	= null;	// Request data to be appended for post requests. It can be prepared in pre processor.
};

cmt.api.controllers.DefaultController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.DefaultController.prototype.init = function() {

	console.log( "Initialised default controller." );
};

cmt.api.controllers.DefaultController.prototype.defaultActionPre = function( requestElement ) {

	console.log( "Pre processing default action." );

	return true;
};

cmt.api.controllers.DefaultController.prototype.defaultActionPost = function( result, requestElement, response ) {

	if( result ) {

		console.log( "Processing success for default action." );
	}
	else {

		console.log( "Processing failure for default action." );
	}
};

/** 
 * The GridController and classes extending it can be used to manage data grids providing searching, sorting and crud operations. 
 * It differs from RestController in default action names i.e. it provides default actions to perform actions including all, create, update and delete.
 */
cmt.api.controllers.GridController = function() {

	// Request and Collection
	this.endpoint	= null;	// Endpoint where all the requests need to be sent
	this.model		= null;	// The model name appended at last of endpoint and before action name. We do not need action name in case of get, post, put and delete.
	this.collection	= null; // The collection returned by server and cached locally.

	// Pagination
	this.pages		= 0;	// Total Pages formed using collection
	this.pageLimit	= 0;	// Total items in a page
	this.lastPage	= 0;	// The last page loaded when user scroll to bottom
};

cmt.api.controllers.GridController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.GridController.prototype.init = function() {

	console.log( "Initialised grid controller." );
};

// Read --------------------------

cmt.api.controllers.GridController.prototype.allActionPre = function() {

	console.log( "Pre processing all action." );

	return true;
};

cmt.api.controllers.GridController.prototype.allActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for all action." );
	}
	else {

		console.log( "Processing failure for all action." );
	}
};

// Create ------------------------

cmt.api.controllers.GridController.prototype.createActionPre = function() {

	console.log( "Pre processing create action." );

	return true;
};

cmt.api.controllers.GridController.prototype.createActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for create action." );
	}
	else {

		console.log( "Processing failure for create action." );
	}
};

// Update ------------------------

cmt.api.controllers.GridController.prototype.updateActionPre = function() {

	console.log( "Pre processing update action." );

	return true;
};

cmt.api.controllers.GridController.prototype.updateActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for update action." );
	}
	else {

		console.log( "Processing failure for update action." );
	}
};

// Delete ------------------------

cmt.api.controllers.GridController.prototype.deleteActionPre = function() {

	console.log( "Pre processing delete action." );

	return true;
};

cmt.api.controllers.GridController.prototype.deleteActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for delete action." );
	}
	else {

		console.log( "Processing failure for delete action." );
	}
};

/** 
 * The RequestController and classes extending it can be used to post arbitrary requests to server by calling execute method where actual request data will be formed.
 * It's required where Request Element and Request Trigger is not needed and request can be triggered by calling execute method.
 * 
 * Ex:
 * myApp.findController( 'user' ).defaultAction();
 */
cmt.api.controllers.RequestController = function() {

	this.requestData	= null;	// Request data for post requests
};

cmt.api.controllers.RequestController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.RequestController.prototype.init = function() {

	console.log( "Initialised default controller." );
};

cmt.api.controllers.RequestController.prototype.defaultAction = function() {

	console.log( "Pre processing default action." );

	// 1. Prepare request data

	// 2. Call method to process the request
};

cmt.api.controllers.RequestController.prototype.defaultActionPre = function() {

	console.log( "Pre processing default action." );

	return true;
};

cmt.api.controllers.RequestController.prototype.defaultActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for default action." );
	}
	else {

		console.log( "Processing failure for default action." );
	}
};

/** 
 * The RestController and classes extending it can be used to manage classical rest requests providing searching, sorting and crud operations. 
 * It provides default actions to perform rest actions including get, post, put and delete.
 */
cmt.api.controllers.RestController = function() {

	// Request and Collection
	this.endpoint	= null;	// Endpoint where all the requests need to be sent
	this.model		= null;	// The model name appended at last of endpoint and before action name. We do not need action name in case of get, post, put and delete.
	this.collection	= null; // The collection returned by server and cached locally.

	// Pagination
	this.pages		= 0;	// Total Pages formed using collection
	this.pageLimit	= 0;	// Total items in a page
	this.lastPage	= 0;	// The last page loaded when user scroll to bottom
};

cmt.api.controllers.RestController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.RestController.prototype.init = function() {

	console.log( "Initialised rest controller." );
};

// Get ---------------------------

cmt.api.controllers.RestController.prototype.getActionPre = function() {

	console.log( "Pre processing get action." );

	return true;
};

cmt.api.controllers.RestController.prototype.getActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for get action." );
	}
	else {

		console.log( "Processing failure for get action." );
	}
};

// Post --------------------------

cmt.api.controllers.RestController.prototype.postActionPre = function() {

	console.log( "Pre processing post action." );

	return true;
};

cmt.api.controllers.RestController.prototype.postActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for post action." );
	}
	else {

		console.log( "Processing failure for post action." );
	}
};

// Put ---------------------------

cmt.api.controllers.RestController.prototype.putActionPre = function() {

	console.log( "Pre processing put action." );

	return true;
};

cmt.api.controllers.RestController.prototype.putActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for put action." );
	}
	else {

		console.log( "Processing failure for put action." );
	}
};

// Delete ------------------------

cmt.api.controllers.RestController.prototype.deleteActionPre = function() {

	console.log( "Pre processing delete action." );

	return true;
};

cmt.api.controllers.RestController.prototype.deleteActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for delete action." );
	}
	else {

		console.log( "Processing failure for delete action." );
	}
};