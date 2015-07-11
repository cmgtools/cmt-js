/*
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

			var urlParams	= fileUploadUrl + "?directory=" + encodeURIComponent( selector ) + "&type=" + encodeURIComponent( type );

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

}( jQuery ) );