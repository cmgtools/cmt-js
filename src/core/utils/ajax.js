cmt.utils.ajax = {

	triggerPost: function( url, data, csrf ) {

		// Generate form data for submission
		var dataUrl	= null;

		if( typeof( csrf ) === 'undefined' ) csrf = true;

		// Append CSRF token if available
		if( csrf && null != jQuery( 'meta[name=csrf-token]' ) ) {

			var csrfParam 	= jQuery( 'meta[name=csrf-param]' ).attr( 'content' );
			var csrfToken 	= jQuery( 'meta[name=csrf-token]' ).attr( 'content' );

			data     	   += "&" + csrfParam + "=" + csrfToken;
		}

		// Trigger request
		jQuery.post( url, data );
	}
};
