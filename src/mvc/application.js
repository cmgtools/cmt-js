/*
 * Dependencies: jquery, core/main.js, core/utils.js, mvc/core.js, mvc/controllers.js
 */

/**
 * An application is a collection of config and controllers.
 */
cmt.api.Application = function() {

	/**
	 * Config Object
	 */
	this.config = {
		json: false, 				// Identify whether all the request must be processed using json format
		errorClass: 'error',		// Default error css class
		messageClass: 'message',	// Default message css class
		spinnerClass: 'spinner'		// Default spinner css class
	};

	// Default controller to be used as fallback in case no controller is mentioned
	var defaultController	= cmt.api.Application.CONTROLLER_DEFAULT;

	/**
	 * An exhaustive list of all the controllers available for the application. Each application can use this listing to maintain it's controllers list.
	 */
	this.controllers 						= [];
	this.controllers[ defaultController ] 	= "cmt.api.controllers.DefaultController";

	/**
	 * List of all the active controllers which are already initialised. It will save us from re-initialising each controller to process a request.
	 */
	this.activeControllers 	= [];
};

/**
 * JQuery Plugin to initialise application.
 */
( function( cmtjq ) {

	cmtjq.fn.processAjax = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 	= cmtjq.extend( {}, cmtjq.fn.processAjax.defaults, options );
		var app			= new cmt.api.Application();

		// Initialise application
		app.config.json	= settings.json;
		app.controllers	= cmtjq.extend( [], app.controllers, settings.controllers );

		app.init( this );

		// return control
		return;
	};

	// Default Settings
	cmtjq.fn.processAjax.defaults = {
		json: false,
		controllers: []
	};

}( jQuery ) );

/**
 * App Globals
 */

//Defaults
cmt.api.Application.CONTROLLER_DEFAULT	= 'default';			// Default Controller
cmt.api.Application.ACTION_DEFAULT		=  'default';			// Default Controller Actions

// Statics
cmt.api.Application.STATIC_CONTROLLER	=  'cmt-controller';	// Controller attribute set for form or request
cmt.api.Application.STATIC_ACTION		=  'cmt-action';		// Action attribute set for form or request
cmt.api.Application.STATIC_ID			=  'id';				// Id to uniquely identify form and request.
cmt.api.Application.STATIC_FORM			=  'cmt-form';			// The class to be set for forms which need to be considered by this application
cmt.api.Application.STATIC_SUBMIT		=  '.cmt-submit';		// The class to be set for element which submit request on click
cmt.api.Application.STATIC_SELECT		=  '.cmt-select';		// The class to be set for select box which submit request on change
cmt.api.Application.STATIC_CLEAR		=  'cmt-clear';			// The clear attribute specify whether form/request need to be cleared on success.
cmt.api.Application.STATIC_ERROR		=  'cmt-error';			// The error element to display model property validation failure

/**
 * Initialise application
 * @param requestTriggers - All the triggers passed by JQuery selector using application plugin.
 */
cmt.api.Application.prototype.init = function( requestTriggers ) {

	var app	= this;

	// Iterate and initialise all the triggers
	requestTriggers.each( function() {

		var requestTrigger = jQuery( this );

		// Form Submits
		if( requestTrigger.hasClass( cmt.api.Application.STATIC_FORM ) ) {

			requestTrigger.submit( function( event ) {

				event.preventDefault();
	
				app.initRequestTrigger( requestTrigger.attr( cmt.api.Application.STATIC_ID ), true, requestTrigger.attr( cmt.api.Application.STATIC_CONTROLLER ), requestTrigger.attr( cmt.api.Application.STATIC_ACTION ) );
			});
		}

		// Button Submits
		requestTrigger.find( cmt.api.Application.STATIC_SUBMIT ).click( function( event ) {

			event.preventDefault();

			var request			= jQuery( "#" + requestTrigger.attr( "cmt-request" ) );

			app.initRequestTrigger( request.attr( cmt.api.Application.STATIC_ID ), false, request.attr( cmt.api.Application.STATIC_CONTROLLER ), request.attr( cmt.api.Application.STATIC_ACTION ) );
		});

		// Select Submits
		requestTrigger.find( cmt.api.Application.STATIC_SELECT ).change( function() {

			var request			= jQuery( "#" + requestTrigger.attr( "cmt-request" ) );

			app.initRequestTrigger( request.attr( cmt.api.Application.STATIC_ID ), false, request.attr( cmt.api.Application.STATIC_CONTROLLER ), request.attr( cmt.api.Application.STATIC_ACTION ) );
		});
	});
};

