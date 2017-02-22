/**
 * The DefaultController and classes extending it can be used to post arbitrary requests to server using the possible request triggers.
 * It provides a default action as a fallback in case action is not specified by the Request Element.
 */
cmt.api.controllers.DefaultController = function() {

};

cmt.api.controllers.DefaultController.inherits( cmt.api.controllers.BaseController );

cmt.api.controllers.DefaultController.prototype.init = function() {

	console.log( "Initialised default controller." );
};
