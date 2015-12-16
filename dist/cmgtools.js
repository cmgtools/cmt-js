/**
 * CMGTools JS - v1.0.0-alpha1 - 2015-12-16
 * Description: CMGTools JS is a JavaScript library which provide utilities, ui components and MVC framework implementation for CMSGears.
 * License: GPLv3
 * Author: Bhagwat Singh Chouhan
 */
// Global Namespace for CMGTools
var cmt = cmt || {};;/*
 * Dependencies: jquery
 */

/**
 * CMGTools Utilities - Collection of commonly used utility functions available for CMGTools.
 */
cmt.utils = {};

// Browser Features ------------------------------------------

/**
 * Browser utility provides commonly used browser feature detection methods.
 */
cmt.utils.browser = {

	/**
	 * Detect whether browser supports xhr.
	 */
	isXhr: function() {

		var xhr	= new XMLHttpRequest();

		return xhr.upload;
	},

	/**
	 * Detect whether browser supports file api.
	 */
	isFileApi: function() {

		return window.File && window.FileList && window.FileReader;	
	},

	/**
	 * Detect whether browser supports form data.
	 */
	isFormData: function() {

		return !! window.FormData;
	},

	/**
	 * Detect whether browser supports canvas.
	 */
	isCanvas: function() {

		var elem 			= document.createElement( 'canvas' );
		var canvasSupported = !!( elem.getContext && elem.getContext( '2d' ) );

		return canvasSupported;
	},

	/**
	 * Detect whether browser supports canvas data url feature.
	 */
	isCanvasDataUrl: function() {

		// Used image/png for testing purpose
	
		var cvsTest 			= document.createElement( "canvas" );
		var data				= cvsTest.toDataURL( "image/png" );
		var toDataUrlSupported	= data.indexOf( "data:image/png" ) == 0;
	
		return toDataUrlSupported;
	}
};
	
// Image Processing ------------------------------------------

/**
 * Image utility provides commonly used image processing methods.
 */
cmt.utils.image = {

	/**
	 * It returns an array having width and height for the given image and target dimensions maintaining aspect ratio.
	 */
	arDimensions: function( image, targetWidth, targetHeight ) {

	        var ratio 	= 0;
	        var width 	= image.width;
	        var height 	= image.height;

	        // Check if the current width is larger than the max
	        if( width > targetWidth ) {

	            ratio 	= targetWidth / width;
	            height 	= height * ratio;
	            width 	= width * ratio;
	        }

	        // Check if current height is larger than max
	        if( height > targetHeight ) {

	            ratio 	= targetHeight / height;
	            width 	= width * ratio;
	        }

	        return new Array( width, height );
	},

	/**
	 * It draws the provided image file at center of canvas.
	 */
	drawAtCanvasCenter: function( canvas, imageUrl ) {

		if( null != canvas && null != imageUrl ) {

			var width		= canvas.width;
			var height		= canvas.height;

			var context 	= canvas.getContext( '2d' );
		    var image 		= new Image();
		    var image_url 	= window.URL || window.webkitURL;
		    var image_src 	= image_url.createObjectURL( imageUrl );
		    image.src 		= image_src;

		    image.onload = function() {

		        var dims = cmt.utils.image.arDimensions( image, width, height );

				context.translate( width/2, height/2 );

		        context.drawImage( image, -(dims[0] / 2), -(dims[1] / 2), dims[0], dims[1] );

				context.translate( -(width/2), -(height/2) );

		        image_url.revokeObjectURL( image_src );
		    };
		}
	}
};

// Data Processing -------------------------------------------

/**
 * Data utility provides methods to convert form elements to json format. The json data can be used to send request to server side apis.
 */
