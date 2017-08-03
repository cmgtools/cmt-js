/**
 * Register the request elements
 *
 * @param {cmt.api.Application} application - Application
 * @param requestElements - Elements passed by using JQuery selector.
 */
cmt.api.utils.request = {

	// Register the request triggers present with the request elements.
	register: function( application, requestElements ) {

		// Iterate and initialise all the requests
		requestElements.each( function() {

			// Active element
			var requestElement = jQuery( this );

			// Form Submits
			if( requestElement.is( 'form' ) ) {

				// requestElement.unbind( 'submit' );

				// Trigger request on form submit
				requestElement.submit( function( event ) {

					// Stop default form submit execution
					event.preventDefault();

					// Trigger the request
					cmt.api.utils.request.trigger( application, requestElement, true, null );
				});
			}

			// Button Clicks
			var clickTrigger = requestElement.find( cmt.api.Application.STATIC_CLICK );

			if( clickTrigger.length > 0 ) {

				// clickTrigger.unbind( 'click' );

				// Trigger request on click action
				clickTrigger.click( function( event ) {

					// Stop default click action
					event.preventDefault();

					var trigger = jQuery( this );

					if( trigger.is( '[target-app]' ) ) {

						var app		= cmt.api.root.getApplication( trigger.attr( 'target-app' ) );
						var request	= trigger.closest( '[cmt-app=' + trigger.attr( 'target-app' ) + ']' );

						// Trigger the request
						cmt.api.utils.request.trigger( app, request, false, jQuery( this ) );
					}
					else {

						// Trigger the request
						cmt.api.utils.request.trigger( application, requestElement, false, jQuery( this ) );
					}
				});
			}

			// Select Change
			var selectTrigger = requestElement.find( cmt.api.Application.STATIC_CHANGE );

			if( selectTrigger.length > 0 ) {

				// selectTrigger.unbind( 'change' );

				// Trigger request on select
				selectTrigger.change( function() {

					var trigger = jQuery( this );

					if( trigger.is( '[target-app]' ) ) {

						var app		= cmt.api.root.getApplication( trigger.attr( 'target-app' ) );
						var request	= trigger.closest( '[cmt-app=' + trigger.attr( 'target-app' ) + ']' );

						// Trigger the request
						cmt.api.utils.request.trigger( app, request, false, jQuery( this ) );
					}
					else {

						// Trigger the request
						cmt.api.utils.request.trigger( application, requestElement, false, jQuery( this ) );
					}
				});
			}

			// Key Up
			var keyupTrigger = requestElement.find( cmt.api.Application.STATIC_KEY_UP );

			if( keyupTrigger.length > 0 ) {

				// keyupTrigger.unbind( 'keyup' );

				keyupTrigger.keyup( function() {

					var trigger = jQuery( this );

					if( trigger.is( '[target-app]' ) ) {

						var app		= cmt.api.root.getApplication( trigger.attr( 'target-app' ) );
						var request	= trigger.closest( '[cmt-app=' + trigger.attr( 'target-app' ) + ']' );

						// Trigger the request
						cmt.api.utils.request.trigger( app, request, false, jQuery( this ) );
					}
					else {

						// Trigger the request
						cmt.api.utils.request.trigger( application, requestElement, false, jQuery( this ) );
					}
				});
			}

			// Blur
			var blurTrigger = requestElement.find( cmt.api.Application.STATIC_BLUR );

			if( blurTrigger.length > 0 ) {

				// blurTrigger.unbind( 'blur' );

				blurTrigger.blur( function() {

					var trigger = jQuery( this );

					if( trigger.is( '[target-app]' ) ) {

						var app		= cmt.api.root.getApplication( trigger.attr( 'target-app' ) );
						var request	= trigger.closest( '[cmt-app=' + trigger.attr( 'target-app' ) + ']' );

						// Trigger the request
						cmt.api.utils.request.trigger( app, request, false, jQuery( this ) );
					}
					else {

						// Trigger the request
						cmt.api.utils.request.trigger( application, requestElement, false, jQuery( this ) );
					}
				});
			}
		});
	},

	trigger: function( application, requestElement, isForm, requestTrigger ) {

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
		var controller				= application.findController( controllerName );
		controller.requestTrigger	= requestTrigger;

		if( isForm ) {

			if( application.config.json ) {

				cmt.api.utils.request.handleJsonForm( application, requestElement, controller, actionName );
			}
			else {

				cmt.api.utils.request.handleDataForm( application, requestElement, controller, actionName );
			}
		}
		else {

			cmt.api.utils.request.handleRequest( application, requestElement, controller, actionName );
		}
	},

	handleJsonForm: function( application, requestElement, controller, actionName ) {

		// Pre process
		if( cmt.api.utils.request.preProcessRequest( application, requestElement, controller, actionName ) ) {

			// Generate form data for submission
			var formData	= controller.requestData;
			var method		= requestElement.attr( 'method' );

			// Custom Request
			if( requestElement.is( '[' + cmt.api.Application.STATIC_CUSTOM + ']' ) ) {

				formData	= cmt.utils.data.appendCsrf( formData );
			}
			// Regular Request
			else {

				var formElement = null != controller.requestForm ? controller.requestForm : requestElement;

				if( null != method && method.toLowerCase() == 'get' && !application.config.csrfGet ) {

					formData	= cmt.utils.data.formToJson( formElement, false );
				}
				else {

					formData	= cmt.utils.data.formToJson( formElement );
				}
			}

			// process request
			cmt.api.utils.request.processRequest( application, requestElement, controller, actionName, formData );
		}

		return false;
	},

	handleDataForm: function( application, requestElement, controller, actionName ) {

		// Pre process
		if( cmt.api.utils.request.preProcessRequest( application, requestElement, controller, actionName ) ) {

			// Generate form data for submission
			var formData	= controller.requestData;
			var method		= requestElement.attr( 'method' );

			// Custom Request
			if( requestElement.is( '[' + cmt.api.Application.STATIC_CUSTOM + ']' ) ) {

				formData	= cmt.utils.data.appendCsrf( formData );
			}
			// Regular Request
			else {

				var formElement = null != controller.requestForm ? controller.requestForm : requestElement;

				if( null != method && method.toLowerCase() == 'get' && !application.config.csrfGet ) {

					formData	= cmt.utils.data.serialiseForm( formElement, false );
				}
				else {

					formData	= cmt.utils.data.serialiseForm( formElement );
				}
			}

			// Process request
			cmt.api.utils.request.processRequest( application, requestElement, controller, actionName, formData );
		}

		return false;
	},

	handleRequest: function( application, requestElement, controller, actionName ) {

		// Pre process
		if(  cmt.api.utils.request.preProcessRequest( application, requestElement, controller, actionName ) ) {

			// Generate request data for submission
			var requestData	= controller.requestData;
			var method		= requestElement.attr( 'method' );

			// Custom Request
			if( requestElement.is( '[' + cmt.api.Application.STATIC_CUSTOM + ']' ) ) {

				requestData	= cmt.utils.data.appendCsrf( requestData );
			}
			// Regular Request
			else {

				var formElement = null != controller.requestForm ? controller.requestForm : requestElement;

				if( null != method && method.toLowerCase() == 'get' && !application.config.csrfGet ) {

					requestData	= cmt.utils.data.serialiseElement( formElement, false );
				}
				else {

					requestData	= cmt.utils.data.serialiseElement( formElement );
				}
			}

			// Process request
			cmt.api.utils.request.processRequest( application, requestElement, controller, actionName, requestData );
		}

		return false;
	},

	preProcessRequest: function( application, requestElement, controller, actionName ) {

		var preAction	= actionName + 'ActionPre';
		var formElement = null != controller.requestForm ? controller.requestForm : requestElement;

		// Hide message element
		formElement.find( application.config.messageClass ).css( 'display', 'none' );

		// Hide all warnings
		formElement.find( application.config.warnClass ).css( 'display', 'none' );

		// Hide all errors
		formElement.find( application.config.errorClass ).css( 'display', 'none' );

		// Pre Process Request
		if( typeof controller[ preAction ] !== 'undefined' && !( controller[ preAction ]( requestElement ) ) ) {

			return false;
		}

		// Show Spinner
		requestElement.find( application.config.spinnerClass ).css( 'display', 'inline-block' );

		return true;
	},

	processRequest: function( application, requestElement, controller, actionName, requestData ) {

		var httpMethod	= 'post';
		var actionUrl	= requestElement.attr( 'action' );

		// Set method if exist
		if( requestElement.attr( 'method' ) ) {

			httpMethod	= requestElement.attr( 'method' );
		}

		if( null != application.config.basePath ) {

			actionUrl	= application.config.basePath + actionUrl;
		}

		if( controller.singleRequest && null != controller.currentRequest ) {

			controller.currentRequest = controller.currentRequest.abort();
			controller.currentRequest = null;
		}

		if( application.config.json ) {

			var request = jQuery.ajax({
				type: httpMethod,
				url: actionUrl,
				data: requestData,
				dataType: 'JSON',
				contentType: 'application/json;charset=UTF-8',
				success: function( response, textStatus, XMLHttpRequest ) {

					// Process response
					cmt.api.utils.request.processResponse( application, requestElement, controller, actionName, response );
				}
			});

			if( controller.singleRequest ) {

				controller.currentRequest = request;
			}
		}
		else {

			var request = jQuery.ajax({
				type: httpMethod,
				url: actionUrl,
				data: requestData,
				dataType: 'JSON',
				success: function( response, textStatus, XMLHttpRequest ) {

					// Process response
					cmt.api.utils.request.processResponse( application, requestElement, controller, actionName, response );
				}
			});

			if( controller.singleRequest ) {

				controller.currentRequest = request;
			}
		}
	},

	processResponse: function( application, requestElement, controller, actionName, response ) {

		var result		= response[ 'result' ];
		var errors		= response[ 'errors' ];
		var formElement = null != controller.requestForm ? controller.requestForm : requestElement;

		if( result == 1 ) {

			// Check to clear form data
			if( !requestElement.is( '[' + cmt.api.Application.STATIC_KEEP + ']' ) ) {

				// Clear all form fields
				formElement.find( ' input[type="text"]' ).val( '' );
				formElement.find( ' input[type="password"]' ).val( '' );
				formElement.find( ' textarea' ).val( '' );
			}

			// Hide all errors
			formElement.find( application.config.errorClass ).css( 'display', 'none' );
		}
		else if( result == 0 ) {

			// Show Errors
			for( var key in errors ) {

				var fieldName 		= key;
				var errorMessage 	= errors[ key ];
				var errorField		= formElement.find( ' span[' + cmt.api.Application.STATIC_ERROR + '="' + fieldName + '"]' );

				errorField.html( errorMessage );
				errorField.css( 'display', 'inline-block' );
			}
		}

		cmt.api.utils.request.postProcessResponse( application, requestElement, controller, actionName, response );
	},

	postProcessResponse: function( application, requestElement, controller, actionName, response ) {

		var result 		= response[ 'result' ];
		var message		= null;
		var messageStr 	= response[ 'message' ];

		var successAction	= actionName + 'ActionSuccess';
		var failureAction	= actionName + 'ActionFailure';

		if( result == 1 ) {

			message	= requestElement.find( application.config.messageClass + '.success' );
		}
		else if( result == 0 ) {

			message	= requestElement.find( application.config.messageClass + '.error' );
		}

		// Show message
		message.html( messageStr );
		message.css( 'display', 'inline-block' );

		// Hide Spinner
		requestElement.find( application.config.spinnerClass ).hide();

		// Pass the data for post processing
		if( result == 1 && typeof controller[ successAction ] !== 'undefined' ) {

			controller[ successAction ]( requestElement, response );
		}
		else if( result == 0 && typeof controller[ failureAction ] !== 'undefined' ) {

			controller[ failureAction ]( requestElement, response );
		}
	}
}
