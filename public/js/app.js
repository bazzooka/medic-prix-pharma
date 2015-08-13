var SERVER_HOST = "http://192.168.1.200:3002";

var throttle = function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

var ajax = new Ajax();
document.getElementById('medic').addEventListener('keyup', throttle(function(e){
	var value = this.value;
	if(value.length >= 3){
		activateProgress();
		value = value.trimLeft();
		ajax.get(SERVER_HOST + '/getMedicament/' + encodeURIComponent(encodeURIComponent(value)) ).done(function( response, xhr ) {
		  var tbody = document.getElementsByTagName('tbody')[0];
		  tbody.innerHTML = "";
		  for(var i = 0, l = response.length; i < l; i++){
		  	var content = '<td class="mdl-data-table__cell--non-numeric">' + response[i].arti_intitule + '</td>';
			content += '<td class="">' + response[i].PV_TTC +'€</td>';
			content += '<td class="">' + response[i].honoraire + '</td>';
			content += '<td class="">' + response[i].lastCol + '</td>';

			var frag = document.createDocumentFragment(),
				elt = document.createElement("tr");

			elt.innerHTML = content;
			frag.appendChild(elt);
			tbody.appendChild(frag);
			desactivateProgress();
		  }
		});	
	}
}, 2000));

var activateProgress = function(){
	document.getElementById('progress-bar').classList.add("is-active");
}

var desactivateProgress = function(){
	document.getElementById('progress-bar').classList.remove("is-active");
}