cmt.api.Application.prototype.findController = function( controller ) {

	// Return active controller
	if( this.activeControllers[ controller ] ) {
		
		return this.activeControllers[ controller ];
	}
	// Create a controller instance from registered controllers
	else {

		try {

			// Check whether controller is registered and throw exception
			if( this.controllers[ controller ] == undefined ) throw "Controller with name " + controller + " is not registered with this application.";

			var cont 	= cmt.utils.object.strToObject( this.controllers[ controller ] );

			// Initialise
			cont.init();

			// Add to active registry
			this.activeControllers[ controller ] = cont;

			return this.activeControllers[ controller ];
		}
		catch( err ) {

			console.log( err );

			console.log( "Falling back to default controller." );

			if( this.controllers[ cmt.api.Application.CONTROLLER_DEFAULT ] !== undefined ) {

				return this.findController( cmt.api.Application.CONTROLLER_DEFAULT );
			}
		}
	}
};

// Init triggers required to process request -------------

cmt.api.Application.prototype.initRequestTrigger = function( requestId, form, controller, action ) {

	// Use default controller
	if( null == controller ) {

		controller = cmt.api.Application.CONTROLLER_DEFAULT;
	}

	// Use default action
	if( null == action ) {

		action = cmt.api.Application.ACTION_DEFAULT;
	}

	// Search Controller
	var controllerObj	= this.findController( controller );

	if( form ) {

		if( this.config.json ) {

			this.handleRestForm( requestId, controllerObj, action );
		}
		else {

			this.handleAjaxForm( requestId, controllerObj, action );
		}
	}
	else {

		this.handleAjaxRequest( requestId, controllerObj, action );
	}
};

cmt.api.Application.prototype.handleRestForm = function( formId, controller, action ) {
		
		var app			= this;
		var form		= jQuery( "#" + formId );
		var httpMethod	= form.attr( "method" );
		var actionUrl	= form.attr( "action" );
		var message		= jQuery( "#" + formId + " ." + this.config.messageClass );
		var preAction	= action + "ActionPre";

		// Hide message element
		message.hide();

		// Hide all errors
		jQuery( "#" + formId + " ." + this.config.errorClass ).hide();

		// Pre Process Form
		if( typeof controller[ preAction ] !== 'undefined' && !( controller[ preAction ]( form ) ) ) {

			return false;
		}
		else if( controller instanceof cmt.api.controllers.DefaultController && !( controller[ cmt.api.Application.ACTION_DEFAULT + "ActionPre" ]( form ) ) ) {

			return false;
		}

		// Generate form data for submission
		var formData	= cmt.utils.data.formToJson( formId );

		// Show Spinner
		jQuery( "#" + formId + " ." + this.config.spinnerClass ).show();

		jQuery.ajax({
			type: httpMethod,
			url: actionUrl,
			data: JSON.stringify( formData ),
			dataType: "JSON",
			contentType: "application/json;charset=UTF-8",
			success: function( response, textStatus, XMLHttpRequest ) {

				// Process response
				app.processAjaxResponse( formId, controller, action, message, response );
			}
		});

		return false;
};

