function postAjax (path, postJson, onReadyStateChangeCallback) {
    var XHR;
    if (window.XMLHttpRequest) {
        XHR = new XMLHttpRequest();
    } else {
        XHR = new ActiveXObject("Microsoft.XMLHTTP");
    }
    XHR.onreadystatechange = function (status) {
        onReadyStateChangeCallback(XHR, status);
    }
    XHR.open('POST', path, false);
    XHR.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    XHR.send(postJson);
}
