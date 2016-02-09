cmt.api.controllers.PostController = function() {};

cmt.api.controllers.PostController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.PostController.prototype.init = function() {

	console.log( "Initialised post controller." );
};

cmt.api.controllers.PostController.prototype.defaultActionPre = function() {

	console.log( "Pre processing post action." );

	return true;
};

cmt.api.controllers.PostController.prototype.defaultActionPost = function( success, message, response ) {

	if( success ) {

		console.log( "Processing success for post action." );
	}
	else {

		console.log( "Processing failure for post action." );
	}
};