cmt.utils.data = {

	/**
	 * It reads elementId and convert the input fields present within the element to parameters url.
	 */
	serialiseElement: function( elementId ) {

		var dataArr		= [];
		var elements 	= jQuery( '#' + elementId ).find( ':input' ).get();

		jQuery.each( elements, function() {

			if ( this.name && !this.disabled && ( this.checked || /select|textarea/i.test( this.nodeName ) || /text|hidden|password/i.test( this.type ) ) ) {

				var val = jQuery( this ).val();

				dataArr.push( encodeURIComponent( this.name ) + "=" + encodeURIComponent( val ) );
			}
		});

		// Form the data url having all the parameters
		var dataUrl = dataArr.join( "&" ).replace( /%20/g, "+" );

		// Append CSRF token if available
		if( null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			dataUrl += "&_csrf=" + csrfToken;
		}

		return dataUrl;
	},

	/**
	 * It reads elementId and convert the input fields present within the element to json.
	 */
	elementToJson: function( elementId ) {

		var dataArr		= [];
		var elements 	= jQuery( '#' + elementId ).find(':input').get();

		jQuery.each( elements, function() {

			if ( this.name && !this.disabled && ( this.checked || /select|textarea/i.test( this.nodeName ) || /text|hidden|password/i.test( this.type ) ) ) {

				var val = jQuery( this ).val();

				dataArr.push( { name: this.name, value: val } );
			}
		});

		return cmt.utils.data.generateJsonMap( dataArr );
	},

	/**
	 * It reads formId and convert the input fields present within the form to parameters url. It use the serialize function provided by jQuery.
	 */
	serialiseForm: function( formId ) {

		// Generate form data for submission
		var dataUrl	= null;

		if( typeof formId == 'string' ) {

			dataUrl	= jQuery( '#' + formId ).serialize();	
		}
		else {

			dataUrl	= formId.serialize();
		}

		// Append CSRF token if available
		if( null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			dataUrl 	   += "&_csrf=" + csrfToken;
		}

		return dataUrl;
	},

	/**
	 * It reads formId and convert the form input fields to a Json Array.
	 */
	formToJson: function( formId ) {

		// Generate form data for submission
		var formData	= null;

		if( typeof formId == 'string' ) {

			formData	= jQuery( '#' + formId ).serializeArray();	
		}
		else {

			formData	= formId.serializeArray();
		}

		return cmt.utils.data.generateJsonMap( formData );
	},

	/**
	 * It reads an data array having name value pair and convert it to json format.
	 */
	generateJsonMap: function( dataArray ) {

		var json 		= {};

		// Append csrf token if required
		if( null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			dataArray.push( { name: "_csrf", value: csrfToken } );
		}

		jQuery.map( dataArray, function(n, i) {

			var _ = n.name.indexOf('[');

			if (_ > -1) {

				var o = json;
				_name = n.name.replace(/\]/gi, '').split('[');

				for (var i=0, len=_name.length; i<len; i++) {

					if (i == len-1) {

						if (o[_name[i]]) {

							if (typeof o[_name[i]] == 'string') {

								o[_name[i]] = [o[_name[i]]];
							}

							o[_name[i]].push(n.value);
						}

						else o[_name[i]] = n.value || '';
					}

					else o = o[_name[i]] = o[_name[i]] || {};
				}
			}
			else {

				if (json[n.name] !== undefined) {

					if (!json[n.name].push) {

						json[n.name] = [json[n.name]];
					}

					json[n.name].push(n.value || '');
				}
				else {

					json[n.name] = n.value || '';
				}	
			}
		});

		return json;
	},

	/**
	 * Edit parameter for the given URL.
	 */
	updateUrlParam: function( sourceUrl, e, t ) {

		var n;
		var r 	= "";
		var i 	= jQuery( "<a />" ).attr( "href", sourceUrl )[ 0 ];
		var s,o	= /\+/g;
		var u	= /([^&=]+)=?([^&]*)/g;
		var a	= function( e ) { return decodeURIComponent( e.replace( o, " " ) ); };
		var f 	= i.search.substring( 1 );
		n		= {};
	
		while( s = u.exec( f ) ) {
	
			n[ a( s[1] ) ] = a( s[2] );
		}
	
		if( !e && !t ) {
	
			return n;
		}
		else if( e && !t ) {
	
			return n[e];
		}
		else {
	
			n[e]	= t;
			var l	= [];
	
			for( var c in n ) {
	
				l.push( encodeURIComponent( c ) + "=" + encodeURIComponent( n[c] ) );
			}
	
			if( l.length > 0 ) {
	
				r = "?" + l.join( "&" );
			}
	
			return i.origin + i.pathname + r;
		}
	},

	/**
	 * Remove parameter from the given url.
	 */
	removeParam: function( sourceUrl, key ) {

	    var baseUrl 	= sourceUrl.split( "?" )[ 0 ];
		var param		= null;
		var paramsArr 	= [];
		var queryString = ( sourceUrl.indexOf( "?" ) !== -1 ) ? sourceUrl.split( "?" )[ 1 ] : "";

	    if( queryString !== "" ) {

	        paramsArr = queryString.split( "&" );

	        for( var i = paramsArr.length - 1; i >= 0; i -= 1 ) {

	            param = paramsArr[ i ].split( "=" )[ 0 ];

	            if( param === key ) {

	                paramsArr.splice( i, 1 );
	            }
	        }

	        baseUrl = baseUrl + "?" + paramsArr.join( "&" );
	    }

	    return baseUrl;
	}
};

// Object Utilities ------------------------------------------

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
	}
};

// UI Utilities ----------------------------------------------

/**
 * UI utility provides methods to format or manage UI elements.
 */
cmt.utils.ui = {

	/**
	 * Aligns child element content at the center of parent vertically and horizontally. It expect parent to be positioned.
	 */
	alignMiddle: function( parent, child ) {

		var parent			= jQuery( parent );
		var child			= jQuery( child );

		var parentHeight	= parent.height();
		var parentWidth		= parent.width();
		var childHeight		= child.height();
		var childWidth		= child.width();

		if( childHeight <= parentHeight && childWidth <= parentWidth ) {

			var top 	= (parentHeight - childHeight) / 2;
			var left 	= (parentWidth - childWidth) / 2;

			child.css( { "position": "absolute", "top": top, "left": left } );	
		}
	},
	// it converts checkboxes to yes/no
	initFormCheckbox: function( formSelector, yesNo ) {

		var checkboxes = jQuery( formSelector ).find( "input[type='checkbox']" );

		checkboxes.each( function() {

			if( yesNo ) {

				if( jQuery( this ).parent().find( ".customcheck" ).val() == 'Yes' ) {

					jQuery( this ).prop( 'checked', true );
				}
			}
		});

		checkboxes.change( function() {

			if( yesNo ) {

				if( jQuery( this ).prop( 'checked' ) ) {

					jQuery( this ).parent().find( ".customcheck" ).val( 'Yes' );
				}
				else {

					jQuery( this ).parent().find( ".customcheck" ).val( 'No' );
				}
			}
		});
	}
};

// Common fixes -----------------------------------------------

//Crockford's approach to add inheritance. It works for all browsers. Object.create() is still not supported by all browsers.
Function.prototype.inherits = function( parent ) {

	var d	= 0;
	var p 	= ( this.prototype = new parent() );

	this.prototype.uber	= function( name ) {

		var f;
		var r;
		var t = d;
		var v = parent.prototype;

		if( t ) {

			while( t ) {

	              v		= v.constructor.prototype;
	              t 	-= 1;
			}
	
			f = v[ name ];
		}
		else {

			f	= p[ name ];
	
			if( f == this[ name ] ) {

				f = v[ name ];
			}
		}

		d		+= 1;
		r		 = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
		d		-= 1;

		return r;
	};
};

// Fix hash tag issues for SNS login
if( window.location.hash == '#_=_' ) {

    if( history.replaceState ) {

        var cleanHref = window.location.href.split( '#' )[ 0 ];

        history.replaceState( null, null, cleanHref );
    }
    else {

        window.location.hash = '';
    }
};/*
 * Dependencies: jquery, core/main.js, core/utils.js
 */

