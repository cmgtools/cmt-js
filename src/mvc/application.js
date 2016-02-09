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

cmt.api.Application = function() {

	/**
	 * Config Object
	 */
	this.config = {
		json: false, 				// Identify whether all the request must be processed using json format
		basePath: null,				// Base path to be used to create requests.
		errorClass: '.error',		// Default css class for error elements
		messageClass: '.message',	// Default css class for showing request result as message
		spinnerClass: '.spinner'	// Default css class for showing spinner till the request gets processed
	};

	// Default controllers to be used as fallback in case no controller is mentioned
	var defaultController	= cmt.api.Application.CONTROLLER_DEFAULT;
	var postController		= cmt.api.Application.CONTROLLER_POST;

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
	this.controllers[ postController ] 		= 'cmt.api.controllers.PostController';

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
cmt.api.Application.CONTROLLER_POST		= 'post';				// Post Controller Alias
cmt.api.Application.ACTION_DEFAULT		= 'default';			// Default Controller's default Action

// Statics
cmt.api.Application.STATIC_CONTROLLER	=  'cmt-controller';	// Controller attribute set on request element.
cmt.api.Application.STATIC_ACTION		=  'cmt-action';		// Action attribute set on request element.
cmt.api.Application.STATIC_ID			=  'id';				// Id to uniquely identify request element.

cmt.api.Application.STATIC_CLICK		=  '.cmt-click';		// The class to be set for trigger element which fire request on click.
cmt.api.Application.STATIC_CHANGE		=  '.cmt-change';		// The class to be set for trigger element which fire request on value change.
cmt.api.Application.STATIC_KEY_UP		=  '.cmt-key-up';		// The class to be set for trigger element which fire request on key up.

cmt.api.Application.STATIC_CLEAR		=  'cmt-clear';			// The clear attribute specify whether request element's form fields need to be cleared on success.
cmt.api.Application.STATIC_ERROR		=  'cmt-error';			// The error element to display model property validation failure.

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

cmt.api.Application.prototype.findController = function( controllerAlias ) {

	// Return active controller
	if( this.activeControllers[ controller ] ) {

		return this.activeControllers[ controller ];
	}
	// Create a controller instance from registered controllers
	else {

		try {

			// Check whether controller is registered and throw exception
			if( this.controllers[ controller ] == undefined ) throw 'Controller with name ' + controller + ' is not registered with this application.';

			var cont 	= cmt.utils.object.strToObject( this.controllers[ controller ] );

			// Initialise Controller
			cont.init();

			// Add to active registry
			this.activeControllers[ controller ] = cont;

			return this.activeControllers[ controller ];
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