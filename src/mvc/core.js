// TODO: Add Data Binding Support to bind data sent by server to respective ui component
// TODO: Add Data Binding with Pagination for Data Grid
// TODO: Add Page History and Caching Support

/**
 * CMGTools API library provide methods to process AJAX request. These requests can be either form or regular
 */

cmt.api = {};

// Manage Applications -----------------------------------

cmt.api.Root = function( options ) {

	this.apps		= []; // Alias, Path map

	this.activeApps	= []; // Alias, Application map
}

/**
 * It maps the application to registry by accepting alias and path.
 *
 * @param {string} alias
 * @param {string} path
 */
cmt.api.Root.prototype.mapApplication = function( alias, path ) {

	if( this.apps[ alias ] == undefined ) {

		this.apps[ alias ] = path;
	}
}

/**
 * It returns the application from active applications.
 *
 * @param {string} alias
 * @param {boolean} factory
 * @returns {cmt.api.Application}
 */
cmt.api.Root.prototype.getApplication = function( alias, options ) {

	options = typeof options !== 'undefined' ? options : { };

	if( this.apps[ alias ] == undefined ) throw 'Application with alias ' + alias + ' is not registered.';

	// Create singleton instance if not exist
	if( this.activeApps[ alias ] == undefined ) {

		var application = cmt.utils.object.strToObject( this.apps[ alias ] );

		// Initialise Application
		application.init( options );

		// Add singleton to active registry
		this.activeApps[ alias ] = application;
	}

	return this.activeApps[ alias ];
}

/**
 * It set and update the active applications.
 *
 * @param {string} alias
 * @param {cmt.api.Application} application
 */
cmt.api.Root.prototype.setApplication = function( alias, application ) {

	if( this.activeApps[ alias ] == undefined ) {

		this.activeApps[ alias ] = application;
	}
}

/**
 * It maps the application to registry and add it to active applications.
 *
 * @param {string} alias
 * @param {boolean} factory
 * @param {cmt.api.Application} application
 */
cmt.api.Root.prototype.registerApplication = function( alias, path, options ) {

	this.mapApplication( alias, path );

	return this.getApplication( alias, options );
};

cmt.api.root = new cmt.api.Root();
