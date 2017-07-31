/**
 * The GridController and classes extending it can be used to manage data grids providing
 * searching, sorting and crud operations. It differs from RestController in default action
 * names i.e. it provides default actions to perform actions including all, create, update and delete.
 */
cmt.api.controllers.GridController = function( options ) {

	this.endpoint	= null;	// Endpoint where all the requests need to be sent

	/**
	 * The model name appended at last of endpoint and before action name.
	 * We do not need action name in case of get, post, put and delete.
	 */
	this.model		= null;

	/**
	 * The collection returned by server and cached locally. The grid will always be
	 * refreshed as soon as collection changes.
	 */
	this.collection	= null;

	/**
	 * Template used to render the grid rows.
	 */
	this.rowTemplate	= null;

	/**
	 * Template used to render the cards.
	 */
	this.cardTemplate	= null;

	// Pagination
	this.pages		= 0; // Total Pages formed using collection
	this.pageLimit	= 0; // Total items in a page
	this.lastPage	= 0; // The last page loaded when user scroll to bottom
};

// Initialise --------------------

cmt.api.controllers.GridController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.GridController.prototype.init = function( options ) {

	console.log( "Initialised grid controller." );
};

// Read --------------------------

cmt.api.controllers.GridController.prototype.allActionPre = function() {

	console.log( "Pre processing all action." );

	return true;
};

cmt.api.controllers.GridController.prototype.allActionSuccess = function( response ) {

	console.log( "Processing success for all action." );
};

cmt.api.controllers.GridController.prototype.allActionFailure = function( response ) {

	console.log( "Processing failure for all action." );
};

// Create ------------------------

cmt.api.controllers.GridController.prototype.createActionPre = function() {

	console.log( "Pre processing create action." );

	return true;
};

cmt.api.controllers.GridController.prototype.createActionSuccess = function( response ) {

	console.log( "Processing success for create action." );
};

cmt.api.controllers.GridController.prototype.createActionFailure = function( response ) {

	console.log( "Processing failure for create action." );
};

// Update ------------------------

cmt.api.controllers.GridController.prototype.updateActionPre = function() {

	console.log( "Pre processing update action." );

	return true;
};

cmt.api.controllers.GridController.prototype.updateActionSuccess = function( response ) {

	console.log( "Processing success for update action." );
};

cmt.api.controllers.GridController.prototype.updateActionFailure = function( response ) {

	console.log( "Processing failure for update action." );
};

// Delete ------------------------

cmt.api.controllers.GridController.prototype.deleteActionPre = function() {

	console.log( "Pre processing delete action." );

	return true;
};

cmt.api.controllers.GridController.prototype.deleteActionSuccess = function( response ) {

	console.log( "Processing success for delete action." );
};

cmt.api.controllers.GridController.prototype.deleteActionFailure = function( response ) {

	console.log( "Processing failure for delete action." );
};
