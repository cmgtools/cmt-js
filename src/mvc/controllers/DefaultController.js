/**
 * The DefaultController and classes extending it can be used to post arbitrary requests to server using the possible request triggers.
 * It provides a default action as a fallback in case action is not specified by the Request Element.
 */
cmt.api.controllers.DefaultController = function() {

};

cmt.api.controllers.DefaultController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.DefaultController.prototype.init = function() {

	console.log( "Initialised default controller." );
};

cmt.api.controllers.DefaultController.prototype.defaultActionPre = function( requestElement ) {

	console.log( "Pre processing default action." );

	return true;
};

cmt.api.controllers.DefaultController.prototype.defaultActionPost = function( result, requestElement, response ) {

	if( result ) {

		console.log( "Processing success for default action." );
	}
	else {

		console.log( "Processing failure for default action." );
	}
};