// TODO: Add Data Binding Support to bind data sent by server to respective ui component
// TODO: Add Data Binding with Pagination for Data Grid
// TODO: Add Page History and Caching Support

/**
 * CMGTools API library provide methods to process AJAX request. These requests can be either form or regular
 */
cmt.api = {};;/*
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
};;/*
 * Dependencies: jquery, core/main.js, core/utils.js, mvc/core.js, mvc/controllers.js
 */

/**
 * An application is a collection of config and controllers.
 */
cmt.api.Application = function() {

	/**
	 * Config Object
	 */
	this.config = {
		json: false, 				// Identify whether all the request must be processed using json format
		errorClass: 'error',		// Default error css class
		messageClass: 'message',	// Default message css class
		spinnerClass: 'spinner'		// Default spinner css class
	};

	// Default controller to be used as fallback in case no controller is mentioned
	var defaultController	= cmt.api.Application.CONTROLLER_DEFAULT;

	/**
	 * An exhaustive list of all the controllers available for the application. Each application can use this listing to maintain it's controllers list.
	 */
	this.controllers 						= [];
	this.controllers[ defaultController ] 	= "cmt.api.controllers.DefaultController";

	/**
	 * List of all the active controllers which are already initialised. It will save us from re-initialising each controller to process a request.
	 */
	this.activeControllers 	= [];
};

/**
 * JQuery Plugin to initialise application.
 */
( function( cmtjq ) {

	cmtjq.fn.processAjax = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 	= cmtjq.extend( {}, cmtjq.fn.processAjax.defaults, options );
		var app			= new cmt.api.Application();

		// Initialise application
		app.config.json	= settings.json;
		app.controllers	= cmtjq.extend( [], app.controllers, settings.controllers );

		app.init( this );

		// return control
		return;
	};

	// Default Settings
	cmtjq.fn.processAjax.defaults = {
		json: false,
		controllers: []
	};

}( jQuery ) );

/**
 * App Globals
 */

//Defaults
cmt.api.Application.CONTROLLER_DEFAULT	= 'default';			// Default Controller
cmt.api.Application.ACTION_DEFAULT		=  'default';			// Default Controller Actions

// Statics
cmt.api.Application.STATIC_CONTROLLER	=  'cmt-controller';	// Controller attribute set for form or request
cmt.api.Application.STATIC_ACTION		=  'cmt-action';		// Action attribute set for form or request
cmt.api.Application.STATIC_ID			=  'id';				// Id to uniquely identify form and request.
cmt.api.Application.STATIC_SUBMIT		=  '.cmt-submit';		// The class to be set for element which submit request on click
cmt.api.Application.STATIC_SELECT		=  '.cmt-select';		// The class to be set for select box which submit request on change
cmt.api.Application.STATIC_CLEAR		=  'cmt-clear';			// The clear attribute specify whether form/request need to be cleared on success.
cmt.api.Application.STATIC_ERROR		=  'cmt-error';			// The error element to display model property validation failure

/**
 * Initialise application
 * @param requestTriggers - All the triggers passed by JQuery selector using application plugin.
 */
cmt.api.Application.prototype.init = function( requestTriggers ) {

	var app	= this;

	// Iterate and initialise all the triggers
	requestTriggers.each( function() {

		var requestTrigger = jQuery( this );

		// Form Submits
		if( requestTrigger.is( "form" ) ) {

			requestTrigger.submit( function( event ) {

				event.preventDefault();
	
				app.initRequestTrigger( requestTrigger.attr( cmt.api.Application.STATIC_ID ), true, requestTrigger.attr( cmt.api.Application.STATIC_CONTROLLER ), requestTrigger.attr( cmt.api.Application.STATIC_ACTION ) );
			});
		}

		// Button Submits
		requestTrigger.find( cmt.api.Application.STATIC_SUBMIT ).click( function( event ) {

			event.preventDefault();

			app.initRequestTrigger( requestTrigger.attr( cmt.api.Application.STATIC_ID ), false, requestTrigger.attr( cmt.api.Application.STATIC_CONTROLLER ), requestTrigger.attr( cmt.api.Application.STATIC_ACTION ) );
		});

		// Select Submits
		requestTrigger.find( cmt.api.Application.STATIC_SELECT ).change( function() {

			app.initRequestTrigger( requestTrigger.attr( cmt.api.Application.STATIC_ID ), false, requestTrigger.attr( cmt.api.Application.STATIC_CONTROLLER ), requestTrigger.attr( cmt.api.Application.STATIC_ACTION ) );
		});
	});
};

cmt.api.Application.prototype.findController = function( controller ) {

	// Return active controller
	if( this.activeControllers[ controller ] ) {
		
		return this.activeControllers[ controller ];
	}
	// Create a controller instance from registered controllers
	else {

		try {

			// Check whether controller is registered and throw exception
			if( this.controllers[ controller ] == undefined ) throw "Controller with name " + controller + " is not registered with this application.";

			var cont 	= cmt.utils.object.strToObject( this.controllers[ controller ] );

			// Initialise
			cont.init();

			// Add to active registry
			this.activeControllers[ controller ] = cont;

			return this.activeControllers[ controller ];
		}
		catch( err ) {

			console.log( err );

			console.log( "Falling back to default controller." );

			if( this.controllers[ cmt.api.Application.CONTROLLER_DEFAULT ] !== undefined ) {

				return this.findController( cmt.api.Application.CONTROLLER_DEFAULT );
			}
		}
	}
};

// Init triggers required to process request -------------

cmt.api.Application.prototype.initRequestTrigger = function( requestId, form, controller, action ) {

	// Use default controller
	if( null == controller ) {

		controller = cmt.api.Application.CONTROLLER_DEFAULT;
	}

	// Use default action
	if( null == action ) {

		action = cmt.api.Application.ACTION_DEFAULT;
	}

	// Search Controller
	var controllerObj	= this.findController( controller );

	if( form ) {

		if( this.config.json ) {

			this.handleRestForm( requestId, controllerObj, action );
		}
		else {

			this.handleAjaxForm( requestId, controllerObj, action );
		}
	}
	else {

		this.handleAjaxRequest( requestId, controllerObj, action );
	}
};

