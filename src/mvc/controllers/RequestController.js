/** 
 * The RequestController and classes extending it can be used to post arbitrary requests to server by calling execute method where actual request data will be formed.
 * It's required where Request Element and Request Trigger is not needed and request can be triggered by calling execute method.
 * 
 * Ex:
 * myApp.findController( 'user' ).defaultAction();
 */
cmt.api.controllers.RequestController = function() {

	this.requestData	= null;	// Request data for post requests
};

cmt.api.controllers.RequestController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.RequestController.prototype.init = function() {

	console.log( "Initialised default controller." );
};

cmt.api.controllers.RequestController.prototype.defaultAction = function() {

	console.log( "Pre processing default action." );

	// 1. Prepare request data

	// 2. Call method to process the request
};

cmt.api.controllers.RequestController.prototype.defaultActionPre = function() {

	console.log( "Pre processing default action." );

	return true;
};

cmt.api.controllers.RequestController.prototype.defaultActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for default action." );
	}
	else {

		console.log( "Processing failure for default action." );
	}
};