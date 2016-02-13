/** 
 * The GridController and classes extending it can be used to manage data grids providing searching, sorting and crud operations. 
 * It differs from RestController in default action names i.e. it provides default actions to perform actions including all, create, update and delete.
 */
cmt.api.controllers.GridController = function() {

	// Request and Collection
	this.endpoint	= null;	// Endpoint where all the requests need to be sent
	this.model		= null;	// The model name appended at last of endpoint and before action name. We do not need action name in case of get, post, put and delete.
	this.collection	= null; // The collection returned by server and cached locally.

	// Pagination
	this.pages		= 0;	// Total Pages formed using collection
	this.pageLimit	= 0;	// Total items in a page
	this.lastPage	= 0;	// The last page loaded when user scroll to bottom
};

cmt.api.controllers.GridController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.GridController.prototype.init = function() {

	console.log( "Initialised grid controller." );
};

// Read --------------------------

cmt.api.controllers.GridController.prototype.allActionPre = function() {

	console.log( "Pre processing all action." );

	return true;
};

cmt.api.controllers.GridController.prototype.allActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for all action." );
	}
	else {

		console.log( "Processing failure for all action." );
	}
};

// Create ------------------------

cmt.api.controllers.GridController.prototype.createActionPre = function() {

	console.log( "Pre processing create action." );

	return true;
};

cmt.api.controllers.GridController.prototype.createActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for create action." );
	}
	else {

		console.log( "Processing failure for create action." );
	}
};

// Update ------------------------

cmt.api.controllers.GridController.prototype.updateActionPre = function() {

	console.log( "Pre processing update action." );

	return true;
};

cmt.api.controllers.GridController.prototype.updateActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for update action." );
	}
	else {

		console.log( "Processing failure for update action." );
	}
};

// Delete ------------------------

cmt.api.controllers.GridController.prototype.deleteActionPre = function() {

	console.log( "Pre processing delete action." );

	return true;
};

cmt.api.controllers.GridController.prototype.deleteActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for delete action." );
	}
	else {

		console.log( "Processing failure for delete action." );
	}
};