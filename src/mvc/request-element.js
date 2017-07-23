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

			// requestElement.unbind( 'submit' );

			requestElement.submit( function( event ) {

				event.preventDefault();

				app.triggerRequest( requestElement, true, null );
			});
		}

		// Button Clicks
		var clickTrigger = requestElement.find( cmt.api.Application.STATIC_CLICK );

		if( clickTrigger.length > 0 ) {

			// clickTrigger.unbind( 'click' );

			clickTrigger.click( function( event ) {

				event.preventDefault();

				app.triggerRequest( requestElement, false, jQuery( this ) );
			});
		}

		// Select Change
		var selectTrigger = requestElement.find( cmt.api.Application.STATIC_CHANGE );

		if( selectTrigger.length > 0 ) {

			// selectTrigger.unbind( 'change' );

			selectTrigger.change( function() {

				app.triggerRequest( requestElement, false, jQuery( this ) );
			});
		}

		// Key Up
		var keyupTrigger = requestElement.find( cmt.api.Application.STATIC_KEY_UP );

		if( keyupTrigger.length > 0 ) {

			// keyupTrigger.unbind( 'keyup' );

			keyupTrigger.keyup( function() {

				app.triggerRequest( requestElement, false, jQuery( this ) );
			});
		}

		// Blur
		var blurTrigger = requestElement.find( cmt.api.Application.STATIC_BLUR );

		if( blurTrigger.length > 0 ) {

			// blurTrigger.unbind( 'blur' );

			blurTrigger.blur( function() {

				app.triggerRequest( requestElement, false, jQuery( this ) );
			});
		}
	});
};

// Handle Request Elements Triggers ----------------------

cmt.api.Application.prototype.triggerRequest = function( requestElement, isForm, requestTrigger ) {

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
	var controller				= this.findController( controllerName );
	controller.requestTrigger	= requestTrigger;

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

		// Custom Request
		if( requestElement.is( '[' + cmt.api.Application.STATIC_CUSTOM + ']' ) ) {

			formData	= cmt.utils.data.appendCsrf( formData );
		}
		// Regular Request
		else {

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

		// Custom Request
		if( requestElement.is( '[' + cmt.api.Application.STATIC_CUSTOM + ']' ) ) {

			formData	= cmt.utils.data.appendCsrf( formData );
		}
		// Regular Request
		else {

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

		// Custom Request
		if( requestElement.is( '[' + cmt.api.Application.STATIC_CUSTOM + ']' ) ) {

			requestData	= cmt.utils.data.appendCsrf( requestData );
		}
		// Regular Request
		else {

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
	requestElement.find( this.config.messageClass ).css( 'display', 'none' );

	// Hide all errors
	requestElement.find( this.config.errorClass ).css( 'display', 'none' );

	// Pre Process Request
	if( typeof controller[ preAction ] !== 'undefined' && !( controller[ preAction ]( requestElement ) ) ) {

		return false;
	}

	// Show Spinner
	requestElement.find( this.config.spinnerClass ).css( 'display', 'inline-block' );

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

	if( controller.singleRequest && null != controller.currentRequest ) {

		controller.currentRequest = controller.currentRequest.abort();
		controller.currentRequest = null;
	}

	if( this.config.json ) {

		var request = jQuery.ajax({
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
				app.processResponse( requestElement, controller, actionName, response );
			}
		});

		if( controller.singleRequest ) {

			controller.currentRequest = request;
		}
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
		requestElement.find( this.config.errorClass ).css( 'display', 'none' );
	}
	else if( result == 0 ) {

		// Show Errors
		for( var key in errors ) {

        	var fieldName 		= key;
        	var errorMessage 	= errors[ key ];
        	var errorField		= requestElement.find( ' span[' + cmt.api.Application.STATIC_ERROR + '="' + fieldName + '"]' );

        	errorField.html( errorMessage );
        	errorField.css( 'display', 'inline-block' );
    	}
	}

	this.postProcessResponse( requestElement, controller, actionName, response );
};

cmt.api.Application.prototype.postProcessResponse = function( requestElement, controller, actionName, response ) {

	var result 		= response[ 'result' ];
	var message		= null;
	var messageStr 	= response[ 'message' ];
	var postAction	= actionName + 'ActionPost';

	if( result == 1 ) {

		message	= requestElement.find( this.config.messageClass + ".success" );
	}
	else if( result == 0 ) {

		message	= requestElement.find( this.config.messageClass + ".error" );
	}

	// Show message
	message.html( messageStr );
	message.css( 'display', 'inline-block' );

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