function StepByStep () {
	this.prevButton;
	this.nextButton;
	this.doneButton;
	this.stepIcons;
	this.progressLines;
	this.length = 0;
	this.index = -1;
	this.stepByStepItems = null;
};

StepByStep.prototype.prev = function () {
	this.index = (this.index - 1 + this.length) % this.length;
	this.update();
};

StepByStep.prototype.next = function () {
	this.index = (this.index + 1) % this.length;
	this.update();
};

StepByStep.prototype.update = function () {
	for (var i = 0; i < this.length; i ++) {
		// update step icons
		if (i <= this.index) {
			removeClassName.call(this.stepIcons[i], "next-step");
			addClassName.call(this.stepIcons[i], "in-progress");
		} else {	
			removeClassName.call(this.stepIcons[i], "in-progress");
			addClassName.call(this.stepIcons[i], "next-step");
		}

		// update progress lines
		if (i < this.index) {
			removeClassName.call(this.progressLines[i], "not-done");
			addClassName.call(this.progressLines[i], "done");
		} else {
			if (i < length - 1) {
				removeClassName.call(this.progressLines[i], "done");
				addClassName.call(this.progressLines[i], "not-done");
			}
		}

		if (i === this.index) {
			removeClassName.call(this.stepByStepItems[i], "d-n")
		} else {
			addClassName.call(this.stepByStepItems[i], "d-n")
		}
	}
	if (this.index > 0) {
		removeClassName.call(this.prevButton, "d-n");
	} else {
		addClassName.call(this.prevButton, "d-n");
	}
	if (this.index === length - 1) {
		// hide next button and show done button
		addClassName.call(this.nextButton, "d-n");
		removeClassName.call(this.doneButton, "d-n");
	} else {
		// hide done button and show next button
		removeClassName.call(this.nextButton, "d-n");
		addClassName.call(this.doneButton, "d-n");
	}
};

var stepByStep = new StepByStep();

(function (stepByStep) {
	var stepByStepContainer = document.getElementById('step-by-step-container');
	var stepByStepItems = stepByStepContainer.querySelectorAll('.step-by-step-item');
	var prevButton = stepByStepContainer.querySelector('#prev-step');
	var nextButton = stepByStepContainer.querySelector('#next-step');
	var doneButton = stepByStepContainer.querySelector('#submit-button');
	var stepIcons  = stepByStepContainer.querySelectorAll('.progress-icon');
	var progressLines = stepByStepContainer.querySelectorAll('.progress-line');
	var length = stepByStepItems.length;

	if (length > 0) {
		for (var i = 0; i < length; i ++) {
			if (i > 0) {
				addClassName.call(stepByStepItems[i], "d-n")
			}
		}
		prevButton.addEventListener('click', function (e) {
			stepByStep.prev();
			e.preventDefault();
		});
		nextButton.addEventListener('click', function (e) {
			stepByStep.next();
			e.preventDefault();
		});
		stepByStep.stepByStepItems = stepByStepItems;
		stepByStep.length = length
		stepByStep.index = 0;

		stepByStep.prevButton    = prevButton;
		stepByStep.nextButton    = nextButton;
		stepByStep.stepIcons     = stepIcons;
		stepByStep.progressLines = progressLines;
		stepByStep.doneButton    = doneButton;
	}

})(stepByStep);