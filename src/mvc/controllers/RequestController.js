/**
 * The RequestController and classes extending it can be used to post arbitrary requests to server using the request element and it's trigger.
 * It provides a default action as a fallback in case action is not specified by the Request Element.
 */
cmt.api.controllers.RequestController = function( options ) {

	this.requestTrigger	= null;	// Request trigger which triggered the request. It will always be present within request element.

	this.requestForm	= null; // The element having form elements to be submitted with request. In most of the cases, it will be request element.

	this.requestData	= null;	// Request data to be appended for post requests. It can be prepared in pre processor to handle custom requests.

	this.currentRequest	= null;	// Request in execution.

	this.singleRequest	= false; // Process one request at a time and abort previous requests.
};

// Initialise --------------------

cmt.api.controllers.RequestController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.RequestController.prototype.init = function( options ) {

	console.log( "Initialised default controller." );
};

// Default Action ----------------

cmt.api.controllers.RequestController.prototype.defaultActionPre = function( requestElement ) {

	console.log( "Pre processing default action." );

	return true;
};

cmt.api.controllers.RequestController.prototype.defaultActionSuccess = function( requestElement, response ) {

	console.log( "Processing success for default action." );
};

cmt.api.controllers.RequestController.prototype.defaultActionFailure = function( requestElement, response ) {

	console.log( "Processing failure for default action." );
};
