/**
 * Rate is jQuery plugin to provide ratings.
 */

( function( cmtjq ) {

	// TODO Generate html if not provided

	cmtjq.fn.cmtRate = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtRate.defaults, options );
		var ratings			= this;

		// Iterate and initialise all the ratings
		ratings.each( function() {

			var rating = cmtjq( this );

			init( rating );
		});

		// return control
		return;

		// == Private Functions == //

		function init( rating ) {

			var total 		= rating.find( '.star' ).length;
			var stars		= [];
			var icons		= [];
			var selected 	= ( rating.find( '.selected' ).length == 1 ) ? parseInt( rating.find( '.selected' ).attr( 'star' ) ) : 0;
			var disabled	= rating.hasClass( 'disabled' );

			// Init Icons
			rating.find( '.star' ).each( function() {

				var star 	= cmtjq( this );
				var index 	= parseInt( star.attr( 'star' ) );

				if( selected > 0 && selected <= index ) {

					star.html( '<i class="' + settings.base + ' ' + settings.filled + '"></i>' );
					star.css( 'color', settings.filledColor );
				}
				else {

					star.html( '<i class="' + settings.base + ' ' + settings.empty + '"></i>' );
					star.css( 'color', settings.emptyColor );
				}

				if( disabled ) {

					star.css( 'color', settings.disabledColor );
				}
				else {

					stars.push( star );
					icons.push( star.children( 'i' ) );
				}
			});

			if( !disabled ) {

				// Hover effect
				rating.find( '.star' ).mouseover( function() {

					var index 	= parseInt( cmtjq( this ).attr( 'star' ) );

					refresh( rating, total, index, stars, icons, 0 );
				});

				rating.find( '.star' ).mouseout( function() {

					refresh( rating, total, selected, stars, icons, 1 );
				});

				// Rate
				rating.find( '.star' ).click( function() {

					var index 	= parseInt( cmtjq( this ).attr( 'star' ) );
					selected	= index;

					rating.find( 'input' ).val( jQuery( this ).attr( 'star' ) );
					rating.find( '.star' ).removeClass( 'selected' );
					cmtjq( this ).addClass( 'selected' );

					refresh( rating, total, index, stars, icons, 2 );
				});
			}
		}

		function refresh( rating, total, index, stars, icons, choice ) {

			for( var i = 1; i <= total; i++ ) {

				var star = stars[ i - 1 ];
				var icon = icons[ i - 1 ];

				if( i <= index ) {

					switch( choice ) {

						case 0: {

							star.css( 'color', settings.hoverColor );

							break;
						}
						case 1:
						case 2: {

							star.css( 'color', settings.filledColor );

							break;
						}
					}

					icon.removeClass( settings.empty );
					icon.addClass( settings.filled );
				}
				else {

					star.css( 'color', settings.emptyColor );
					icon.removeClass( settings.filled );
					icon.addClass( settings.empty );
				}
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtRate.defaults = {
		base: 'fa',
		empty: 'fa-star-o',
		filled: 'fa-star',
		emptyColor: 'black',
		filledColor: '#A5D75A',
		hoverColor: '#EF9300',
		disabledColor: '#7F7F7F'
	};

})( jQuery );