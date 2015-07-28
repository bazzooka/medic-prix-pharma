var ajax = new Ajax();
document.getElementById('medic').addEventListener('change', function(e){
	ajax.get( '/getMedicament/dolip' ).done(function( response, xhr ) {
	  console.log(response);
	});
});