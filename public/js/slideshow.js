function Slideshow () {
	this.prevButton;
	this.nextButton;
	this.length = 0;
	this.index = -1;
	this.slideshowItems = null;
};

Slideshow.prototype.prev = function () {
	this.index = (this.index - 1 + this.length) % this.length;
	this.update();
};

Slideshow.prototype.next = function () {
	this.index = (this.index + 1) % this.length;
	this.update();
};

Slideshow.prototype.update = function () {
	for (var i = 0; i < this.length; i ++) {
		if (i === this.index) {
			removeClassName.call(this.slideshowItems[i], "d-n")
		} else {
			addClassName.call(this.slideshowItems[i], "d-n")
		}
	}
};

var slideshow = new Slideshow();

(function (slideshow) {
	var slideshowContainer = document.getElementById('slideshow-container');
	var slideshowItems = slideshowContainer.querySelectorAll('.slideshow-item');
	var prevButton = slideshowContainer.querySelector('#prev');
	var nextButton = slideshowContainer.querySelector('#next');
	var length = slideshowItems.length;

	if (length > 0) {
		for (var i = 0; i < length; i ++) {
			if (i > 0) {
				addClassName.call(slideshowItems[i], "d-n")
			}
		}
		prevButton.addEventListener('click', function (e) {
			slideshow.prev();
			e.preventDefault();
		});
		nextButton.addEventListener('click', function (e) {
			slideshow.next();
			e.preventDefault();
		});
		slideshow.slideshowItems = slideshowItems;
		slideshow.length = length
		slideshow.index = 0;
		slideshow.prevButton = prevButton;
		slideshow.nextButton = nextButton;
	}

})(slideshow);