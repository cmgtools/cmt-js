/*
 * Dependencies: jquery
 */

( function( cmt ) {

	cmt.fn.cmtPageModule = function( options ) {

		// == Init == //

		// Configure Modules
		var settings 		= cmt.extend( {}, cmt.fn.cmtPageModule.defaults, options );
		var modules			= this;
		var screenHeight	= cmt( window ).height();
		var screenWidth		= cmt( window ).width();
		var modulesConfig	= settings.modules;
		var modulesKeys		= Object.keys( modulesConfig );

		// Iterate and initialise all the page modules
		modules.each( function() {

			var module	= cmt( this );

			init( module );
		});

		// Initialise parallax
		if( settings.backgroundParallax ) {

			cmt( window ).scroll( scrollBackground );
		}

		// return control
		return;

		// == Private Functions == //

		// Initialise Module
		function init( module ) {

			// -- Apply Common Settings for all the Modules

			// -- Apply Module Specific Settings

			// Module specific config
			if( cmt.inArray( module.attr( "id" ), modulesKeys ) >= 0 ) {

				var moduleConfig			= modulesConfig[ module.attr( "id" ) ];
				var height					= moduleConfig[ "height" ];
				var fullHeight				= moduleConfig[ "fullHeight" ];
				var heightAuto				= moduleConfig[ "heightAuto" ];
				var heightAutoMobile		= moduleConfig[ "heightAutoMobile" ];
				var heightAutoMobileWidth	= moduleConfig[ "heightAutoMobileWidth" ];
				var css 					= moduleConfig[ "css" ];

				// Check whether pre-defined height is required
				if( null != height && height ) {

					module.css( { 'height': height + "px" } );
				}

				// Apply auto height
				if( null != heightAuto && heightAuto ) {

					if( null != height && height ) {

						module.css( { 'height': 'auto', 'min-height': height + "px" } );
					}
					else if( null != fullHeight && fullHeight ) {

						module.css( { 'height': 'auto', 'min-height': screenHeight + "px" } );
					}
				}

				// Apply Full Height
				if( null == height && null == heightAuto && ( null != fullHeight && fullHeight ) ) {

					module.css( { 'height': screenHeight + "px" } );
				}

				// Check whether min height and height auto is required for mobile to handle overlapped content
				if( null != heightAutoMobile && heightAutoMobile ) {

					if( window.innerWidth <= heightAutoMobileWidth ) {

						module.css( { 'height': 'auto', 'min-height': screenHeight + "px" } );

						var contentWrap = module.children( ".module-wrap-content" );

						if( contentWrap.hasClass( "valign-center" ) ) {

							contentWrap.removeClass( "valign-center" );
						}
					}
				}

				// Check whether additional css is required
				if( null != css && css ) {

					module.css( css );
				}
			}
			// Config in absence of module specific config
			else {

				// Apply Full Height
				if( settings.fullHeight ) {
	
					module.css( { 'height': screenHeight + "px" } );
				}
			}
		}

		// Initialise parallax
		function scrollBackground() {

			var winHeight 	= cmt( window ).height();
		    var winTop 		= cmt( window ).scrollTop();
		    var winBottom 	= winTop + winHeight;
		    var winCurrent 	= winTop + winHeight / 2;
		    
		    modules.each( function( i ) {

		        var module 			= cmt( this );
		        var moduleHeight 	= module.height();
		        var moduleTop 		= module.offset().top;
		        var moduleBottom 	= moduleTop + moduleHeight;
		        var background		= module.children( ".module-bkg-parallax" );

		        if( null != background && background.length > 0 && winBottom > moduleTop && winTop < moduleBottom ) {

					var bkgWidth 		= background.width();
	            	var bkgHeight 		= background.height();
		            var min 			= 0;
		            var max 			= bkgHeight - winHeight;
		            var heightOverflow 	= moduleHeight < winHeight ? bkgHeight - moduleHeight : bkgHeight - winHeight;
		            moduleTop 			= moduleTop - heightOverflow;
		            moduleBottom 		= moduleBottom + heightOverflow;
		            var value 			= min + (max - min) * ( winCurrent - moduleTop ) / ( moduleBottom - moduleTop );

		            background.css( "background-position", "50% " + value + "px" );
		        }
		    });
		}
	};

	// Default Settings
	cmt.fn.cmtPageModule.defaults = {
		// Controls
		fullHeight: true,
		backgroundParallax: true,
		modules: {
			/* An array of Modules which need extra configuration. Ex:
			<Module Selector ID>: {
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

}( jQuery ) );