/**
 * CMGTools JS - v1.0.0-alpha1 - 2015-11-04
 * Description: CMGTools JS is a JavaScript library which provide utilties, ui components and MVC framework implementation for CMSGears.
 * License: GPLv3
 * Author: Bhagwat Singh Chouhan
 */
// Global Namespace for CMGTools
var Cmt = Cmt || {};;// CMGTools Utilities - Collection of commonly used utility functions available for CMGTools
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

		        var dims = Cmt.utils.arDimensions( image, width, height );
				
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
};;/*
 * Dependencies: jquery
 */

( function( cmt ) {

	cmt.fn.cmtBlock = function( options ) {

		// == Init == //

		// Configure Blocks
		var settings 		= cmt.extend( {}, cmt.fn.cmtBlock.defaults, options );
		var blocks			= this;
		var screenHeight	= cmt( window ).height();
		var screenWidth		= cmt( window ).width();
		var blocksConfig	= settings.blocks;
		var blocksKeys		= Object.keys( blocksConfig );

		// Iterate and initialise all the page blocks
		blocks.each( function() {

			var block	= cmt( this );

			init( block );
		});

		// Initialise parallax
		if( settings.backgroundParallax ) {

			cmt( window ).scroll( scrollBackground );
		}

		// return control
		return;

		// == Private Functions == //

		// Initialise Block
		function init( block ) {

			// -- Apply Common Settings for all the Blocks

			// -- Apply Block Specific Settings

			if( cmt.inArray( block.attr( "id" ), blocksKeys ) >= 0 ) {

				var blockConfig			= blocksConfig[ block.attr( "id" ) ];
				var height					= blockConfig[ "height" ];
				var fullHeight				= blockConfig[ "fullHeight" ];
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
				}

				// Apply Full Height
				if( null == height && null == heightAuto && ( null != fullHeight && fullHeight ) ) {

					block.css( { 'height': screenHeight + "px" } );
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

				// Check whether additional css is required
				if( null != css && css ) {

					block.css( css );
				}
			}
			// Config in absence of block specific config
			else {

				// Apply Full Height
				if( settings.fullHeight ) {
	
					block.css( { 'height': screenHeight + "px" } );
				}
			}
		}

		// Initialise parallax
		function scrollBackground() {

			var winHeight 	= cmt( window ).height();
		    var winTop 		= cmt( window ).scrollTop();
		    var winBottom 	= winTop + winHeight;
		    var winCurrent 	= winTop + winHeight / 2;
		    
		    blocks.each( function( i ) {

		        var block 			= cmt( this );
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
	cmt.fn.cmtBlock.defaults = {
		// Controls
		fullHeight: true,
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

}( jQuery ) );;;;/*
 * Dependencies: jquery, cmt-utils
 */

// TODO: Validate for max file size if possible

// File Uploader Plugin
( function( cmt ) {

	cmt.fn.cmtFileUploader = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmt.extend( {}, cmt.fn.cmtFileUploader.defaults, options );
		var fileUploaders	= this;

		// Iterate and initialise all the uploaders
		fileUploaders.each( function() {

			var fileUploader = cmt( this );

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
					if( Cmt.utils.isCanvasSupported() && fileUploader.attr( "type" ) == "image" ) {

						fileUploader.find( ".preview canvas" ).hide();
					}

					fileUploader.find( ".chooser .input, .direct-chooser .input" ).val("");

					var progressContainer	= fileUploader.find( ".preloader .preloader-bar" );
	
					// Modern Uploader
					if ( Cmt.utils.isFileApiSupported() ) {
	
						progressContainer.css( "width", "0%" );
					}
					// Form Data Uploader
					else if( Cmt.utils.isFormDataSupported() ) {
	
						progressContainer.html( "" );
					}
				});
			}

			// Modern Uploader
			if ( Cmt.utils.isFileApiSupported() ) {

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
			else if( Cmt.utils.isFormDataSupported() ) {

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
			if( settings.preview && Cmt.utils.isCanvasSupported() && type == "image" ) {

				var canvas		= fileUploader.find( ".preview canvas" );

				canvas.show();

				Cmt.utils.drawImageOnCanvas( canvas[0], files[0] );
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

							var jsonResponse = JSON.parse( xhr.responseText );

							if( jsonResponse['result'] == 1 ) {

								if( settings.uploadListener ) {

									settings.uploadListener( fileUploader.attr( "id" ), directory, type, jsonResponse['data'] );
								}
								else {

									fileUploaded( fileUploader, directory, type, jsonResponse['data'] );
								}
							}
							else {
	
								alert( "File upload failed." );
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

			if( type == "image" ) {

				fileUploader.find( ".postview .wrap-image" ).html( "<img src='" + result['tempUrl'] + "' class='fluid' />" );

				var fileFields	= fileUploader.find( ".fields" );

				fileFields.children( ".name" ).val( result[ 'name' ] );
				fileFields.children( ".extension" ).val( result[ 'extension' ] );
				fileFields.children( ".change" ).val( 1 );
			}

			// Show Hide
			fileUploader.find( ".wrap-chooser" ).hide();
			fileUploader.find( ".post-action" ).show();
		}
	};

	// Default Settings
	cmt.fn.cmtFileUploader.defaults = {
		fileFormats: [ "jpg", "jpeg", "png", "gif", "pdf", "csv" ],
		uploadListener: null,
		preview: true
	};

}( jQuery ) );;/*
 * Dependencies: jquery
 */

( function( cmt ) {

	cmt.fn.cmtHeader = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmt.extend( {}, cmt.fn.cmtHeader.defaults, options );
		var screenWidth		= window.innerWidth;
		var headers			= this;

		// Iterate and initialise all the page modules
		headers.each( function() {

			var header	= cmt( this );

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
			        }
			        else {
	
			            if ( header.hasClass( "header-small" ) ) {
			
			                header.removeClass( "header-small" );
			            }
			        }
			    });
			}
		}
	};

	// Default Settings
	cmt.fn.cmtHeader.defaults = {
		minWidth: 1024,
		scrollDistance: 300
	};

}( jQuery ) );;/*
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
};( function( cmt ) {

// TODO: Add option for multi select

	cmt.fn.cmtSelect = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmt.extend( {}, cmt.fn.cmtSelect.defaults, options );
		var dropDowns		= this;

		// Iterate and initialise all the fox sliders
		dropDowns.each( function() {

			var dropDown = cmt( this );

			init( dropDown );
		});

		// return control
		return;

		// == Private Functions == //

		function init( dropDown ) {

			// Find Selected Option
			var selected	= dropDown.children( "option:selected" );

			// Wrap Select
			dropDown.wrap( "<div></div>" );
			
			var wrapper		= dropDown.parent();

			if( settings.copyId ) {

				// Find select Id
				var selectId	= dropDown.attr( "id" );
	
				// Transfer Id to wrapper
				if( null != selectId && selectId.length > 0 ) {
	
					// Remove dropdown Id
					dropDown.attr( "id", null );
					wrapper.attr( "id", selectId );
				}
			}

			// Assign class to wrapper
			wrapper.addClass( "cmt-select-wrap" );

			if( null != settings.wrapperClass ) {

				wrapper.addClass( settings.wrapperClass );
			}
			
			// Generate Icon Html
			var iconHtml	= "<span class='s-icon'>";
			
			if( null != settings.iconClass ) {
				
				iconHtml	= "<span class='s-icon " + settings.iconClass + "'>";
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

				customHtml += "<li data-value='" + jQuery( this ).val() + "'>" + jQuery( this ).html() + "</li>";
		    });

			customHtml += "</ul></div>";

			// Append Custom Seelct to wrapper
			wrapper.append( customHtml );

			var customSelect	= wrapper.children( ".cmt-select" );
			var customSelected	= wrapper.children( ".cmt-select" ).children( ".cmt-selected" );
			var customList		= wrapper.children( ".cmt-select" ).children( ".cmt-select-list" );
			
			// Hide List by default
			customList.hide();
			
			// Detect whether disabled
			var disabled = dropDown.attr( "disabled" );
			
			if( disabled == "disabled" || disabled ) {
				
				customSelected.addClass( "disabled" );
			}
			else {

				// Add listener to selected val
				customSelected.click( function( e ) {
					
					var visible = customList.is( ':visible' );

					cmt( ".cmt-select-list" ).hide();

					if( !visible ) {

						customList.show();
					}
					
					e.stopPropagation();
				});
	
				// Update selected value
				customList.children( "li" ).click( function() {
	
					var selected	= jQuery( this );
					var parent		= selected.parents().eq(1);
					
					parent.children( ".cmt-selected" ).children( ".s-text" ).html( selected.html() );
					parent.parent().children( "select" ).val( selected.attr( "data-value" ) ).change();

					customList.hide();
				});
				
				cmt( document ).on( 'click', function( e ) {

			        if ( cmt( e.target ).closest( customList ).length === 0 ) {
	
			            customList.hide();
			        }
				});
			}
		}
	};

	// Default Settings
	cmt.fn.cmtSelect.defaults = {
		multi: false,
		copyId: false,
		wrapperClass: null,
		iconClass: null,
		iconHtml: null
	};

}( jQuery ) );;/*
 * Dependencies: jquery
 */

( function( cmt ) {

	cmt.fn.cmtSmoothScroll = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmt.extend( {}, cmt.fn.cmtSmoothScroll.defaults, options );
		var elements		= this;

		// Iterate and initialise all the page modules
		elements.each( function() {

			var element	= cmt( this );

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
			    var target 		= cmt( targetId );
		
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
	cmt.fn.cmtSmoothScroll.defaults = {

	};

}( jQuery ) );;/*
 * Dependencies: jquery, cmt-core
 */

// TODO: remove JQuery plugin and make it under Cmt namespace
// TODO: Change Controller to Controller Classes and Actions to Controller Methods
// TODO: Add Data Binding Support
// TODO: Add Data Binding with Pagination for Data Grid
// TODO: Add Page History and Caching Support

// Default Controller
var CONTROLLER_DEFAULT	= 'default';

// Default Controller Actions
var ACTION_DEFAULT		=  'default';
var ACTION_LOGIN		=  'login';
var ACTION_AVATAR		=  'avatar';

/**
 * JQuery Plugin for CMGTools Ajax Processor to process remote request.
 */
( function( cmt ) {

	cmt.fn.processAjax = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmt.extend( {}, cmt.fn.processAjax.defaults, options );
		var ajaxCallers		= this;

		// Iterate and initialise all the fox sliders
		ajaxCallers.each( function() {

			var ajaxCaller = cmt( this );

			init( ajaxCaller );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Module
		function init( ajaxCaller ) {

			if( settings.form ) {

				ajaxCaller.submit( function( event ) {

					event.preventDefault();

					var formId			= jQuery( this ).attr( "id" );
					var controllerId	= jQuery( this ).attr( "cmt-controller" );
					var actionId		= jQuery( this ).attr( "cmt-action" );

					if( null == controllerId ) {

						controllerId = CONTROLLER_DEFAULT;
					}

					if( null == actionId ) {

						actionId = ACTION_DEFAULT;
					}

					if( settings.json ) {

						Cmt.remote.handleRestForm( formId, controllerId, actionId );
					}
					else {

						Cmt.remote.handleAjaxForm( formId, controllerId, actionId );
					}
				});
			}
			else {

				jQuery( ajaxCaller ).find( ".cmt-submit" ).click( function( e ) {

					e.preventDefault();

					var request			= jQuery( "#" + jQuery( this ).attr( "cmt-request" ) );
					var elementId		= request.attr( "id" );
					var controllerId	= request.attr( "cmt-controller" );
					var actionId		= request.attr( "cmt-action" );

					if( null == controllerId ) {

						controllerId = CONTROLLER_DEFAULT;
					}

					if( null == actionId ) {

						actionId = ACTION_DEFAULT;
					}

					Cmt.remote.handleAjaxRequest( elementId, controllerId, actionId );
				});

				jQuery( ajaxCaller ).find( ".cmt-select" ).change( function() {

					var request			= jQuery( "#" + jQuery( this ).attr( "cmt-request" ) );
					var elementId		= request.attr( "id" );
					var controllerId	= request.attr( "cmt-controller" );
					var actionId		= request.attr( "cmt-action" );

					if( null == controllerId ) {

						controllerId = CONTROLLER_DEFAULT;
					}

					if( null == actionId ) {

						actionId = ACTION_DEFAULT;
					}

					Cmt.remote.handleAjaxRequest( elementId, controllerId, actionId );
				});
			}
		}
	};

	// Default Settings
	cmt.fn.processAjax.defaults = {
		form: true,
		json: false
	};

}( jQuery ) );

/**
 * CMGTools Ajax Processor to process remote request.
 */
Cmt.remote = {

	errorClass: 'error',
	messageClass: 'message',
	spinnerClass: 'spinner',

	handleAjaxForm: function( formId, controllerId, actionId ) {

		var form		= jQuery( "#" + formId );
		var httpMethod	= form.attr( "method" );
		var actionUrl	= form.attr( "action" );
		var message		= jQuery( "#" + formId + " ." + this.messageClass );

		// Hide message
		message.hide();

		// Hide all errors
		jQuery( "#" + formId + " ." + this.errorClass ).hide();

		// Pre Process Form
		if( !preCmtApiProcessor.processPre( formId, controllerId, actionId ) ) {

			return false;
		}

		// Generate form data for submission
		var formData	= Cmt.utils.serialiseForm( formId );

		// Show Spinner
		jQuery( "#" + formId + " ." + this.spinnerClass ).show();

		jQuery.ajax( {
			type: httpMethod,
			url: actionUrl,
			data: formData,
			dataType: "JSON",
			success: function( response, textStatus, XMLHttpRequest ) {

				// Process response
				Cmt.remote.processAjaxResponse( formId, controllerId, actionId, message, response );
			}
		});

		return false;
	},

	handleRestForm: function( formId, controllerId, actionId ) {

		var form		= jQuery( "#" + formId );
		var httpMethod	= form.attr( "method" );
		var actionUrl	= form.attr( "action" );
		var message		= jQuery( "#" + formId + " ." + this.messageClass );

		// Hide message
		message.hide();

		// Hide all errors
		jQuery( "#" + formId + " ." + this.errorClass ).hide();

		// Pre Process Form
		if( !preCmtApiProcessor.processPre( formId, controllerId, actionId ) ) {

			return false;
		}

		// Generate form data for submission
		var formData	= Cmt.utils.formToJson( formId );

		// Show Spinner
		jQuery( "#" + formId + " ." + this.spinnerClass ).show();

		jQuery.ajax({
			type: httpMethod,
			url: actionUrl,
			data: JSON.stringify( formData ),
			dataType: "JSON",
			contentType: "application/json;charset=UTF-8",
			success: function( response, textStatus, XMLHttpRequest ) {

				// Process response
				Cmt.remote.processAjaxResponse( formId, controllerId, actionId, message, response );
			}
		});

		return false;
	},

	handleAjaxRequest: function( elementId, controllerId, actionId ) {

		var element		= jQuery( "#" + elementId );
		var httpMethod	= element.attr( "method" );
		var actionUrl	= element.attr( "action" );
		var message		= jQuery( "#" + elementId + " ." + this.messageClass );

		if( null == httpMethod ) {

			httpMethod = 'post';		
		}

		// Hide message
		message.hide();

		// Hide all errors
		jQuery( "#" + elementId + " ." + this.errorClass ).hide();

		// Pre Process Request
		if( !preCmtApiProcessor.processPre( elementId, controllerId, actionId ) ) {

			return false;
		}

		// Generate request data for submission
		var requestData	= Cmt.utils.serialiseElement( elementId );

		// Show Spinner
		jQuery( "#" + elementId + " ." + this.spinnerClass ).show();

		jQuery.ajax({
			type: httpMethod,
			url: actionUrl,
			data: requestData,
			dataType: "JSON",
			success: function( response, textStatus, XMLHttpRequest ) {

				// Process response
				Cmt.remote.processAjaxResponse( elementId, controllerId, actionId, message, response );
			}
		});

		return false;
	},

	processAjaxResponse: function( requestId, controllerId, actionId, message, response ) {

		var result 		= response['result'];
		var messageStr 	= response['message'];
		var data		= response['data'];
		var errors		= response['errors'];

		if( result == 1 ) {
			
			// Show message
			message.html( messageStr );
			message.show();

			// Hide all errors
			jQuery( "#" + requestId + " ." + this.errorClass ).hide();

			// Hide Spinner
			jQuery( "#" + requestId + " ." + this.spinnerClass ).hide();

			// Check to clear form data
			var clearData = jQuery( "#" + requestId ).attr( "cmt-clear-data" );

			if( null == clearData ) {

				clearData	= true;
			}
			else {

				clearData	= clearData === 'true';
			}

			if( clearData ) {

				// Clear all form fields
				jQuery( "#" + requestId + " input[type='text']" ).val( '' );
				jQuery( "#" + requestId + " input[type='password']" ).val( '' );
				jQuery( "#" + requestId + " textarea" ).val( '' );
			}

			// Pass the data for post processing
			postCmtApiProcessor.processSuccess( requestId, controllerId, actionId, response );
		}
		else if( result == 0 ) {

			// Show message
			message.html( messageStr );
			message.show();

			// Hide Spinner
			jQuery( "#" + requestId + " ." + this.spinnerClass ).hide();

			// Show Errors
			for( var key in errors ) {

	        	var fieldName 		= key;
	        	var errorMessage 	= errors[key];
	        	var errorField		= jQuery( "#" + requestId + " span[cmt-error='" + fieldName + "']" );

	        	errorField.html( errorMessage );
	        	errorField.show();
	    	}

			postCmtApiProcessor.processFailure( requestId, controllerId, actionId, response );
		}
	}
};

/* Pre Processor */

PreCmtApiProcessor = function() {
	
	this.formListeners	= Array();
};

PreCmtApiProcessor.prototype.addListener = function( listener ) {
	
	this.formListeners.push( listener );
};

PreCmtApiProcessor.prototype.processPre = function( requestId, controllerId, actionId ) {

	var formListeners	= this.formListeners;
	var length 			= formListeners.length;

	for( var i = 0; i < length; i++ ) {

		if( !formListeners[i]( requestId, controllerId, actionId ) ) {

			return false;
		}
	}

	return true;
};

/* Ajax Post Processor */

function PostCmtApiProcessor() {
	
	this.successListeners	= Array();
	this.failureListeners	= Array();
}

PostCmtApiProcessor.prototype.addSuccessListener = function( listener ) {
	
	this.successListeners.push( listener );
};

PostCmtApiProcessor.prototype.addFailureListener = function( listener ) {
	
	this.failureListeners.push( listener );
};

PostCmtApiProcessor.prototype.processSuccess = function( requestId, controllerId, actionId, response ) {

	var successListeners	= this.successListeners;
	var length 				= successListeners.length;

	for( var i = 0; i < length; i++ ) {

		successListeners[i]( requestId, controllerId, actionId, response );
	}
};

PostCmtApiProcessor.prototype.processFailure = function( requestId, controllerId, actionId, response ) {

	var failureListeners	= this.failureListeners;
	var length 				= failureListeners.length;

	for( var i = 0; i < length; i++ ) {

		failureListeners[i]( requestId, controllerId, actionId, response );
	}
};

/* Core - Pre Ajax Processor */

function preCoreProcessor( requestId, gcontrollerId, actionId ) {

	return true;
}

var preCmtApiProcessor	= new PreCmtApiProcessor();

preCmtApiProcessor.addListener( preCoreProcessor );

/* Core - Post Ajax Processor */

function postCoreProcessorSuccess( requestId, controllerId, actionId, response ) {

}

function postCoreProcessorFailure( requestId, gcontrollerId, actionId, response ) {

}

var postCmtApiProcessor	= new PostCmtApiProcessor();

postCmtApiProcessor.addSuccessListener( postCoreProcessorSuccess );
postCmtApiProcessor.addFailureListener( postCoreProcessorFailure );