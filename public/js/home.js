var searchInputBox = document.getElementById('search-input-box');
console.log(searchInputBox);
searchInputBox.onfocus = function () {
	searchInputBox.setAttribute("value", "");
}
searchInputBox.onblur = function () {
	searchInputBox.setAttribute("value", "ZIP Code or Location");
}