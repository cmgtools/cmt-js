( function( cmt ) {

// TODO: Add option for multi select

	cmt.fn.cmtSelect = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmt.extend( {}, cmt.fn.cmtSelect.defaults, options );
		var dropDowns		= this;

		// Iterate and initialise all the fox sliders
		dropDowns.each( function() {

			var dropDown = cmt( this );

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

					cmt( ".cmt-select-list" ).hide();

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
				
				cmt( document ).on( 'click', function( e ) {

			        if ( cmt( e.target ).closest( customList ).length === 0 ) {
	
			            customList.hide();
			        }
				});
			}
		}
	};

	// Default Settings
	cmt.fn.cmtSelect.defaults = {
		multi: false,
		copyId: false,
		wrapperClass: null,
		iconClass: null,
		iconHtml: null
	};

}( jQuery ) );