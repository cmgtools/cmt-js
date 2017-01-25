cmt.api.controllers.BaseController = function() {

	this.requestTrigger	= null;	// Trigger Element
	this.requestData	= null;	// Request data to be appended for post requests. It can be prepared in pre processor.
	this.currentRequest	= null;	// Request in execution
};

cmt.api.controllers.BaseController.prototype.init = function() {

	// Init method to initialise controller
};