cmt.api.Application.prototype.handleRestForm = function( formId, controller, action ) {
		
		var app			= this;
		var form		= jQuery( "#" + formId );
		var httpMethod	= form.attr( "method" );
		var actionUrl	= form.attr( "action" );
		var message		= jQuery( "#" + formId + " ." + this.config.messageClass );
		var preAction	= action + "ActionPre";

		// Hide message element
		message.hide();

		// Hide all errors
		jQuery( "#" + formId + " ." + this.config.errorClass ).hide();

		// Pre Process Form
		if( typeof controller[ preAction ] !== 'undefined' && !( controller[ preAction ]( form ) ) ) {

			return false;
		}

		// Generate form data for submission
		var formData	= cmt.utils.data.formToJson( formId );

		// Show Spinner
		jQuery( "#" + formId + " ." + this.config.spinnerClass ).show();

		jQuery.ajax({
			type: httpMethod,
			url: actionUrl,
			data: JSON.stringify( formData ),
			dataType: "JSON",
			contentType: "application/json;charset=UTF-8",
			success: function( response, textStatus, XMLHttpRequest ) {

				// Process response
				app.processAjaxResponse( formId, controller, action, message, response );
			}
		});

		return false;
};

cmt.api.Application.prototype.handleAjaxForm = function( formId, controller, action ) {
		
		var app			= this;
		var form		= jQuery( "#" + formId );
		var httpMethod	= form.attr( "method" );
		var actionUrl	= form.attr( "action" );
		var message		= jQuery( "#" + formId + " ." + this.config.messageClass );
		var preAction	= action + "ActionPre";

		// Hide message
		message.hide();

		// Hide all errors
		jQuery( "#" + formId + " ." + this.config.errorClass ).hide();

		// Pre Process Form
		if( typeof controller[ preAction ] !== 'undefined' && !( controller[ preAction ]( form ) ) ) {

			return false;
		}

		// Generate form data for submission
		var formData	= cmt.utils.data.serialiseForm( formId );

		// Show Spinner
		jQuery( "#" + formId + " ." + this.config.spinnerClass ).show();

		jQuery.ajax( {
			type: httpMethod,
			url: actionUrl,
			data: formData,
			dataType: "JSON",
			success: function( response, textStatus, XMLHttpRequest ) {

				// Process response
				app.processAjaxResponse( formId, controller, action, message, response );
			}
		});

		return false;
};

cmt.api.Application.prototype.handleAjaxRequest = function( elementId, controller, action ) {

		var app			= this;
		var element		= jQuery( "#" + elementId );
		var httpMethod	= element.attr( "method" );
		var actionUrl	= element.attr( "action" );
		var message		= jQuery( "#" + elementId + " ." + this.config.messageClass );
		var preAction	= action + "ActionPre";

		if( null == httpMethod ) {

			httpMethod = 'post';
		}

		// Hide message
		message.hide();

		// Hide all errors
		jQuery( "#" + elementId + " ." + this.errorClass ).hide();

		// Pre Process Request
		if( typeof controller[ preAction ] !== 'undefined' && !( controller[ preAction ]( element ) ) ) {

			return false;
		}

		// Generate request data for submission
		var requestData	= cmt.utils.data.serialiseElement( elementId );

		// Show Spinner
		jQuery( "#" + elementId + " ." + this.spinnerClass ).show();

		jQuery.ajax({
			type: httpMethod,
			url: actionUrl,
			data: requestData,
			dataType: "JSON",
			success: function( response, textStatus, XMLHttpRequest ) {

				// Process response
				app.processAjaxResponse( elementId, controller, action, message, response );
			}
		});

		return false;
};

cmt.api.Application.prototype.processAjaxResponse = function( requestId, controller, action, message, response ) {

	var result 		= response[ 'result' ];
	var messageStr 	= response[ 'message' ];
	var data		= response[ 'data' ];
	var errors		= response[ 'errors' ];
	var postAction	= action + "ActionPost";

	if( result == 1 ) {

		// Show message
		message.html( messageStr );
		message.show();

		// Hide all errors
		jQuery( "#" + requestId + " ." + this.config.errorClass ).hide();

		// Hide Spinner
		jQuery( "#" + requestId + " ." + this.config.spinnerClass ).hide();

		// Check to clear form data
		var clearData = jQuery( "#" + requestId ).attr( cmt.api.Application.STATIC_CLEAR );

		if( null == clearData ) {

			clearData	= true;
		}
		else {

			clearData	= clearData === 'true';
		}

		if( clearData ) {

			// Clear all form fields
			jQuery( "#" + requestId + " input[type='text']" ).val( '' );
			jQuery( "#" + requestId + " input[type='password']" ).val( '' );
			jQuery( "#" + requestId + " textarea" ).val( '' );
		}

		// Pass the data for post processing
		if( typeof controller[ postAction ] !== 'undefined' ) {

			controller[ postAction ]( true, requestId, message, response );
		}
	}
	else if( result == 0 ) {

		// Show message
		message.html( messageStr );
		message.show();

		// Hide Spinner
		jQuery( "#" + requestId + " ." + this.config.spinnerClass ).hide();

		// Show Errors
		for( var key in errors ) {

        	var fieldName 		= key;
        	var errorMessage 	= errors[ key ];
        	var errorField		= jQuery( "#" + requestId + " span[" + cmt.api.Application.STATIC_ERROR + "='" + fieldName + "']" );

        	errorField.html( errorMessage );
        	errorField.show();
    	}

		// Pass the data for post processing
		if( typeof controller[ postAction ] !== 'undefined' ) {

			controller[ postAction ]( false, requestId, message, response );
		}
	}
};;/*
 * Dependencies: jquery
 */

