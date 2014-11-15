function addClassName (name) {
	if (this.className.indexOf(name) === -1) {
		this.className += (" " + name);
	}
};

function removeClassName (name) {
	var index, length;
	if ((index = this.className.indexOf(name)) !== -1) {
		this.className = this.className.replace(name, "");
	}
};