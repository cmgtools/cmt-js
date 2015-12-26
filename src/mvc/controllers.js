/*
 * Dependencies: jquery, mvc/core.js
 */

/**
 * Controller namespace providing base class for all the Controllers.
 */
cmt.api.controllers = {};

cmt.api.controllers.BaseController = function() {
	
	// Base Controller
};

cmt.api.controllers.BaseController.prototype.init = function() {
	
	// Init method to initialise controller
};

// Default Controller

cmt.api.controllers.DefaultController = function() {};

cmt.api.controllers.DefaultController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.DefaultController.prototype.init = function() {
	
	console.log( "Initialised default controller." );
};

cmt.api.controllers.DefaultController.prototype.defaultActionPre = function( parentElement ) {

	console.log( "Pre processing default action." );
	
	return true;
};

cmt.api.controllers.DefaultController.prototype.defaultActionPost = function( success, parentElement, message, response ) {

	if( success ) {

		console.log( "Processing success for default action." );
	}
	else {

		console.log( "Processing failure for default action." );
	}
};