( function( cmtjq ) {

	cmtjq.fn.cmtBlock = function( options ) {

		// == Init == //

		// Configure Blocks
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtBlock.defaults, options );
		var blocks			= this;
		var screenHeight	= cmtjq( window ).height();
		var screenWidth		= cmtjq( window ).width();
		var blocksConfig	= settings.blocks;
		var blocksKeys		= Object.keys( blocksConfig );

		// Iterate and initialise all the page blocks
		blocks.each( function() {

			var block	= cmtjq( this );

			init( block );
		});

		// Initialise parallax
		if( settings.backgroundParallax ) {

			cmtjq( window ).scroll( scrollBackground );
		}

		// return control
		return;

		// == Private Functions == //

		// Initialise Block
		function init( block ) {

			// -- Apply Block Specific Settings
			if( cmtjq.inArray( block.attr( "id" ), blocksKeys ) >= 0 ) {

				var blockConfig				= blocksConfig[ block.attr( "id" ) ];
				var height					= blockConfig[ "height" ];
				var fullHeight				= blockConfig[ "fullHeight" ];
				var halfHeight				= blockConfig[ "halfHeight" ];
				var heightAuto				= blockConfig[ "heightAuto" ];
				var heightAutoMobile		= blockConfig[ "heightAutoMobile" ];
				var heightAutoMobileWidth	= blockConfig[ "heightAutoMobileWidth" ];
				var css 					= blockConfig[ "css" ];

				// Check whether pre-defined height is required
				if( null != height && height ) {

					block.css( { 'height': height + "px" } );
				}

				// Apply auto height
				if( null != heightAuto && heightAuto ) {

					if( null != height && height ) {

						block.css( { 'height': 'auto', 'min-height': height + "px" } );
					}
					else if( null != fullHeight && fullHeight ) {

						block.css( { 'height': 'auto', 'min-height': screenHeight + "px" } );
					}
					else if( null != halfHeight && halfHeight ) {

						block.css( { 'height': 'auto', 'min-height': ( screenHeight / 2 ) + "px" } );
					}
					else {
						
						block.css( { 'height': 'auto' } );
					}
				}

				// Apply Full Height
				if( null == height && null == heightAuto && ( null != fullHeight && fullHeight ) ) {

					block.css( { 'height': screenHeight + "px" } );
				}

				// Apply Half Height
				if( null == height && null == heightAuto && ( null != halfHeight && halfHeight ) ) {

					block.css( { 'height': ( screenHeight / 2 ) + "px" } );
				}

				// Check whether min height and height auto is required for mobile to handle overlapped content
				if( null != heightAutoMobile && heightAutoMobile ) {

					if( window.innerWidth <= heightAutoMobileWidth ) {

						block.css( { 'height': 'auto', 'min-height': screenHeight + "px" } );

						var contentWrap = block.children( ".block-wrap-content" );

						if( contentWrap.hasClass( "valign-center" ) ) {

							contentWrap.removeClass( "valign-center" );
						}
					}
				}

				// adjust content wrap and block height in case content height exceeds
				var contentWrap	= block.find( ".block-wrap-content" );
				var content		= block.find( ".block-content" );

				if( content !== undefined && ( content.height() > contentWrap.height() ) ) {

					var newHeight 	= ( content.height() + 100 ) + 'px';
					var diff		= content.height() - contentWrap.height();

					contentWrap.height( newHeight );

					newHeight = ( block.height() + diff + 100 ) + 'px';

					block.height( newHeight );
				}

				// Check whether additional css is required
				if( null != css && css ) {

					block.css( css );
				}
			}
			// -- Apply Common Settings for all the Blocks
			else {

				// Apply Full Height
				if( settings.fullHeight ) {

					if( settings.heightAuto ) {

						block.css( { 'height': 'auto', 'min-height': screenHeight + "px" } );
					}
					else {

						block.css( { 'height': screenHeight + "px" } );
					}
				}

				// Apply Half Height
				if( settings.halfHeight ) {

					if( settings.heightAuto ) {

						block.css( { 'height': 'auto', 'min-height': ( screenHeight / 2 ) + "px" } );
					}
					else {

						block.css( { 'height': ( screenHeight / 2 ) + "px" } );
					}
				}
			}
		}

		// Initialise parallax
		function scrollBackground() {

			var winHeight 	= cmtjq( window ).height();
		    var winTop 		= cmtjq( window ).scrollTop();
		    var winBottom 	= winTop + winHeight;
		    var winCurrent 	= winTop + winHeight / 2;
		    
		    blocks.each( function( i ) {

		        var block 			= cmtjq( this );
		        var blockHeight 	= block.height();
		        var blockTop 		= block.offset().top;
		        var blockBottom 	= blockTop + blockHeight;
		        var background		= block.children( ".block-bkg-parallax" );

		        if( null != background && background.length > 0 && winBottom > blockTop && winTop < blockBottom ) {

					var bkgWidth 		= background.width();
	            	var bkgHeight 		= background.height();
		            var min 			= 0;
		            var max 			= bkgHeight - winHeight;
		            var heightOverflow 	= blockHeight < winHeight ? bkgHeight - blockHeight : bkgHeight - winHeight;
		            blockTop 			= blockTop - heightOverflow;
		            blockBottom 		= blockBottom + heightOverflow;
		            var value 			= min + (max - min) * ( winCurrent - blockTop ) / ( blockBottom - blockTop );

		            background.css( "background-position", "50% " + value + "px" );
		        }
		    });
		}
	};

	// Default Settings
	cmtjq.fn.cmtBlock.defaults = {
		// Controls
		fullHeight: true,
		halfHeight: false,
		heightAuto: false,
		backgroundParallax: true,
		blocks: {
			/* An array of blocks which need extra configuration. Ex:
			<Block Selector ID>: {
				height: 250,
				fullHeight: false,
				heightAuto: false,
				heightAutoMobile: false,
				heightAutoMobileWidth: 1024,
				css: { color: 'white' }
			}
			*/
		}
	};

}( jQuery ) );;;/*
 * Dependencies: jquery, cmt-utils
 */

