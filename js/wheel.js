Object.prototype.wheel = function(callback){

	if (this.addEventListener) {
		if ('onwheel' in document) {
			this.addEventListener ("wheel", onWheel, false);
		} else if ('onmousewheel' in document) {
			this.addEventListener ("mousewheel", onWheel, false);
		} else {
			this.addEventListener ("MozMousePixelScroll", onWheel, false);
		}
	} else {
		this.attachEvent ("onmousewheel", onWheel);
	}

	function onWheel(e) {
		e = e || window.event;
		var delta = e.deltaY || e.detail || e.wheelDelta
			direct = ((e.wheelDelta) ? e.wheelDelta/120 : e.detail/-3) || e.deltaY/-7;
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		if (callback)
			callback(delta, direct, this);
	}

}