function loadJsAsync(src, callback) {
    var s = document.createElement('script');
    s.type = "text/javascript";
    s.src = src;
    s.addEventListener('load', function (e) { callback(null, e); }, false);
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(s);
}
function doSurvey(wrappedData) {
    console.log("Survey called...")
    console.log(wrappedData);
    loadJsAsync('https://surveyvtt.viettel.vn/BCCS_CC/assets/js/embedSurvey.js', function() {
        embedSurvey(wrappedData);
    })
};
// surveyType: 5,