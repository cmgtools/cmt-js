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
			var messages	= [];
			var selected 	= ( rating.find( '.selected' ).length == 1 ) ? parseInt( rating.find( '.selected' ).attr( 'star' ) ) : 0;
			var disabled	= rating.hasClass( 'disabled' );
			var readOnly	= rating.hasClass( 'read-only' );

			// Init Icons
			rating.find( '.star' ).each( function() {

				var star 	= cmtjq( this );
				var index 	= parseInt( star.attr( 'star' ) );

				if( selected > 0 && selected >= index ) {

					star.html( '<i class="' + settings.base + ' ' + settings.filled + '"></i>' );
					star.css( 'color', settings.filledColor );
				}
				else if( selected === index && settings.message ) {

					message.addClass( 'selected' );
				}
				else {

					star.html( '<i class="' + settings.base + ' ' + settings.empty + '"></i>' );
					star.css( 'color', settings.emptyColor );
				}

				// Disabled - Change color
				if( disabled ) {

					star.css( 'color', settings.disabledColor );
				}
				else if( readOnly ) {
					star.css( 'color', settings.readonlyColor );
				}
				// Enabled - Prepare cache
				else {

					stars.push( star );
					icons.push( star.children( 'i' ) );

					if( settings.message ) {

						messages.push( rating.find( 'span[star-message=' + index + ']' ) );
					}
				}
			});

			if( !disabled && !readOnly ) {

				// Hover effect
				rating.find( '.star' ).mouseover( function() {

					var index 	= parseInt( cmtjq( this ).attr( 'star' ) );

					refresh( rating, total, index, stars, icons, messages, 0 );
				});

				rating.find( '.star' ).mouseout( function() {

					refresh( rating, total, selected, stars, icons, messages, 1 );
				});

				// Rate
				rating.find( '.star' ).click( function() {

					var index 	= parseInt( cmtjq( this ).attr( 'star' ) );
					selected	= index;

					rating.find( 'input' ).val( jQuery( this ).attr( 'star' ) );
					rating.find( '.star' ).removeClass( 'selected' );
					cmtjq( this ).addClass( 'selected' );

					refresh( rating, total, index, stars, icons, messages, 2 );
				});
			}
		}

		function refresh( rating, total, index, stars, icons, messages, choice ) {

			if( settings.message ) {

				rating.find( '.star-message' ).removeClass( 'selected' );
			}

			for( var i = 1; i <= total; i++ ) {

				var star 	= stars[ i - 1 ];
				var icon 	= icons[ i - 1 ];
				var message = messages[ i - 1 ];

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

					if( i == index && settings.message ) {

						message.addClass( 'selected' );
					}
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
		disabledColor: '#7F7F7F',
		readonlyColor: '#A5D75A',
		message: true
	};

})( jQuery );
