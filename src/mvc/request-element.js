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

				app.handleRequest( requestElement.attr( cmt.api.Application.STATIC_ID ), true, requestElement.attr( cmt.api.Application.STATIC_CONTROLLER ), requestElement.attr( cmt.api.Application.STATIC_ACTION ) );
			});
		}

		// Button Clicks
		var clickTrigger = requestElement.find( cmt.api.Application.STATIC_CLICK );

		if( clickTrigger.length > 0 ) {

			clickTrigger.unbind( 'click' );

			clickTrigger.click( function( event ) {

				event.preventDefault();

				app.handleRequest( requestElement.attr( cmt.api.Application.STATIC_ID ), false, requestElement.attr( cmt.api.Application.STATIC_CONTROLLER ), requestElement.attr( cmt.api.Application.STATIC_ACTION ) );
			});
		}

		// Select Change
		var selectTrigger = requestElement.find( cmt.api.Application.STATIC_CHANGE );

		if( selectTrigger.length > 0 ) {

			selectTrigger.unbind( 'change' );

			selectTrigger.change( function() {

				app.handleRequest( requestElement.attr( cmt.api.Application.STATIC_ID ), false, requestElement.attr( cmt.api.Application.STATIC_CONTROLLER ), requestElement.attr( cmt.api.Application.STATIC_ACTION ) );
			});
		}

		// Key Up
		var keyupTrigger = requestElement.find( cmt.api.Application.STATIC_KEY_UP );

		if( keyupTrigger.length > 0 ) {

			keyupTrigger.unbind( 'keyup' );

			keyupTrigger.keyup( function() {

				app.handleRequest( requestElement.attr( cmt.api.Application.STATIC_ID ), false, requestElement.attr( cmt.api.Application.STATIC_CONTROLLER ), requestElement.attr( cmt.api.Application.STATIC_ACTION ) );
			});
		}
	});
};

// Process Request Elements Triggers ---------------------

cmt.api.Application.prototype.handleRequest = function( requestId, isForm, controllerName, actionName ) {

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

			this.handleRestForm( requestId, controller, actionName );
		}
		else {

			this.handleAjaxForm( requestId, controller, actionName );
		}
	}
	else {

		this.handleAjaxRequest( requestId, controller, actionName );
	}
};

cmt.api.Application.prototype.handleRestForm = function( formId, controller, actionName ) {

	var app			= this;
	var form		= jQuery( '#' + formId );
	var httpMethod	= form.attr( 'method' );
	var actionUrl	= form.attr( 'action' );
	var message		= jQuery( '#' + formId + ' .' + this.config.messageClass );
	var preAction	= actionName + 'ActionPre';

	// Hide message element
	message.hide();

	// Hide all errors
	form.find( this.config.errorClass ).hide();

	// Pre Process Form
	if( typeof controller[ preAction ] !== 'undefined' && !( controller[ preAction ]( form ) ) ) {

		return false;
	}

	// Generate form data for submission
	var formData	= cmt.utils.data.formToJson( formId );

	// Show Spinner
	form.find( this.config.spinnerClass ).show();

	jQuery.ajax({
		type: httpMethod,
		url: actionUrl,
		data: JSON.stringify( formData ),
		dataType: 'JSON',
		contentType: 'application/json;charset=UTF-8',
		success: function( response, textStatus, XMLHttpRequest ) {

			// Process response
			app.processAjaxResponse( form, controller, actionName, message, response );
		}
	});

	return false;
};

cmt.api.Application.prototype.handleAjaxForm = function( formId, controller, actionName ) {

	var app			= this;
	var form		= jQuery( '#' + formId );
	var httpMethod	= form.attr( 'method' );
	var actionUrl	= form.attr( 'action' );
	var message		= form.find( this.config.messageClass );
	var preAction	= actionName + 'ActionPre';

	// Hide message
	message.hide();

	// Hide all errors
	form.find( this.config.errorClass ).hide();

	// Pre Process Form
	if( typeof controller[ preAction ] !== 'undefined' && !( controller[ preAction ]( form ) ) ) {

		return false;
	}

	// Generate form data for submission
	var formData	= cmt.utils.data.serialiseForm( formId );

	// Show Spinner
	form.find( this.config.spinnerClass ).show();

	jQuery.ajax({
		type: httpMethod,
		url: actionUrl,
		data: formData,
		dataType: 'JSON',
		success: function( response, textStatus, XMLHttpRequest ) {

			// Process response
			app.processAjaxResponse( form, controller, actionName, message, response );
		}
	});

	return false;
};

cmt.api.Application.prototype.handleAjaxRequest = function( elementId, controller, actionName ) {

		var app			= this;
		var element		= jQuery( '#' + elementId );
		var httpMethod	= element.attr( 'method' );
		var actionUrl	= element.attr( 'action' );
		var message		= element.find( this.config.messageClass );
		var preAction	= actionName + 'ActionPre';

		if( null == httpMethod ) {

			httpMethod = 'post';
		}

		// Hide message
		message.hide();

		// Hide all errors
		element.find( this.errorClass ).hide();

		// Pre Process Request
		if( typeof controller[ preAction ] !== 'undefined' && !( controller[ preAction ]( element ) ) ) {

			return false;
		}

		// Generate request data for submission
		var requestData	= cmt.utils.data.serialiseElement( elementId );

		// Show Spinner
		element.find( this.spinnerClass ).show();

		jQuery.ajax({
			type: httpMethod,
			url: actionUrl,
			data: requestData,
			dataType: 'JSON',
			success: function( response, textStatus, XMLHttpRequest ) {

				// Process response
				app.processAjaxResponse( element, controller, actionName, message, response );
			}
		});

		return false;
};

cmt.api.Application.prototype.processAjaxResponse = function( parentElement, controller, actionName, message, response ) {

	var result 		= response[ 'result' ];
	var messageStr 	= response[ 'message' ];
	var data		= response[ 'data' ];
	var errors		= response[ 'errors' ];
	var postAction	= actionName + 'ActionPost';

	if( result == 1 ) {

		// Show message
		message.html( messageStr );
		message.show();

		// Hide all errors
		parentElement.find( this.config.errorClass ).hide();

		// Hide Spinner
		parentElement.find( this.config.spinnerClass ).hide();

		// Check to clear form data
		var clearData = parentElement.attr( cmt.api.Application.STATIC_CLEAR );

		if( null == clearData ) {

			clearData	= true;
		}
		else {

			clearData	= clearData === 'true';
		}

		if( clearData ) {

			// Clear all form fields
			parentElement.find( ' input[type="text"]' ).val( '' );
			parentElement.find( ' input[type="password"]' ).val( '' );
			parentElement.find( ' textarea' ).val( '' );
		}

		// Pass the data for post processing
		if( typeof controller[ postAction ] !== 'undefined' ) {

			controller[ postAction ]( true, parentElement, message, response );
		}
	}
	else if( result == 0 ) {

		// Show message
		message.html( messageStr );
		message.show();

		// Hide Spinner
		parentElement.find( this.config.spinnerClass ).hide();

		// Show Errors
		for( var key in errors ) {

        	var fieldName 		= key;
        	var errorMessage 	= errors[ key ];
        	var errorField		= parentElement.find( ' span[' + cmt.api.Application.STATIC_ERROR + '="' + fieldName + '"]' );

        	errorField.html( errorMessage );
        	errorField.show();
    	}

		// Pass the data for post processing
		if( typeof controller[ postAction ] !== 'undefined' ) {

			controller[ postAction ]( false, parentElement, message, response );
		}
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