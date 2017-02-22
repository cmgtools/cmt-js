cmt.api.controllers.BaseController = function() {

	this.requestTrigger	= null;	// Trigger Element
	this.requestData	= null;	// Request data to be appended for post requests. It can be prepared in pre processor.
	this.currentRequest	= null;	// Request in execution
};

cmt.api.controllers.BaseController.prototype.init = function() {

	// Init method to initialise controller
};

cmt.api.controllers.BaseController.prototype.defaultActionPre = function( requestElement ) {

	console.log( "Pre processing default action." );

	return true;
};

cmt.api.controllers.BaseController.prototype.defaultActionPost = function( result, requestElement, response ) {

	if( result ) {

		console.log( "Processing success for default action." );
	}
	else {

		console.log( "Processing failure for default action." );
	}
};