cmt.api.Application.prototype.handleAjaxForm = function( formId, controller, action ) {
		
		var app			= this;
		var form		= jQuery( "#" + formId );
		var httpMethod	= form.attr( "method" );
		var actionUrl	= form.attr( "action" );
		var message		= jQuery( "#" + formId + " ." + this.config.messageClass );
		var preAction	= action + "ActionPre";

		// Hide message
		message.hide();

		// Hide all errors
		jQuery( "#" + formId + " ." + this.config.errorClass ).hide();

		// Pre Process Form
		if( typeof controller[ preAction ] !== 'undefined' && !( controller[ preAction ]( form ) ) ) {

			return false;
		}
		else if( controller instanceof cmt.api.controllers.DefaultController && !( controller[ cmt.api.Application.ACTION_DEFAULT + "ActionPre" ]( form ) ) ) {

			return false;
		}
		
		// Generate form data for submission
		var formData	= cmt.utils.data.serialiseForm( formId );

		// Show Spinner
		jQuery( "#" + formId + " ." + this.config.spinnerClass ).show();

		jQuery.ajax( {
			type: httpMethod,
			url: actionUrl,
			data: formData,
			dataType: "JSON",
			success: function( response, textStatus, XMLHttpRequest ) {

				// Process response
				app.processAjaxResponse( formId, controller, action, message, response );
			}
		});

		return false;
};

cmt.api.Application.prototype.handleAjaxRequest = function( elementId, controller, action ) {

		var app			= this;
		var element		= jQuery( "#" + elementId );
		var httpMethod	= element.attr( "method" );
		var actionUrl	= element.attr( "action" );
		var message		= jQuery( "#" + elementId + " ." + this.config.messageClass );
		var preAction	= action + "ActionPre";

		if( null == httpMethod ) {

			httpMethod = 'post';
		}

		// Hide message
		message.hide();

		// Hide all errors
		jQuery( "#" + elementId + " ." + this.errorClass ).hide();

		// Pre Process Request
		if( typeof controller[ preAction ] !== 'undefined' && !( controller[ preAction ]( form ) ) ) {

			return false;
		}
		else if( controller instanceof cmt.api.controllers.DefaultController && !( controller[ cmt.api.Application.ACTION_DEFAULT + "ActionPre" ]( form ) ) ) {

			return false;
		}

		// Generate request data for submission
		var requestData	= Cmt.utils.data.serialiseElement( elementId );

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
};

cmt.api.Application.prototype.processAjaxResponse = function( requestId, controller, action, message, response ) {

	var result 		= response[ 'result' ];
	var messageStr 	= response[ 'message' ];
	var data		= response[ 'data' ];
	var errors		= response[ 'errors' ];
	var postAction	= action + "ActionPost";

	if( result == 1 ) {

		// Show message
		message.html( messageStr );
		message.show();

		// Hide all errors
		jQuery( "#" + requestId + " ." + this.config.errorClass ).hide();

		// Hide Spinner
		jQuery( "#" + requestId + " ." + this.config.spinnerClass ).hide();

		// Check to clear form data
		var clearData = jQuery( "#" + requestId ).attr( cmt.api.Application.STATIC_CLEAR );

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
		if( typeof controller[ postAction ] !== 'undefined' ) {

			controller[ postAction ]( true, requestId, message, response );
		}
		else if( controller instanceof cmt.api.controllers.DefaultController ) {
			
			controller[ cmt.api.Application.ACTION_DEFAULT + "ActionPost" ]( true, requestId, message, response );
		}
	}
	else if( result == 0 ) {

		// Show message
		message.html( messageStr );
		message.show();

		// Hide Spinner
		jQuery( "#" + requestId + " ." + this.config.spinnerClass ).hide();

		// Show Errors
		for( var key in errors ) {

        	var fieldName 		= key;
        	var errorMessage 	= errors[ key ];
        	var errorField		= jQuery( "#" + requestId + " span[" + cmt.api.Application.STATIC_ERROR + "='" + fieldName + "']" );

        	errorField.html( errorMessage );
        	errorField.show();
    	}

		// Pass the data for post processing
		if( typeof controller[ postAction ] !== 'undefined' ) {

			controller[ postAction ]( false, requestId, message, response );
		}
		else if( controller instanceof cmt.api.controllers.DefaultController ) {
			
			controller[ cmt.api.Application.ACTION_DEFAULT + "ActionPost" ]( false, requestId, message, response );
		}
	}
};