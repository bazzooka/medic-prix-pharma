var SERVER_HOST = "http://192.168.15:3002";

var windowSize = {
	width : window.innerWidth,
	height: window.innerHeight
};

var ajaxPromo = new Ajax();


ajaxPromo.get(SERVER_HOST + '/data/datas.json' ).done(function( response, xhr ) {
	var slideContainer = document.getElementById('slide-container');
	var frag = document.createDocumentFragment();

	for(var i = 0, l = response.promos.length; i < l; i++){
		var obj = response.promos[i];
		var slideContent = "";
		slideContent += '<img u="image" src="' + obj.image + '" />';
        slideContent += '<div u="caption" t="fromLeft" style="position: absolute; top: 30px; left: 30px; width: 50px;height: 50px;">';
    		slideContent += '<div class="price-container">';
        		slideContent += '<span class="unite">' + obj.prix.unit + '</span>' + '<span class="cents">.' + obj.prix.cents + '€</span>';
        		slideContent += '<div class="qty">'
		        	slideContent += '<span class="">' + obj.qty + '</div>' + ( obj.prix.unite ? '<span class="unit">' + obj.prix.unite : '') + '</span>';
		        slideContent +='</div>';
        	slideContent += '</div>';
        slideContent += '</div>';
        slideContent += '<div class="fromBottom" u="caption" t="fromBottom" style="position: absolute; top: 150px; left: 0px; width: 50px;height: 50px;">';
        slideContent += '<span class="fullName">' + obj.fullName +': </span><span class="description">' + obj.description + '</span>';
        slideContent += '</div>';

        if(obj.vignette){
        	slideContent += '<div class="fromRight" u="caption" t="fromRight" style="position: absolute; top: 50px; left: 0px; width: 50px;height: 50px;">';
	        slideContent += '<span class="vignette ' + obj.vignette +'"></span>';
	        slideContent += '</div>';
        }
        

        var elt = document.createElement('div');
        elt.innerHTML = slideContent;
        frag.appendChild(elt);
	}
	slideContainer.appendChild(frag);

	resizeSlider();
	startSlider();
});	


var resizeSlider = function(){
	document.getElementById('slider1_container').style.width = windowSize.width+"px";
	document.getElementById('slider1_container').style.height = (windowSize.height - 56)+"px";

	Array.prototype.forEach.call(document.getElementsByClassName('slide'), function(item){
		item.style.width = windowSize.width+"px";
		item.style.height = (windowSize.height -56)+"px";
	});

	Array.prototype.forEach.call(document.getElementsByClassName('fromBottom'), function(item){
		item.style.width = windowSize.width+"px";
		item.style.top = (windowSize.height - 100)+"px";
	});

	Array.prototype.forEach.call(document.getElementsByClassName('fromRight'), function(item){
		item.style.left = (windowSize.width + 250)+"px";
	});
}

var startSlider = function(){
	jssor_slider1_starter('slider1_container');
}






jssor_slider1_starter = function (containerId) {
	var _CaptionTransitions = [];
    _CaptionTransitions["fromLeft"] = [ {$Duration:900,x:0.6,$Easing:{$Left:$JssorEasing$.$EaseInOutSine},$Opacity:2} ];
    _CaptionTransitions["fromBottom"] = [ {$Duration:900,y:-0.6,$Easing:{$Top:$JssorEasing$.$EaseInOutSine},$Opacity:2} ];
    _CaptionTransitions["fromRight"] = [ {$Duration:900,x:-0.6,$Zoom:1,$Easing:{$Left:$JssorEasing$.$EaseInCubic,$Zoom:$JssorEasing$.$EaseInCubic},$Opacity:2}];


	var options = { 
		$AutoPlay: false,
		$FillMode: 1,
		$CaptionSliderOptions: {
			$Class: $JssorCaptionSlider$,
			$CaptionTransitions: _CaptionTransitions,
			$PlayInMode: 1,
			$PlayOutMode: 3 
		}


	};
	var jssor_slider1 = new $JssorSlider$(containerId, options);
};


