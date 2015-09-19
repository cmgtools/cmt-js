/*
 * Dependencies: jquery
 */

( function( cmt ) {

	cmt.fn.cmtBlock = function( options ) {

		// == Init == //

		// Configure Blocks
		var settings 		= cmt.extend( {}, cmt.fn.cmtBlock.defaults, options );
		var blocks			= this;
		var screenHeight	= cmt( window ).height();
		var screenWidth		= cmt( window ).width();
		var blocksConfig	= settings.block;
		var blocksKeys		= Object.keys( blocksConfig );

		// Iterate and initialise all the page blocks
		blocks.each( function() {

			var block	= cmt( this );

			init( block );
		});

		// Initialise parallax
		if( settings.backgroundParallax ) {

			cmt( window ).scroll( scrollBackground );
		}

		// return control
		return;

		// == Private Functions == //

		// Initialise Block
		function init( block ) {

			// -- Apply Common Settings for all the Blocks

			// -- Apply Block Specific Settings

			if( cmt.inArray( block.attr( "id" ), blocksKeys ) >= 0 ) {

				var blockConfig			= blocksConfig[ block.attr( "id" ) ];
				var height					= blockConfig[ "height" ];
				var fullHeight				= blockConfig[ "fullHeight" ];
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
				}

				// Apply Full Height
				if( null == height && null == heightAuto && ( null != fullHeight && fullHeight ) ) {

					block.css( { 'height': screenHeight + "px" } );
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

				// Check whether additional css is required
				if( null != css && css ) {

					block.css( css );
				}
			}
			// Config in absence of block specific config
			else {

				// Apply Full Height
				if( settings.fullHeight ) {
	
					block.css( { 'height': screenHeight + "px" } );
				}
			}
		}

		// Initialise parallax
		function scrollBackground() {

			var winHeight 	= cmt( window ).height();
		    var winTop 		= cmt( window ).scrollTop();
		    var winBottom 	= winTop + winHeight;
		    var winCurrent 	= winTop + winHeight / 2;
		    
		    blocks.each( function( i ) {

		        var block 			= cmt( this );
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
	cmt.fn.cmtBlock.defaults = {
		// Controls
		fullHeight: true,
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

}( jQuery ) );