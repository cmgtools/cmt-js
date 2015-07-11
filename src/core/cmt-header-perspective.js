/*
 * Dependencies: jquery
 */

( function( cmt ) {

	cmt.fn.cmtHeader = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmt.extend( {}, cmt.fn.cmtHeader.defaults, options );
		var screenWidth		= window.innerWidth;
		var headers			= this;

		// Iterate and initialise all the page modules
		headers.each( function() {

			var header	= cmt( this );

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
			        }
			        else {
	
			            if ( header.hasClass( "header-small" ) ) {
			
			                header.removeClass( "header-small" );
			            }
			        }
			    });
			}
		}
	};

	// Default Settings
	cmt.fn.cmtHeader.defaults = {
		minWidth: 1024,
		scrollDistance: 300
	};

}( jQuery ) );