// TODO: Validate for max file size if possible

// File Uploader Plugin
( function( cmtjq ) {

	cmtjq.fn.cmtFileUploader = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtFileUploader.defaults, options );
		var fileUploaders	= this;

		// Iterate and initialise all the uploaders
		fileUploaders.each( function() {

			var fileUploader = cmtjq( this );

			init( fileUploader );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Uploader
		function init( fileUploader ) {

			// Show/Hide file chooser - either of the option must exist to choose file
			var btnShowChooser	= fileUploader.find( ".btn-show-chooser, .btn-direct-chooser" );

			if( btnShowChooser.length > 0 ) {

				btnShowChooser.click( function() {

					// Show Chooser
					fileUploader.find( ".wrap-chooser" ).toggle( "slow" );

					// Hide Postaction
					fileUploader.find( ".post-action" ).hide();

					// Clear Old Values
					if( cmt.utils.browser.isCanvas() && fileUploader.attr( "type" ) == "image" ) {

						fileUploader.find( ".preview canvas" ).hide();
					}

					fileUploader.find( ".chooser .input, .direct-chooser .input" ).val("");

					var progressContainer	= fileUploader.find( ".preloader .preloader-bar" );
	
					// Modern Uploader
					if ( cmt.utils.browser.isFileApi() ) {
	
						progressContainer.css( "width", "0%" );
					}
					// Form Data Uploader
					else if( cmt.utils.browser.isFormData() ) {
	
						progressContainer.html( "" );
					}
				});
			}

			// Modern Uploader
			if ( cmt.utils.browser.isFileApi() ) {

				// Traditional way using input
				var inputField = fileUploader.find( ".chooser .input, .direct-chooser .input" );

				inputField.change( function( event ) {

					handleFile( event, fileUploader );
				});

				// Modern way using Drag n Drop
				var dragElement = fileUploader.find( ".preview .wrap-drag" );

				dragElement.bind( 'dragover', function( event ) { 

					handleDragging( event );
				});
		
				dragElement.bind( 'dragleave', function( event ) { 
		
					handleDragging( event );
				});
		
				dragElement.bind( 'drop', function( event ) {

					handleFile( event, fileUploader );
				});
			}
			// Form Data Uploader
			else if( cmt.utils.browser.isFormData() ) {

				var directory	= fileUploader.attr( "directory" );
				var type		= fileUploader.attr( "type" );
				var inputField 	= fileUploader.find( ".chooser .input, .direct-chooser .input" );

				inputField.change( function( event ) {

					uploadTraditionalFile( fileUploader, directory, type ); 
				} );
			}
		}

		function handleDragging( event ) {

			event.stopPropagation();
			event.preventDefault();

			// TODO: add class hover to drag
			// event.target.className = ( event.type == "dragover" ? "hover" : "" );
		}

		function handleFile( event, fileUploader ) {

			var directory	= fileUploader.attr( "directory" );
			var type		= fileUploader.attr( "type" );

			// cancel event and add hover styling
			handleDragging( event );

			// FileList
			var files = event.target.files || event.originalEvent.dataTransfer.files;

			// Draw if image
			if( settings.preview && cmt.utils.browser.isCanvas() && type == "image" ) {

				var canvas		= fileUploader.find( ".preview canvas" );

				canvas.show();

				cmt.utils.image.drawAtCanvasCenter( canvas[0], files[0] );
			}

			// Upload File
			uploadFile( fileUploader, directory, type, files[0] );
		}

		function uploadFile( fileUploader, directory, type, file ) {

			var xhr 				= new XMLHttpRequest();
			var fileType			= file.type.toLowerCase();
			var isValidFile			= jQuery.inArray( fileType, settings.fileFormats );
			var progressContainer	= fileUploader.find( ".preloader .preloader-bar" );
			var formData 			= new FormData();

			// append form data
			formData.append( 'file', file );

			// reset progress bar
			progressContainer.css( "width", "0%" );

			// upload file
			if( xhr.upload && isValidFile ) {

				// Upload progress
				xhr.upload.onprogress = function( e ) {

					if( e.lengthComputable ) {

						var progress = Math.round( ( e.loaded * 100 ) / e.total );

						progressContainer.css( "width", progress + "%" );
					}
				};

				// file received/failed
				xhr.onreadystatechange = function( e ) {

					if ( xhr.readyState == 4 ) {

						if( xhr.status == 200 ) {

							var jsonResponse = JSON.parse( xhr.responseText );

							if( jsonResponse['result'] == 1 ) {

								if( settings.uploadListener ) {

									settings.uploadListener( fileUploader.attr( "id" ), directory, type, jsonResponse['data'] );
								}
								else {

									fileUploaded( fileUploader, directory, type, jsonResponse['data'] );
								}
							}
							else {
	
								alert( "File upload failed." );
							}
						}
					}
				};

				var urlParams	= fileUploadUrl + "?directory=" + encodeURIComponent( directory ) + "&type=" + encodeURIComponent( type );

				// start upload
				xhr.open("POST", urlParams, true );
				xhr.send( formData );
			}
			else {

				alert( "File format not allowed." );
			}
		}

		// TODO; Test it well
		function uploadTraditionalFile( fileUploader, directory, type ) {

			var progressContainer	= fileUploader.find( ".preloader .preloader-bar" );
			var fileList			= fileUploader.find( ".chooser .input, .direct-chooser .input" );
			var file 				= fileList.files[0];
			var formData 			= new FormData();
			fileName 				= file.name;

			// Show progress
			progressContainer.html( "Uploading file" );

			formData.append( 'file', file );

			var urlParams	= fileUploadUrl + "?directory=" + encodeURIComponent( directory ) + "&type=" + encodeURIComponent( type );

			jQuery.ajax({
			  type:			"POST",
			  url: 			urlParams,
			  data: 		formData,
		      cache: 		false,
		      contentType: 	false,
		      processData: 	false,
			  dataType:		'json',
			}).done( function( response ) {

				progress.html( "File uploaded" );

				if( response['result'] == 1 ) {

					if( settings.uploadListener ) {

						settings.uploadListener( fileUploader.attr( "id" ), directory, type, response['data'] );
					}
					else {

						fileUploaded( fileUploader, directory, type, response['data'] );
					}
				}
				else {

					alert( "File upload failed." );
				}
			});
		}

		// default post processor for uploaded files.
		function fileUploaded( fileUploader, directory, type, result ) {

			var fileName	= result[ 'name' ] + "." + result[ 'extension' ];

			if( type == "image" ) {

				fileUploader.find( ".postview .wrap-image" ).html( "<img src='" + result['tempUrl'] + "' class='fluid' />" );

				var fileFields	= fileUploader.find( ".fields" );

				fileFields.children( ".name" ).val( result[ 'name' ] );
				fileFields.children( ".extension" ).val( result[ 'extension' ] );
				fileFields.children( ".change" ).val( 1 );
			}

			// Show Hide
			fileUploader.find( ".wrap-chooser" ).hide();
			fileUploader.find( ".post-action" ).show();
		}
	};

	// Default Settings
	cmtjq.fn.cmtFileUploader.defaults = {
		fileFormats: [ "jpg", "jpeg", "png", "gif", "pdf", "csv" ],
		uploadListener: null,
		preview: true
	};

}( jQuery ) );;( function( cmtjq ) {

	cmtjq.fn.cmtFormInfo = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtFormInfo.defaults, options );
		var forms			= this;

		// Iterate and initialise all the menus
		forms.each( function() {

			var form = cmtjq( this );

			init( form );
		});

		// return control
		return;

		// == Private Functions == //

		function init( form ) {

			form.find( ".btn-edit" ).click( function() {

				var info = jQuery( this ).parent().find( ".wrap-info" );
				var form = jQuery( this ).parent().find( ".wrap-form" );

				if( info.is( ":visible" ) ) {

					info.hide();
					form.fadeIn( "slow" );
				}
				else {

					info.show();
					form.fadeOut( "slow" );			
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtFormInfo.defaults = {
		// default config
	};

}( jQuery ) );;/*
 * Dependencies: jquery
 */

( function( cmtjq ) {

	cmtjq.fn.cmtHeader = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtHeader.defaults, options );
		var screenWidth		= window.innerWidth;
		var headers			= this;

		// Iterate and initialise all the page modules
		headers.each( function() {

			var header	= cmtjq( this );

			init( header );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Header
		function init( header ) {

			if( screenWidth > settings.minWidth ) {

			    window.addEventListener( 'scroll', function( e ) {

			        var distanceY		= window.pageYOffset || document.documentElement.scrollTop;
			        var scrollDistance 	= settings.scrollDistance;
	
			        if ( distanceY > scrollDistance ) {
	
			            header.addClass( "header-small" );
			            
			            if( header.hasClass( "hidden" ) ) {
			            	
			            	header.slideDown( 'slow' ); 
			            }
			        }
			        else {

			            if ( header.hasClass( "header-small" ) ) {
			
			                header.removeClass( "header-small" );
			            }

			            if( header.hasClass( "hidden" ) ) {
			            	
			            	header.slideUp( 'false' ); 
			            }
			        }
			    });
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtHeader.defaults = {
		minWidth: 1024,
		scrollDistance: 300
	};

}( jQuery ) );;( function( cmtjq ) {

	cmtjq.fn.cmtSlidingMenu = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtSlidingMenu.defaults, options );
		var menus			= this;

		// Iterate and initialise all the menus
		menus.each( function() {

			var menu = cmtjq( this );

			init( menu );
		});

		// return control
		return;

		// == Private Functions == //

		function init( menu ) {
			
			if( settings.mainMenu ) {

				var documentHeight 	= cmtjq( document ).height();
				var screenWidth		= cmtjq( window ).width();

				// Parent to cover document
				menu.css( { 'top': '0px', 'left': '0px', 'height': documentHeight, 'width': screenWidth } );
			}
			
			if( null != settings.showTrigger ) {

				cmtjq( settings.showTrigger ).click( function() {
	
					menu.fadeIn();
	
					var slider	= menu.find( '.vnav-slider' );
	
					if( settings.position == 'left' ) {
						
						slider.animate( { left: 0 } );
					}
					else if( settings.position == 'right' ) {
	
						slider.animate( { right: 0 } );
					}
				});
			}

			if( null != settings.hideTrigger ) {

				cmtjq( settings.hideTrigger ).click( function() {
	
					menu.fadeOut();
					
					var slider	= menu.find( '.vnav-slider' );
	
					if( settings.position == 'left' ) {
	
						slider.animate( { left: -( slider.width() ) } );
					}
					else if( settings.position == 'right' ) {
						
						slider.animate( { right: -( slider.width() ) } );
					}
				});
			}

			menu.find( '.btn-close' ).click( function() {
				
				menu.fadeOut();
				
				var slider	= menu.find( '.vnav-slider' );

				if( settings.position == 'left' ) {

					slider.animate( { left: -( slider.width() ) } );
				}
				else if( settings.position == 'right' ) {
					
					slider.animate( { right: -( slider.width() ) } );
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtSlidingMenu.defaults = {
		position: 'left',
		showTrigger: null,
		hideTrigger: null,
		mainMenu: false
	};

}( jQuery ) );;/*
 * Dependencies: jquery
 */
( function( cmtjq ) {

	cmtjq.fn.cmtPopup = function( options ) {

		// == Init == //

		// Configure Popups
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtPopup.defaults, options );
		var elements		= this;
		var documentHeight 	= cmtjq( document ).height();
		var screenHeight	= cmtjq( window ).height();
		var screenWidth		= cmtjq( window ).width();

		// Iterate and initialise all the popups
		elements.each( function() {

			var element	= cmtjq( this );

			init( element );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Element
		function init( popup ) {

			var popupData = popup.children( ".popup-data" );

			// Close Listener
			popupData.children( ".popup-close" ).click( function() {

				popup.fadeOut( "slow" );
			});

			// Modal Window
			if( settings.modal ) {

				// Parent to cover document
				popup.css( { 'top': '0px', 'left': '0px', 'height': documentHeight, 'width': screenWidth } );
	
				// background to cover window
				popup.children( ".popup-background" ).css( { 'top': '0px', 'left': '0px', 'height': screenHeight, 'width': screenWidth } );
	
				// Child at center of parent
				popup.show(); // Need some better solution if it shows flicker effect

				var popupDataHeight	=  popupData.height();
				var popupDataWidth	=  popupData.width();

				popup.hide();

				popupData.css( { 'top': screenHeight/2 - popupDataHeight/2, 'left': screenWidth/2 - popupDataWidth/2 } );
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtPopup.defaults = {
		modal: true
	};

}( jQuery ) );


function showPopup( popupSelector ) {

	jQuery( popupSelector ).fadeIn( "slow" );
}

function closePopup( popupSelector ) {

	jQuery( popupSelector ).fadeOut( "slow" );
}

/* Show default error popup */
function showErrorPopup( errors ) {

	jQuery( "#error-popup .popup-content" ).html( errors );

	showPopup( "#error-popup" );
}

function hideErrorPopup() {

	closePopup( "#error-popup" );
}

/* Show default message popup */
function showMessagePopup( message ) {

	jQuery( "#message-popup .popup-content" ).html( message );

	showPopup( "#message-popup" );
}

function hideMessagePopup() {

	closePopup( "#message-popup" );
};( function( cmtjq ) {

// TODO: Add option for multi select

	cmtjq.fn.cmtSelect = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtSelect.defaults, options );
		var dropDowns		= this;

		// Iterate and initialise all the fox sliders
		dropDowns.each( function() {

			var dropDown = cmtjq( this );

			init( dropDown );
		});

		// return control
		return;

		// == Private Functions == //

		function init( dropDown ) {

			// Find Selected Option
			var selected	= dropDown.children( "option:selected" );

			// Wrap Select
			dropDown.wrap( "<div></div>" );
			
			var wrapper		= dropDown.parent();

			if( settings.copyId ) {

				// Find select Id
				var selectId	= dropDown.attr( "id" );
	
				// Transfer Id to wrapper
				if( null != selectId && selectId.length > 0 ) {
	
					// Remove dropdown Id
					dropDown.attr( "id", null );
					wrapper.attr( "id", selectId );
				}
			}

			// Assign class to wrapper
			wrapper.addClass( "cmt-select-wrap" );

			if( null != settings.wrapperClass ) {

				wrapper.addClass( settings.wrapperClass );
			}
			
			// Generate Icon Html
			var iconHtml	= "<span class='s-icon'>";
			
			if( null != settings.iconClass ) {
				
				iconHtml	= "<span class='s-icon " + settings.iconClass + "'>";
			}
			
			if( null != settings.iconHtml ) {

				iconHtml	+= settings.iconHtml + "</span>";
			}
			else {

				iconHtml	+= "</span>";
			}

			// Generate Custom Select Html
			var customHtml	= "<div class='cmt-select'><div class='cmt-selected'><span class='s-text'>" + selected.html() + "</span>" + iconHtml + "</div><ul class='cmt-select-list'>";

			// Iterate select options
		    dropDown.find( 'option' ).each( function( index ) {

				customHtml += "<li data-value='" + jQuery( this ).val() + "'>" + jQuery( this ).html() + "</li>";
		    });

			customHtml += "</ul></div>";

			// Append Custom Seelct to wrapper
			wrapper.append( customHtml );

			var customSelect	= wrapper.children( ".cmt-select" );
			var customSelected	= wrapper.children( ".cmt-select" ).children( ".cmt-selected" );
			var customList		= wrapper.children( ".cmt-select" ).children( ".cmt-select-list" );
			
			// Hide List by default
			customList.hide();
			
			// Detect whether disabled
			var disabled = dropDown.attr( "disabled" );
			
			if( disabled == "disabled" || disabled ) {
				
				customSelected.addClass( "disabled" );
			}
			else {

				// Add listener to selected val
				customSelected.click( function( e ) {
					
					var visible = customList.is( ':visible' );

					cmtjq( ".cmt-select-list" ).hide();

					if( !visible ) {

						customList.show();
					}
					
					e.stopPropagation();
				});
	
				// Update selected value
				customList.children( "li" ).click( function() {
	
					var selected	= jQuery( this );
					var parent		= selected.parents().eq(1);
					
					parent.children( ".cmt-selected" ).children( ".s-text" ).html( selected.html() );
					parent.parent().children( "select" ).val( selected.attr( "data-value" ) ).change();

					customList.hide();
				});
				
				cmtjq( document ).on( 'click', function( e ) {

			        if ( cmtjq( e.target ).closest( customList ).length === 0 ) {
	
			            customList.hide();
			        }
				});
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtSelect.defaults = {
		multi: false,
		copyId: false,
		wrapperClass: null,
		iconClass: null,
		iconHtml: null
	};

}( jQuery ) );;/*
 * Dependencies: jquery
 */

( function( cmtjq ) {

	cmtjq.fn.cmtSmoothScroll = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtSmoothScroll.defaults, options );
		var elements		= this;

		// Iterate and initialise all the page modules
		elements.each( function() {

			var element	= cmtjq( this );

			init( element );
		});

		// return control
		return;

		// == Private Functions == //

		// Initialise Element
		function init( element ) {

			element.on( 'click', function ( e ) {

			    e.preventDefault();

			    var targetId 	= this.hash;
			    var target 		= cmtjq( targetId );
		
			    jQuery('html, body').stop().animate(
			    	{ 'scrollTop': ( target.offset().top ) }, 
			    	900, 
			    	'swing', 
			    	function () {
		
				        window.location.hash = targetId;				        
			    	}
			    );
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtSmoothScroll.defaults = {

	};

}( jQuery ) );