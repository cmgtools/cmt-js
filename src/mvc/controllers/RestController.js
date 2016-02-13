/** 
 * The RestController and classes extending it can be used to manage classical rest requests providing searching, sorting and crud operations. 
 * It provides default actions to perform rest actions including get, post, put and delete.
 */
cmt.api.controllers.RestController = function() {

	// Request and Collection
	this.endpoint	= null;	// Endpoint where all the requests need to be sent
	this.model		= null;	// The model name appended at last of endpoint and before action name. We do not need action name in case of get, post, put and delete.
	this.collection	= null; // The collection returned by server and cached locally.

	// Pagination
	this.pages		= 0;	// Total Pages formed using collection
	this.pageLimit	= 0;	// Total items in a page
	this.lastPage	= 0;	// The last page loaded when user scroll to bottom
};

cmt.api.controllers.RestController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.RestController.prototype.init = function() {

	console.log( "Initialised rest controller." );
};

// Get ---------------------------

cmt.api.controllers.RestController.prototype.getActionPre = function() {

	console.log( "Pre processing get action." );

	return true;
};

cmt.api.controllers.RestController.prototype.getActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for get action." );
	}
	else {

		console.log( "Processing failure for get action." );
	}
};

// Post --------------------------

cmt.api.controllers.RestController.prototype.postActionPre = function() {

	console.log( "Pre processing post action." );

	return true;
};

cmt.api.controllers.RestController.prototype.postActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for post action." );
	}
	else {

		console.log( "Processing failure for post action." );
	}
};

// Put ---------------------------

cmt.api.controllers.RestController.prototype.putActionPre = function() {

	console.log( "Pre processing put action." );

	return true;
};

cmt.api.controllers.RestController.prototype.putActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for put action." );
	}
	else {

		console.log( "Processing failure for put action." );
	}
};

// Delete ------------------------

cmt.api.controllers.RestController.prototype.deleteActionPre = function() {

	console.log( "Pre processing delete action." );

	return true;
};

cmt.api.controllers.RestController.prototype.deleteActionPost = function( result, response ) {

	if( result ) {

		console.log( "Processing success for delete action." );
	}
	else {

		console.log( "Processing failure for delete action." );
	}
};