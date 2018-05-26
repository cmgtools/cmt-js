/**
 * Block component used to configure page blocks. It can be used to configure blocks height, css and parallax nature.
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

			var block = cmtjq( this );

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

			var blockAttr = settings.blockAttr;

			// -- Apply Block Specific Settings
			if( cmt.utils.data.hasAttribute( block, blockAttr ) && cmtjq.inArray( block.attr( blockAttr ), blocksKeys ) >= 0 ) {

				var blockConfig				= blocksConfig[ block.attr( blockAttr ) ];
				var height					= blockConfig[ 'height' ];
				var fullHeight				= blockConfig[ 'fullHeight' ];
				var halfHeight				= blockConfig[ 'halfHeight' ];
				var qtfHeight				= blockConfig[ 'qtfHeight' ];
				var heightAuto				= blockConfig[ 'heightAuto' ];
				var heightAutoMobile		= blockConfig[ 'heightAutoMobile' ];
				var heightAutoMobileWidth	= blockConfig[ 'heightAutoMobileWidth' ];
				var css 					= blockConfig[ 'css' ];

				// Check whether pre-defined height is required
				if( null != height && height ) {

					block.css( { 'height': height + 'px' } );
				}

				// Apply auto height
				if( null != heightAuto && heightAuto ) {

					if( null != height && height ) {

						block.css( { 'height': 'auto', 'min-height': height + 'px' } );
					}
					else if( null != fullHeight && fullHeight ) {

						block.css( { 'height': 'auto', 'min-height': screenHeight + 'px' } );
					}
					else if( null != halfHeight && halfHeight ) {

						block.css( { 'height': 'auto', 'min-height': ( screenHeight / 2 ) + 'px' } );
					}
					else if( null != qtfHeight && qtfHeight ) {

						block.css( { 'height': 'auto', 'min-height': ( screenHeight * ( 3/4 ) ) + 'px' } );
					}
					else {

						block.css( { 'height': 'auto' } );
					}
				}

				// Apply Full Height
				if( null == height && null == heightAuto && ( null != fullHeight && fullHeight ) ) {

					block.css( { 'height': screenHeight + 'px' } );
				}

				// Apply Half Height
				if( null == height && null == heightAuto && ( null != halfHeight && halfHeight ) ) {

					block.css( { 'height': ( screenHeight / 2 ) + 'px' } );
				}

				// Apply Quarter to Full Height
				if( null == height && null == heightAuto && ( null != qtfHeight && qtfHeight ) ) {

					block.css( { 'height': ( screenHeight * ( 3/4 ) ) + 'px' } );
				}

				// Check whether min height and height auto is required for mobile to handle overlapped content
				if( null != heightAutoMobile && heightAutoMobile ) {

					if( window.innerWidth <= heightAutoMobileWidth ) {

						block.css( { 'height': 'auto', 'min-height': screenHeight + 'px' } );

						var contentWrap = block.children( '.block-content-wrap' );

						if( contentWrap.hasClass( 'valign-center' ) ) {

							contentWrap.removeClass( 'valign-center' );
						}
					}
				}

				// adjust content wrap and block height in case content height exceeds
				var contentWrap	= block.find( '.block-content-wrap' );
				var content		= block.find( '.block-content' );

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

						block.css( { 'height': 'auto', 'min-height': screenHeight + 'px' } );
					}
					else {

						block.css( { 'height': screenHeight + 'px' } );
					}
				}

				// Apply Half Height
				if( settings.halfHeight ) {

					if( settings.heightAuto ) {

						block.css( { 'height': 'auto', 'min-height': ( screenHeight / 2 ) + 'px' } );
					}
					else {

						block.css( { 'height': ( screenHeight / 2 ) + 'px' } );
					}
				}
				
				// Apply Quarter to Full Height
				if( settings.qtfHeight ) {

					if( settings.heightAuto ) {

						block.css( { 'height': 'auto', 'min-height': ( screenHeight * ( 3/4 ) ) + 'px' } );
					}
					else {

						block.css( { 'height': ( screenHeight * ( 3/4 ) ) + 'px' } );
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
		        var background		= block.children( '.block-bkg-parallax' );

		        if( null != background && background.length > 0 && winBottom > blockTop && winTop < blockBottom ) {

					var bkgWidth 		= background.width();
	            	var bkgHeight 		= background.height();
		            var min 			= 0;
		            var max 			= bkgHeight - winHeight * 0.5;
		            var heightOverflow 	= blockHeight < winHeight ? bkgHeight - blockHeight : bkgHeight - winHeight;
		            blockTop 			= blockTop - heightOverflow;
		            blockBottom 		= blockBottom + heightOverflow;
		            var value 			= min + (max - min) * ( winCurrent - blockTop ) / ( blockBottom - blockTop );

		            background.css( 'background-position', '50% ' + value + 'px' );
		        }
		    });
		}
	};

	// Default Settings
	cmtjq.fn.cmtBlock.defaults = {
		blockAttr: 'cmt-block',
		// Controls
		fullHeight: true,
		halfHeight: false,
		qtfHeight: false,
		heightAuto: false,
		backgroundParallax: true,
		blocks: {
			/* An array of blocks which need extra configuration. Ex:
			<Block Selector>: {
				height: 250,
				fullHeight: false,
				halfHeight: false,
				qtfHeight: false,
				heightAuto: false,
				heightAutoMobile: false,
				heightAutoMobileWidth: 1024,
				css: { color: 'white' }
			}
			*/
		}
	};

})( jQuery );
