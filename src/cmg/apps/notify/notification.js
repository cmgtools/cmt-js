// == Application =========================

jQuery( document ).ready( function() {

	var app = cmt.api.root.getApplication( 'notify' );

	app.mapController( 'notification', 'cmg.controllers.notify.NotificationController' );

	cmt.api.utils.request.register( app, jQuery( '[cmt-app=notify]' ) );
});

// == Controller Namespace ================

// == Notification Controller =============

cmg.controllers.notify.NotificationController = function() {};

cmg.controllers.notify.NotificationController.inherits( cmt.api.controllers.BaseController );

cmg.controllers.notify.NotificationController.prototype.toggleReadActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

cmg.controllers.notify.NotificationController.prototype.hreadActionSuccess = function( requestElement, response ) {

	var clickBtn	= requestElement.find( '.cmt-click' );
	var type		= clickBtn.attr( 'type' );
	var count		= response.data.unread;
	
	if( response.data.consumed ) {

		jQuery( ".count-header.count-" + type ).html( count );
		jQuery( ".count-sidebar.count-sidebar-header.count-" + type ).html( count );
		jQuery( ".count-sidebar.count-sidebar-content.count-" + type ).html( count );

		if( count == 0 ) {
			
			jQuery( ".count-header.count-" + type ).fadeOut( 'fast' );
			jQuery( ".count-sidebar.count-sidebar-header.count-" + type ).fadeOut( 'fast' );
			jQuery( ".count-sidebar.count-sidebar-content.count-" + type ).fadeOut( 'fast' );
		}
	}

	if( requestElement.is( '[redirect]' ) ) {

		window.location = requestElement.attr( 'redirect' );
	}
};

cmg.controllers.notify.NotificationController.prototype.readActionSuccess = function( requestElement, response ) {

	if( requestElement.is( '[redirect]' ) ) {

		window.location = requestElement.attr( 'redirect' );
	}
	else {

		location.reload( true );
	}
};

cmg.controllers.notify.NotificationController.prototype.trashActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

cmg.controllers.notify.NotificationController.prototype.deleteActionSuccess = function( requestElement, response ) {

	location.reload( true );
};

// == Direct Calls ========================

// == Additional Methods ==================
