/**
 * Grid
 */

( function( cmtjq ) {

	cmtjq.fn.cmtGrid = function( options ) {

		// == Init == //

		// Configure Plugin
		var settings 	= cmtjq.extend( {}, cmtjq.fn.cmtGrid.defaults, options );
		var grids		= this;

		// Iterate and initialise all the grids
		grids.each( function() {

			var grid = cmtjq( this );

			init( grid );
		});

		// return control
		return;

		// == Private Functions == //

		function init( grid ) {

			// Sorting
			grid.find( '.wrap-sort select' ).change( function() {

				var pageUrl		= window.location.href;
				var selected 	= jQuery( this ).val();
				var sortOrder	= jQuery( this ).find( ':selected' ).attr( 'data-sort' );

				// Clear Sort
				if( selected === 'select' ) {

					pageUrl = cmt.utils.data.removeParam( pageUrl, 'sort' );
				}
				// Apply Sort
				else {

					pageUrl = cmt.utils.data.updateUrlParam( pageUrl, 'sort', sortOrder );
				}

				window.location	= pageUrl;
			});

			// Filters
			grid.find( '.wrap-filters select' ).change( function() {

				var pageUrl		= window.location.href;
				var selected 	= jQuery( this ).val();
				var option		= jQuery( this ).find( ':selected' );
				var column		= option.attr( 'data-col' );
				var cols		= jQuery( '.wrap-filters' ).attr( 'data-cols' );
				cols			= cols.split( ',' );

				// Clear Filter
				for( i = 0; i < cols.length; i++ ) {

					pageUrl = cmt.utils.data.removeParam( pageUrl, cols[ i ] );
				}

				// Apply Filter
				if( selected !== 'select' ) {

					pageUrl = cmt.utils.data.updateUrlParam( pageUrl, column, selected );
				}

				window.location	= pageUrl;
			});

			// Reporting
			grid.find( '.trigger-report-toggle' ).click( function() {

				grid.find( '.grid-report' ).fadeToggle( 'slow' );

				jQuery( this ).toggleClass( 'active' );
			});

			grid.find( '.trigger-report-generate' ).click( function() {

				var pageUrl	= window.location.href;
				var grid	= jQuery( this ).closest( '.grid-data' );
				var report	= grid.find( '.grid-report' );
				var fields	= report.find( '.report-field' );

				fields.each( function( index, element ) {

					var field	= jQuery( this );

					pageUrl 	= cmt.utils.data.removeParam( pageUrl, field.attr( 'name' ) );

					if( field.val().length > 0 ) {

						pageUrl	= cmt.utils.data.updateUrlParam( pageUrl, field.attr( 'name' ), field.val() );
					}
				});

				pageUrl = cmt.utils.data.updateUrlParam( pageUrl, 'report', 1 );

				window.location	= pageUrl;
			});

			grid.find( '.trigger-report-clear' ).click( function() {

				var pageUrl	= window.location.href;
				var grid	= jQuery( this ).closest( '.grid-data' );
				var report	= grid.find( '.grid-report' );
				var fields	= report.find( '.report-field' );

				fields.each( function( index, element ) {

					var field	= jQuery( this );

		    		field.val( '' );

		    		pageUrl 	= cmt.utils.data.removeParam( pageUrl, field.attr( 'name' ) );
				});

				pageUrl = cmt.utils.data.removeParam( pageUrl, 'report' );

				window.location	= pageUrl;
			});

			// Searching
			grid.find( '.search-field .trigger-search' ).click( function() {

				var pageUrl		= window.location.href;
				var grid		= jQuery( this ).closest( '.grid-data' );
				var keywords	= grid.find( '.search-field input[name=keywords]' ).val();
				var column		= grid.find( '.search-field select' ).val();

				if( keywords.length == 0 || column === 'select' ) {

					pageUrl = cmt.utils.data.removeParam( pageUrl, 'keywords' );
					pageUrl = cmt.utils.data.removeParam( pageUrl, 'search' );
				}
				else {

					pageUrl	= cmt.utils.data.updateUrlParam( pageUrl, 'search', column );
					pageUrl	= cmt.utils.data.updateUrlParam( pageUrl, 'keywords', keywords );
				}

				window.location	= pageUrl;
			});

			// Bulk Actions
			grid.find( '.grid-bulk-all' ).change( function() {

				if( jQuery( this ).is( ':checked' ) ) {

 					grid.find( '.grid-bulk' ).prop( 'checked', true );
 				}
 				else {

 					grid.find( '.grid-bulk' ).prop( 'checked', false );
 				}
			});

			grid.find( '.grid-bulk' ).change( function() {

				var element 	= jQuery( this );
				var id 			= element.attr( 'data-id' );
				var selector	= '.grid-bulk[data-id=' + id + ']';

				if( jQuery( this ).is( ':checked' ) ) {

 					grid.find( selector ).prop( 'checked', true );
 				}
 				else {

					grid.find( selector ).prop( 'checked', false );
 					grid.find( '.grid-bulk-all' ).prop( 'checked', false );
 				}
			});

			grid.find( '.wrap-bulk select' ).change( function() {

				var option		= jQuery( this ).find( ':selected' );
				var column		= option.attr( 'data-col' );
				var popup		= jQuery( this ).attr( 'popup' );
				var ids			= [];
				var selected	= grid.find( '.grid-bulk:checked' );

				if( selected.length > 0 ) {

					jQuery( '#' + popup ).find( '.action' ).html( jQuery( this ).find(":selected").text() );

					grid.find( '.grid-bulk:checked' ).each( function( index, element ) {

						var id = jQuery( this ).attr( 'data-id' );

						if( jQuery.inArray( id, ids ) < 0 ) {

							ids.push(  id );
						}
					});

					jQuery( '#' + popup ).find( 'input[name=action]' ).val( jQuery( this ).val() );
					jQuery( '#' + popup ).find( 'input[name=column]' ).val( column );
					jQuery( '#' + popup ).find( 'input[name=target]' ).val( ids.join( ',' ) );

					showPopup( '#' + popup );
				}
				else {

					alert( 'Please select at least one row to apply this action.' );
				}
			});

			// Limit
			grid.find( '.wrap-limits select' ).change( function() {

				var pageUrl		= window.location.href;
				var value		= jQuery( this ).val();

				if( value === 'select' ) {

					pageUrl = cmt.utils.data.removeParam( pageUrl, 'limit' );
				}
				else {

					pageUrl	= cmt.utils.data.updateUrlParam( pageUrl, 'limit', value );
				}

				pageUrl = cmt.utils.data.removeParam( pageUrl, 'page' );
				pageUrl = cmt.utils.data.removeParam( pageUrl, 'per-page' );

				window.location	= pageUrl;
			});

			// Layout Switch
			grid.find( '.trigger-layout-switch' ).click( function() {

				var trigger = jQuery( this );

				if( trigger.hasClass( 'table' ) ) {

					trigger.removeClass( 'table ' + settings.cardIcon );
					trigger.addClass( 'card ' + settings.listIcon );

					grid.find( '.grid-rows' ).fadeOut( 'fast' );
					grid.find( '.grid-cards' ).fadeIn( 'fast' );

					if( updateUserMeta ) {

						updateUserMeta( 'grid-layout', 'card' );
					}
				}
				else if( trigger.hasClass( 'card' ) ) {

					trigger.removeClass( 'card ' + settings.listIcon );
					trigger.addClass( 'table ' + settings.cardIcon );

					grid.find( '.grid-cards' ).fadeOut( 'fast' );
					grid.find( '.grid-rows' ).fadeIn( 'fast' );

					if( updateUserMeta ) {

						updateUserMeta( 'grid-layout', 'table' );
					}
				}
			});

			// Popup Action
			grid.find( '.actions .action-pop' ).click( function() {

				var target		= parseInt( jQuery( this ).attr( 'target' ) );
				var popup		= jQuery( this ).attr( 'popup' );

				if( target > 0 ) {

					var pop		= jQuery( '#' + popup );
					var action 	= pop.find( 'form' ).attr( 'action' ) + target;

					pop.find( 'form' ).attr( 'action', action );

					showPopup( '#' + popup );
				}
				else {

					alert( 'Please select valid row.' );
				}
			});
		}
	};

	// Default Settings
	cmtjq.fn.cmtGrid.defaults = {
		// default config
		cardIcon: 'cmti cmti-grid',
		listIcon: 'cmti cmti-list'
	};

})( jQuery );