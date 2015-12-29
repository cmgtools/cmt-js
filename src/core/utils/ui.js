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