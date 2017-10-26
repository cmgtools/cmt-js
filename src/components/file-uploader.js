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
			var btnChooser	= fileUploader.find( '.btn-chooser' );

			if( btnChooser.length > 0 ) {

				if( settings.direct || fileUploader.hasClass( 'file-uploader-direct' ) ) {

					fileUploader.addClass( 'file-uploader-direct' );

					btnChooser.hide();
					
					if( settings.toggle ) {
						
						fileUploader.find( '.chooser-wrap' ).show();
						fileUploader.find( '.file-wrap' ).hide();
					}
				}

				btnChooser.click( function() {

					if( settings.toggle ) {
						
						// Swap Chooser and Dragger
						fileUploader.find( '.chooser-wrap' ).fadeToggle( 'slow' );
						fileUploader.find( '.file-wrap' ).fadeToggle( 'fast' );
					}
					
					// Hide Postaction
					fileUploader.find( '.post-action' ).hide();

					// Reset Chooser
					fileUploader.find( '.file-chooser .input' ).val( "" );

					// Reset Canvas and Progress
					resetUploader( fileUploader );
				});
			}

			// Modern Uploader
			if ( cmt.utils.browser.isFileApi() ) {

				// Traditional way using input
				var inputField = fileUploader.find( '.file-chooser .input' );

				inputField.change( function( event ) {

					handleFile( event, fileUploader );
				});

				// Modern way using Drag n Drop
				var dragElement = fileUploader.find( '.file-dragger .drag-wrap' );

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

				var directory	= fileUploader.attr( 'directory' );
				var type		= fileUploader.attr( 'type' );
				var inputField 	= fileUploader.find( '.file-chooser .input' );

				inputField.change( function( event ) {

					uploadTraditionalFile( fileUploader, directory, type );
				} );
			}
		}

		function resetUploader( fileUploader ) {

			// Clear Old Values
			if( cmt.utils.browser.isCanvas() && fileUploader.attr( 'type' ) == 'image' ) {

				var canvasArr	= fileUploader.find( '.file-dragger canvas' );

				if( canvasArr.length > 0 ) {

					var canvas	= canvasArr[ 0 ];
					var context = canvas.getContext( '2d' );

					context.clearRect( 0, 0, canvas.width, canvas.height );
				}
			}

			var progressContainer	= fileUploader.find( '.file-preloader .file-preloader-bar' );

			// Modern Uploader
			if ( cmt.utils.browser.isFileApi() ) {

				progressContainer.css( "width", "0%" );
			}
			// Form Data Uploader
			else if( cmt.utils.browser.isFormData() ) {

				progressContainer.html( "" );
			}
		}

		function handleDragging( event ) {

			event.stopPropagation();
			event.preventDefault();

			// TODO: add class hover to drag
			// event.target.className = ( event.type == "dragover" ? "hover" : "" );
		}

		function handleFile( event, fileUploader ) {

			var directory	= fileUploader.attr( 'directory' );
			var type		= fileUploader.attr( 'type' );

			// cancel event and add hover styling
			handleDragging( event );

			// FileList
			var files = event.target.files || event.originalEvent.dataTransfer.files;

			// Draw if image
			if( settings.preview && cmt.utils.browser.isCanvas() && type == 'image' ) {

				var canvas	= fileUploader.find( '.file-dragger canvas' );

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
			var progressContainer	= fileUploader.find( '.file-preloader .file-preloader-bar' );
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

									settings.uploadListener( fileUploader, directory, type, responseData );
								}
								else {

									fileUploaded( fileUploader, directory, type, responseData );
								}
							}
							else {

								var responseData	= jsonResponse[ 'errors' ];

								alert( responseData.error );
							}

							// Reset Canvas and Progress
							resetUploader( fileUploader );
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

			var progressContainer	= fileUploader.find( '.file-preloader .file-preloader-bar' );
			var fileList			= fileUploader.find( '.file-chooser .input' );
			var file 				= fileList.files[ 0 ];
			var formData 			= new FormData();
			fileName 				= file.name;

			// Show progress
			progressContainer.html( 'Uploading file' );

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

				progress.html( 'File uploaded' );

				if( response['result'] == 1 ) {

					if( settings.uploadListener ) {

						settings.uploadListener( fileUploader, directory, type, response[ 'data' ] );
					}
					else {

						fileUploaded( fileUploader, directory, type, response[ 'data' ] );
					}
				}
				else {

					var errors	= response[ 'errors' ];

					alert( errors.error );
				}

				// Reset Canvas and Progress
				resetUploader( fileUploader );
			});
		}

		// default post processor for uploaded files.
		function fileUploaded( fileUploader, directory, type, result ) {

			var fileName	= result[ 'name' ] + "." + result[ 'extension' ];

			switch( type ) {

				case "image": {

					fileUploader.find( '.file-wrap .file-data' ).html( "<img src='" + result['tempUrl'] + "' class='fluid' />" );

					updateFileData( fileUploader, result );

					break;
				}
				case "video": {

					fileUploader.find( '.file-wrap .file-data' ).html( "<video src='" + result['tempUrl'] + "' controls class='fluid'>Video not supported.</video>" );

					updateFileData( fileUploader, result );

					break;
				}
				case "document":
				case "compressed":
				case "shared": {

					fileUploader.find( '.file-wrap .file-data' ).html( "<i class='cmti cmti-3x cmti-check'></i>" );

					updateFileData( fileUploader, result );

					break;
				}
			}

			if( settings.toggle ) {
				
				// Swap Chooser and Dragger
				fileUploader.find( '.chooser-wrap' ).fadeToggle( 'fast' );
				fileUploader.find( '.file-wrap' ).fadeToggle( 'slow' );
			}
			// Show Postaction
			fileUploader.find( '.post-action' ).fadeIn();
		}

		function updateFileData( fileUploader, result ) {

			var fileInfo	= fileUploader.find( '.file-info' );
			var fileFields	= fileUploader.find( '.file-fields' );

			fileInfo.find( '.name' ).val( result[ 'name' ] );
			fileInfo.find( '.extension' ).val( result[ 'extension' ] );
			fileInfo.find( '.change' ).val( 1 );

			fileFields.find( '.title' ).val( result[ 'title' ] );
		}
	};

	// Default Settings
	cmtjq.fn.cmtFileUploader.defaults = {
		fileFormats: [ "jpg", "jpeg", "png", "gif", "pdf", "csv" ],
		direct: false,
		uploadListener: null,
		preview: true,
		toggle: true
	};

})( jQuery );

