/**
 * It's a custom select plugin used to wrap original select using overlapping html elements and hiding the select element.
 */

( function( cmtjq ) {

// TODO: Add option for multi select

	cmtjq.fn.cmtSelect = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtSelect.defaults, options );
		var dropDowns		= this;

		// Iterate and initialise all the fox sliders
		dropDowns.each( function() {

			var dropDown = cmtjq( this );

			init( dropDown );
		});

		// return control
		return;

		// == Private Functions == //

		/**
		 * 1. Find the selected option if there is any.
		 * 2. Wrap the select in a div and access the wrapper div.
		 * 3. If copyId config is set, the select id attribute will be moved to wrapper div.
		 * 4. The class cmt-select-wrap will be assigned to wrapper div.
		 * 5. If wrapperClass config is set, these additional classes will be assigned to wrapper div.
		 * 6. The icon span having class s-icon will be created. If iconClass and iconHtml are set, the icon span will be assigned these classes and html.
		 * 7. The custom select div will be created having class cmt-select and child div element having class cmt-selected.
		 * 8. The span having class s-text will be appended to cmt-selected div. The span s-icon will follow s-text.
		 * 9. A ul having class cmt-select-list will be appended to cmt-select.
		 * 10. The select options will be iterated and li elements will be formed and appended to cmt-select-list.
		 * 11. The custom select i.e. cmt-select will be appended to wrapper div i.e. cmt-select-wrap.
		 * 12. The cmt-select-list will be hidden by default.
		 * 13. If select is disabled, disabled class will be assigned to custom select.
		 * 14. Toggle behaviour added to cmt-selected for cmt-select-list.
		 * 15. Click listener added to all the list elements to change select value and update s-text of cmt-selected.
		 * 16. Global listener added to hide select list if user click on other area.
		 */
		function init( dropDown ) {

			// Find Selected Option
			var selected	= dropDown.children( 'option:selected' );

			// Wrap Select
			dropDown.wrap( '<div></div>' );

			var wrapper		= dropDown.parent();

			if( settings.copyId ) {

				// Find select Id
				var selectId	= dropDown.attr( 'id' );

				// Transfer Id to wrapper
				if( null != selectId && selectId.length > 0 ) {

					// Remove select Id
					dropDown.attr( 'id', null );

					// Move id to wrapper div
					wrapper.attr( 'id', selectId );
				}
			}

			// Assign class to wrapper
			wrapper.addClass( 'cmt-select-wrap' );

			if( null != settings.wrapperClass ) {

				wrapper.addClass( settings.wrapperClass );
			}

			// Generate Icon Html
			var iconHtml	= '<span class="s-icon">';

			if( null != settings.iconClass ) {

				iconHtml	= '<span class="s-icon ' + settings.iconClass + '">';
			}

			if( null != settings.iconHtml ) {

				iconHtml	+= settings.iconHtml + "</span>";
			}
			else {

				iconHtml	+= "</span>";
			}

			// Generate Custom Select Html
			var customHtml	= "<div class='cmt-select'><div class='cmt-selected'><span class='s-text'>" + selected.html() + "</span>" + iconHtml + "</div><ul class='cmt-select-list'>";

			if( settings.copyOptionClass ) {

				var selected	= dropDown.find( ':selected' );

				if( selected.length == 1 ) {

					var classes = selected.attr( 'class' );

					customHtml	= "<div class='cmt-select'><div class='cmt-selected'><span class='s-text " + classes + "'>" + selected.html() + "</span>" + iconHtml + "</div><ul class='cmt-select-list'>";
				}
			}

			// Iterate select options
		    dropDown.find( 'option' ).each( function( index ) {

				if( settings.copyOptionClass ) {

					var classes = jQuery( this ).attr( 'class' );

					customHtml += '<li class="' + classes + '" data-value="' + jQuery( this ).val() + '">' + jQuery( this ).html() + '</li>';
				}
				else {

					customHtml += '<li data-value="' + jQuery( this ).val() + '">' + jQuery( this ).html() + '</li>';
				}
		    });

			customHtml += '</ul></div>';

			// Append Custom Select to wrapper
			wrapper.append( customHtml );

			var customSelect	= wrapper.children( '.cmt-select' );
			var customSelected	= wrapper.children( '.cmt-select' ).children( '.cmt-selected' );
			var customList		= wrapper.children( '.cmt-select' ).children( '.cmt-select-list' );

			// Hide List by default
			customList.hide();

			// Detect whether disabled
			var disabled = dropDown.attr( 'disabled' );

			if( disabled == 'disabled' || disabled ) {

				customSelected.addClass( 'disabled' );
			}
			else {

				// Add listener to selected val
				customSelected.click( function( e ) {

					var visible = customList.is( ':visible' );

					customList.hide();
					jQuery( document ).unbind( 'keyup' );

					if( !visible ) {

						customList.show();

						jQuery( document ).on( 'keyup', function( e ) {

							var character = String.fromCharCode( e.keyCode );

							customList.children( 'li' ).each( function() {

								var item = jQuery( this );

								if( item.html().substr( 0, 1 ).toUpperCase() == character ) {

									customList.animate( { scrollTop: item.offset().top - customList.offset().top + customList.scrollTop() } );

									return false;
							    }
							});
						});
					}

					e.stopPropagation();
				});

				// Update selected value
				customList.children( 'li' ).click( function() {

					var selected	= jQuery( this );
					var parent		= selected.parents().eq( 1 );

					parent.children( '.cmt-selected' ).children( '.s-text' ).html( selected.html() );
					parent.parent().children( 'select' ).val( selected.attr( 'data-value' ) ).change();

					customList.hide();
					jQuery( document ).unbind( 'keyup' );
				});

				cmtjq( document ).on( 'click', function( e ) {

			        if ( cmtjq( e.target ).closest( customList ).length === 0 ) {

			            customList.hide();
			            jQuery( document ).unbind( 'keyup' );
			        }
				});
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtSelect.defaults = {
		multi: false,
		copyId: false,
		copyOptionClass: false,
		wrapperClass: null,
		iconClass: null,
		iconHtml: null
	};

	// Utility method to reset the select after getting new values
	cmtjq.fn.cmtSelect.resetSelect = function( selectWrap, optionsHtml ) {

		var dropDown	= selectWrap.find( 'select' );

		dropDown.html( optionsHtml );

		var selected	= dropDown.children( 'option:selected' );
	 	var list		= selectWrap.find( '.cmt-select-list' );
	 	var sText		= selectWrap.find( '.cmt-selected' ).children( '.s-text' );
		var listHtml	= '';

		dropDown.children( 'option' ).each( function( index ) {

			listHtml += '<li data-value="' + jQuery( this ).val() + '">' + jQuery( this ).html() + '</li>';
		});

		sText.html( selected.html() );
		list.html( listHtml );

		list.children( 'li' ).click( function() {

			var selected	= jQuery( this );
			var parent		= selected.parents().eq( 1 );

			sText.html( selected.html() );
			dropDown.val( selected.attr( 'data-value' ) ).change();

			list.hide();
			jQuery( document ).unbind( 'keyup' );
		});
	};

	// Utility method to set value
	cmtjq.fn.cmtSelect.setValue = function( selectWrap, value ) {

		var dropDown	= selectWrap.find( 'select' );

		dropDown.val( value );

		var selected	= dropDown.children( 'option:selected' );
	 	var sText		= selectWrap.find( '.cmt-selected' ).children( '.s-text' );

		sText.html( selected.html() );
	};

})( jQuery );


/**
 * It's a custom select plugin used for multiselect options.
 */

( function( cmtjq ) {

	cmtjq.fn.cmtMultiSelect = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 		= cmtjq.extend( {}, cmtjq.fn.cmtSelect.defaults, options );
		var dropDowns		= this;

		// Iterate and initialise all the fox sliders
		dropDowns.each( function() {

			var dropDown = cmtjq( this );

			init( dropDown );
		});

		// return control
		return;

		function init( dropDown ) {

			// Generate Icon Html
			var iconHtml	= '<span class="s-icon">';

			if( null != settings.iconClass ) {

				iconHtml	= '<span class="s-icon ' + settings.iconClass + '">';
			}

			if( null != settings.iconHtml ) {

				iconHtml	+= settings.iconHtml + "</span>";
			}
			else {

				iconHtml	+= "</span>";
			}

			// Generate Select Html
			var customHtml	= '<div class="cmt-selected"><span class="s-text">' + dropDown.attr( 'title' ) + '</span>' + iconHtml + '</div>';

			// Prepend
			dropDown.prepend( customHtml );

			var selectList	= dropDown.find( '.cmt-select-list' );

			// Hide List by default
			selectList.hide();

			// Detect whether disabled
			var disabled = dropDown.attr( 'disabled' );

			if( disabled == 'disabled' || disabled ) {

				dropDown.addClass( 'disabled' );
			}
			else {

				// Add listener to selected val
				dropDown.find( '.cmt-selected' ).click( function( e ) {

					if( !selectList.is( ':visible' ) ) {

						selectList.slideDown( 'slow' );

						jQuery( document ).on( 'keyup', function( e ) {

							var character = String.fromCharCode( e.keyCode );

							selectList.children( 'li' ).each( function() {

								var item = jQuery( this );

								if( item.html().substr( 0, 1 ).toUpperCase() == character ) {

									selectList.animate( { scrollTop: item.offset().top - selectList.offset().top + selectList.scrollTop() } );

									return false;
							    }
							});
						});
					}
					else {

						 selectList.slideUp();
					}

					e.stopPropagation();
				});

				cmtjq( document ).on( 'click', function( e ) {

			        if ( cmtjq( e.target ).closest( selectList ).length === 0 ) {

			            selectList.slideUp();

			            jQuery( document ).unbind( 'keyup' );
			        }
				});
			}
		}
	};

	// Default Settings
	cmtjq.fn.cmtSelect.defaults = {
		wrapperClass: null,
		iconClass: null,
		iconHtml: null
	};

})( jQuery );