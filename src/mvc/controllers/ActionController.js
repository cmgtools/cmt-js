/**
 * The ActionController and classes extending it can be used to post arbitrary requests to server
 * by calling execute method where actual request data will be formed. It's required where Request Element and
 * Request Trigger is not needed and request can be triggered by calling execute method.
 *
 * Ex:
 * myApp.findController( 'user' ).default();
 */
cmt.api.controllers.ActionController = function( options ) {

	this.requestData	= null;	// Request data for post requests
};

// Initialise --------------------

cmt.api.controllers.ActionController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.ActionController.prototype.init = function( options ) {

	console.log( "Initialised default controller." );
};

// Default Action ----------------

cmt.api.controllers.ActionController.prototype.default = function() {

	console.log( "Executing default action." );

	return true;
};

cmt.api.controllers.ActionController.prototype.defaultActionPre = function() {

	console.log( "Pre processing default action." );

	return true;
};

cmt.api.controllers.ActionController.prototype.defaultActionSuccess = function( response ) {

	console.log( "Processing success for default action." );
};

cmt.api.controllers.ActionController.prototype.defaultActionFailure = function( response ) {

	console.log( "Processing failure for default action." );
};
