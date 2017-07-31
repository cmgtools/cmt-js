/**
 * Object utility provides methods to initialise or manipulate objects.
 */

cmt.utils.object = {

	/**
	 * Return object/instance associated to given string with namespace. It also check the type of Object.
	 */
	strToObject: function( str ) {

	    var arr 		= str.split( "." );
		var objClass	= ( window || this );

	    for( var i = 0, arrLength = arr.length; i < arrLength; i++ ) {

	        objClass	= objClass[ arr[ i ] ];
	    }

		var obj		= new objClass;

		if ( typeof obj !== 'object' ) {

			throw new Error( str +" not found" );
		}

		return obj;
	},

	// Check whether the given object has property
	hasProperty: function( object, property ) {

		var prototype = object.__proto__ || object.constructor.prototype;

		return ( property in object ) && ( !( property in prototype ) || prototype[ property ] !== object[ property ] );
	}
};
