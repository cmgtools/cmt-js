( function( cmtjq ) {

    var rateMethods = {
        init: function( options ) {

			// Configure Plugin
			var settings	= cmtjq.extend( {}, cmtjq.fn.cmtRate.defaults, options );
			var ratings		= this;

			// Iterate and initialise all the ratings
			ratings.each( function() {

				var rating = cmtjq( this );

				// Preserve Element Settings
				rating.data( 'cmtRateSettings', settings );

				// Initialise the Element
				bootsrap( rating );
			});

			// return control
			return;
        },
        reset: function() {

			resetRating( this );
		}
    };

    cmtjq.fn.cmtRate = function( args ) {
		
		// Method exist - Removes first argument and pass remaining arguments to method
        if( rateMethods[ args ] ) {

            return rateMethods[ args ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
        }
		// Options Object passed or empty
		else if ( typeof args === 'object' || !args ) {

            return rateMethods.init.apply( this, arguments );
        }
		// Log Error
		else {

            cmtjq.error( 'Method ' +  args + ' does not exist in CmtRate Plugin.' );
        }
    };

	function bootsrap( rating ) {

		var total 		= rating.find( '.star' ).length;
		var stars		= [];
		var icons		= [];
		var messages	= [];
		var selected 	= ( rating.find( '.selected' ).length == 1 ) ? parseInt( rating.find( '.selected' ).attr( 'star' ) ) : 0;
		var disabled	= rating.hasClass( 'disabled' );
		var readOnly	= rating.hasClass( 'read-only' );
		var settings	= rating.data( 'cmtRateSettings' );

		// Init Icons
		rating.find( '.star' ).each( function() {

			var star 	= cmtjq( this );
			var index 	= parseInt( star.attr( 'star' ) );

			if( selected > 0 && selected >= index ) {

				star.html( '<i class="' + getStarClass( rating, index, true ) + '"></i>' );
				star.css( 'color', settings.filledColor );
			}
			else if( selected === index && settings.message ) {

				message.addClass( 'selected' );
			}
			else {

				star.html( '<i class="' + getStarClass( rating, index, false ) + '"></i>' );
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

				var index = parseInt( cmtjq( this ).attr( 'star' ) );

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
	
	function getStarClass( rating, index, filled ) {
		
		var settings = rating.data( 'cmtRateSettings' );

		if( typeof( filled ) === 'undefined' ) filled = false;
		
		index = index - 1;

		if( settings.same.length > 0 ) {

			if( settings.same.length == 1 ) {
				
				return settings.same[ 0 ];
			}
			else {
				
				return settings.same[ index ];
			}
		}
		else {

			if( filled ) {

				if( settings.filled.length == 1 ) {

					return settings.filled[ 0 ];
				}
				else {

					return settings.filled[ index ];
				}
			}
			else {

				if( settings.empty.length == 1 ) {

					return settings.empty[ 0 ];
				}
				else {

					return settings.empty[ index ];
				}
			}
		}
	}

	function refresh( rating, total, index, stars, icons, messages, choice ) {
		
		var settings = rating.data( 'cmtRateSettings' );

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

				icon.removeClass( getStarClass( rating, i, false ) );
				icon.addClass( getStarClass( rating, i, true ) );

				if( i == index && settings.message ) {

					message.addClass( 'selected' );
				}
			}
			else {

				star.css( 'color', settings.emptyColor );

				icon.removeClass( getStarClass( rating, i, true ) );
				icon.addClass( getStarClass( rating, i, false ) );
			}
		}
	}

	function resetRating( rating ) {
		
		var settings = rating.data( 'cmtRateSettings' );

		rating.find( '.star i' ).each( function( index, value ) {
			
			var icon = jQuery( this );

			icon.removeClass( getStarClass( rating, index + 1, true ) );
			icon.addClass( getStarClass( rating, index + 1, false ) );
		});

		rating.find( '.star' ).css( 'color', settings.emptyColor );
		rating.find( '.star-selected' ).val( 0 );
		rating.find( '.star-message' ).removeClass( 'selected' );
	}

	// Default Settings
	cmtjq.fn.cmtRate.defaults = {
		// Rating Icons
		same: [], // Use it if empty and filled are same
		empty: [ 'far fa-star' ],
		filled: [ 'fas fa-star' ],
		// Rating Colors
		emptyColor: 'black',
		filledColor: '#A5D75A',
		hoverColor: '#EF9300',
		disabledColor: '#7F7F7F',
		readonlyColor: '#A5D75A',
		message: true
	};

})( jQuery );
