// == Application =========================

jQuery( document ).ready( function() {

	var app	= cmt.api.root.registerApplication( 'location', 'cmt.api.Application', { basePath: ajaxUrl } );

	app.mapController( 'province', 'cmg.controllers.location.ProvinceController' );
	app.mapController( 'city', 'cmg.controllers.location.CityController' );

	cmt.api.utils.request.register( app, jQuery( '[cmt-app=location]' ) );

	// Listeners
	jQuery( '.address-province' ).change( function() {

		var cityFill = jQuery( this ).closest( '.frm-address' ).find( '.city-fill' );

		cityFill.find( '.id' ).val( '' );
		cityFill.find( '.auto-fill-text' ).val( '' );
	});
});

// == Controller Namespace ================

var cmg = cmg || {};

cmg.controllers = cmg.controllers || {};

cmg.controllers.location = cmg.controllers.location || {};

// == Province Controller =================

cmg.controllers.location.ProvinceController	= function() {};

cmg.controllers.location.ProvinceController.inherits( cmt.api.controllers.BaseController );

cmg.controllers.location.ProvinceController.prototype.provinceActionPre = function( requestElement ) {

	this.requestData = { countryId: requestElement.find( 'select' ).val() };

	return true;
};

cmg.controllers.location.ProvinceController.prototype.provinceActionSuccess = function( requestElement, response ) {

	var selectWrap	= requestElement.parent().find( '.wrap-province .cmt-select-wrap' );

	if( response.data.length <= 0 ) {

		response.data	= '<option value="0">Choose Province</option>';
	}

	jQuery.fn.cmtSelect.resetSelect( selectWrap, response.data );

	// OR

	jQuery( '.frm-province .cmt-select-wrap select' ).remove();
	jQuery( '.frm-province .cmt-select-wrap' ).empty();
	jQuery( '.frm-province ' ).html( "<label>State/Province</label><select id='wrap-province' class='element-60 cmt-select cmt-change' name='Address[provinceId]'>" + response.data.provinceList + "</select>" );
	jQuery( '.frm-province .cmt-select' ).cmtSelect( { iconHtml: '<span class="cmti cmti-chevron-down"></span>' } );
};

// == City Controller =====================

cmg.controllers.location.CityController	= function() {};

cmg.controllers.location.CityController.inherits( cmt.api.controllers.BaseController );

cmg.controllers.location.CityController.prototype.autoSearchActionPre = function( requestElement ) {

	var form		= requestElement.closest( '.frm-address' );
	var autoFill	= requestElement.closest( '.auto-fill' );

	var provinceId 	= form.find( '.address-province' ).val();
	var cityName 	= form.find( '.auto-fill-text' ).val();

	if( cityName.length <= 0 ) {

		autoFill.find( '.auto-fill-items' ).slideUp();
		autoFill.find( '.auto-fill-target .target' ).val( '' );

		return false;
	}

	this.requestData = "province-id=" + provinceId + "&name=" + cityName;

	return true;
};

cmg.controllers.location.CityController.prototype.autoSearchActionSuccess = function( requestElement, response ) {

	var data			= response.data;
	var listHtml		= '';
	var autoFill		= requestElement.closest( '.auto-fill' );
	//var wrapItemList	= autoFill.find( '.auto-fill-items-wrap' );
	var itemList		= autoFill.find( '.auto-fill-items' );

	for( i = 0; i < data.length; i++ ) {

		var obj = data[ i ];

		listHtml += "<li class='auto-fill-item' data-id='" + obj.id + "' data-lat='" + obj.latitude + "' data-lon='" + obj.longitude + "' data-zip='" + obj.postal + "'>" + obj.name + "</li>";
	}

	if( listHtml.length == 0 ) {

		listHtml = "<li class='auto-fill-message'>No matching results found.</li>";

		itemList.html( listHtml );
	}
	else {

		itemList.html( listHtml );

		requestElement.find( '.auto-fill-item' ).click( function() {

			var target	= autoFill.find( '.auto-fill-target .target' );
			var id		= jQuery( this ).attr( 'data-id' );
			var name	= jQuery( this ).html();

			var lat		= jQuery( this ).attr( 'data-lat' );
			var lon		= jQuery( this ).attr( 'data-lon' );
			var zip		= jQuery( this ).attr( 'data-zip' );
			zip			= zip.split( ' ' );

			itemList.slideUp();

			// Update City Id and Name
			target.val( id );
			requestElement.find( '.auto-fill-text' ).val( name );

			// Update Map
			var parent		= jQuery( this ).closest( '.frm-address' );
			var address		= lat + ',' + lon;

			parent.find( '.search-ll' ).val( address ).trigger( 'change' );

			// Update City Zip
			parent.find( '.address-zip' ).val( zip[ 0 ] );
		});
	}

	itemList.slideDown();
};

// == Direct Calls ========================

// == Additional Methods ==================
