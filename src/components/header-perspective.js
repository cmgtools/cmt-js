/**
 * Perspective Header plugin can be used to change header styling by adding header-small class on scolling a pre-defined amount.
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

}( jQuery ) );