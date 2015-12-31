/**
 * An application is a collection of config and controllers. A project can create multiple applications based on it's needs.
 * The request triggers present within view elements use the Request Processing Engine to route submitted requests to controllers for pre and post processing.
 */

cmt.api.Application = function() {

	/**
	 * Config Object
	 */
	this.config = {
		json: false, 				// Identify whether all the request must be processed using json format
		errorClass: 'error',		// Default css class for error elements
		messageClass: 'message',	// Default css class for showing request result as message
		spinnerClass: 'spinner'		// Default css class for showing spinner till the request gets processed
	};

	// Default controller to be used as fallback in case no controller is mentioned
	var defaultController	= cmt.api.Application.CONTROLLER_DEFAULT;
	
	/**
	 * -----------------------------
	 * Routing
	 * -----------------------------
	 * Request routing in CMGTools JS - MVC is handled by controllers list which is an associative array of controller name and classpath. The app should 
	 * know all the controllers it's dealing with. It also maintains a seperate list of active controllers which are already initialised. The active controllers list 
	 * is associative array of controller name and object.
	 * 
	 * The Request Processing Engine use the pre-defined controllers to process a request and fallback to default controller and action in case it does not 
	 * find appropriate controller and action.
	 */

	/**
	 * An exhaustive list of all the controllers available for the application. Each application can use this listing to maintain it's controllers list.
	 */
	this.controllers 						= [];
	this.controllers[ defaultController ] 	= "cmt.api.controllers.DefaultController";

	/**
	 * List of all the active controllers which are already initialised. It will save us from re-initialising controllers.
	 */
	this.activeControllers 	= [];
	
	// TODO: Add routing table to automatically detect controller based on request route.
};

/**
 * App Globals
 */

//Defaults
cmt.api.Application.CONTROLLER_DEFAULT	= 'default';			// Default Controller
cmt.api.Application.ACTION_DEFAULT		= 'default';			// Default Controller's default Action

// Statics
cmt.api.Application.STATIC_CONTROLLER	=  'cmt-controller';	// Controller attribute set on request element.
cmt.api.Application.STATIC_ACTION		=  'cmt-action';		// Action attribute set for form or request
cmt.api.Application.STATIC_ID			=  'id';				// Id to uniquely identify form and request.
cmt.api.Application.STATIC_CLICK		=  '.cmt-click';		// The class to be set for element which trigger request on click.
cmt.api.Application.STATIC_CHANGE		=  '.cmt-change';		// The class to be set for element which trigger request on value change.
cmt.api.Application.STATIC_KEY_UP		=  '.cmt-key-up';		// The class to be set for element which trigger request on key up.
cmt.api.Application.STATIC_CLEAR		=  'cmt-clear';			// The clear attribute specify whether request element's form fields need to be cleared on success.
cmt.api.Application.STATIC_ERROR		=  'cmt-error';			// The error element to display model property validation failure.

/**
 * -----------------------------
 * Request Processing Engine (RPE)
 * -----------------------------
 * The Request Processing Engine (RPE) process the requests by initialising the triggers. These triggers can be form submit, button click, select change.
 * We need to use the jQuery plugin to register these triggers. Example:
 * 
 * jQuery( "<selector>" ).cmtRequestProcessor( { app: <application> } );
 * 
 * The selectors passed to request processor plugin forming the view can wrap form elements and the request trigger element. A request can be initiated 
 * based on trigger type and user action. The request triggers pass request to RPE which further find the appropriate controller and initialise it for 
 * first time and update active controllers map. RPE is responsible for calling pre processor method(if exist) for identified action and pass request to
 * backend. RPE also process response sent back by server and pass it to post processor method(if exist). The controller might define pre and post processor methods 
 * for an action. The post processor method can define logic to handle response and use appropriate templating engine to update view.
 */

/**
 * Initialise request triggers
 * @param requestTriggers - All the triggers passed by JQuery selector using application plugin.
 */
cmt.api.Application.prototype.registerTriggers = function( requestTriggers ) {

	var app	= this;

	// Iterate and initialise all the triggers
	requestTriggers.each( function() {

		var requestTrigger = jQuery( this );

		// Form Submits
		if( requestTrigger.is( "form" ) ) {

			requestTrigger.unbind( "submit" );

			requestTrigger.submit( function( event ) {

				event.preventDefault();

				app.initRequestTrigger( requestTrigger.attr( cmt.api.Application.STATIC_ID ), true, requestTrigger.attr( cmt.api.Application.STATIC_CONTROLLER ), requestTrigger.attr( cmt.api.Application.STATIC_ACTION ) );
			});
		}

		// Button Clicks
		var clickTrigger = requestTrigger.find( cmt.api.Application.STATIC_CLICK );

		if( clickTrigger.length > 0 ) {

			clickTrigger.unbind( "click" );

			clickTrigger.click( function( event ) {

				event.preventDefault();

				app.initRequestTrigger( requestTrigger.attr( cmt.api.Application.STATIC_ID ), false, requestTrigger.attr( cmt.api.Application.STATIC_CONTROLLER ), requestTrigger.attr( cmt.api.Application.STATIC_ACTION ) );
			});
		}

		// Select Change
		var selectTrigger = requestTrigger.find( cmt.api.Application.STATIC_CHANGE );

		if( selectTrigger.length > 0 ) {

			selectTrigger.unbind( "change" );

			selectTrigger.change( function() {

				app.initRequestTrigger( requestTrigger.attr( cmt.api.Application.STATIC_ID ), false, requestTrigger.attr( cmt.api.Application.STATIC_CONTROLLER ), requestTrigger.attr( cmt.api.Application.STATIC_ACTION ) );
			});
		}

		// Key Up
		var keyupTrigger = requestTrigger.find( cmt.api.Application.STATIC_KEY_UP );

		if( keyupTrigger.length > 0 ) {

			keyupTrigger.unbind( "keyup" );

			keyupTrigger.keyup( function() {

				app.initRequestTrigger( requestTrigger.attr( cmt.api.Application.STATIC_ID ), false, requestTrigger.attr( cmt.api.Application.STATIC_CONTROLLER ), requestTrigger.attr( cmt.api.Application.STATIC_ACTION ) );
			});
		}
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
		if( typeof controller[ preAction ] !== 'undefined' && !( controller[ preAction ]( element ) ) ) {

			return false;
		}

		// Generate request data for submission
		var requestData	= cmt.utils.data.serialiseElement( elementId );

		// Show Spinner
		jQuery( "#" + elementId + " ." + this.spinnerClass ).show();

		jQuery.ajax({
			type: httpMethod,
			url: actionUrl,
			data: requestData,
			dataType: "JSON",
			success: function( response, textStatus, XMLHttpRequest ) {

				// Process response
				app.processAjaxResponse( elementId, controller, action, message, response );
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
	}
};

/**
 * JQuery Plugin to initialise request triggers for the given application.
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

			app.registerTriggers( this );
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