function loadJsAsync(src, callback) {
    var s = document.createElement('script');
    s.type = "text/javascript";
    s.src = src;
    s.addEventListener('load', function (e) {
        callback(null, e);
    }, false);
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(s);
}

function embedIpccChat(data) {
    var iframe = document.createElement('iframe');
    try {
        // iframe.style.border = 'none';
        // iframe.style.width = '0%';
        // iframe.style.height = '0%';
        // iframe.style.position = 'fixed';
        // iframe.style.bottom = '0';
        // iframe.style.right = '0';
        // iframe.style.zIndex = 9999;
        // iframe.style.border = '15px';
        // iframe.style.visibility = 'hidden';

        iframe.id = 'ipcc_chat_iframe';
        iframe.style.border = '0px';
        iframe.style.width = '100px';
        iframe.style.height = '100px';
        iframe.style.position = 'fixed';
        iframe.style.bottom = '25px';
        iframe.style.right = '25px';
        // iframe.style.cssText += ";border-radius: 10px";
        iframe.style.visibility = 'visible';
        iframe.style.zIndex = '9999';
        // iframe.style.boxShadow = '1px 5px 15px rgb(56 65 74 / 15%)';
        // innerDoc.postMessage('parent_finished_changing_size_open', '*');
        var src = data.url + "/chat-client/close/";

        var queryString = "?domain=" + data.domain + "&output=embed&externalId=" + data.externalId + "&realm=" + data.realmName+ "&userCode=" + data.userCode;
        iframe.src = src + encodeURIComponent(btoa(queryString));
        console.log(iframe.src)
        document.body.appendChild(iframe);

        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

        // Listen to message from child window
        eventer(messageEvent, function (e) {
            var key = e.message ? "message" : "data";
            var data = e[key];
            var iframe = document.getElementById('ipcc_chat_iframe');
            var innerDoc = (iframe.contentWindow || iframe.contentDocument);

            if (data == "openChatBox") {
                iframe.style.border = '1px';
                iframe.style.width = '400px';
                iframe.style.height = '550px';
                iframe.style.position = 'fixed';
                iframe.style.bottom = '30px';
                iframe.style.right = '30px';
                // iframe.style.cssText += ";border-radius: 10px";
                iframe.style.visibility = 'visible';
                iframe.style.zIndex = '9999';
                // iframe.style.boxShadow = '1px 5px 15px rgb(56 65 74 / 15%)';
                innerDoc.postMessage('parent_finished_changing_size_open', '*');
            } else if (data == "closeChatBox") {
                // iframe.style.border = '0px';
                iframe.style.width = '100px';
                iframe.style.height = '100px';
                iframe.style.overflow = 'hidden'
                iframe.style.bottom = '25px';
                iframe.style.right = '25px';
                iframe.style.zIndex = '9999';
                iframe.style.visibility = 'visible';
                innerDoc.postMessage('parent_finished_changing_size_close', '*');
            }
        }, false);
    } catch (e) {
        iframe.parentNode.removeChild(iframe);
    }
}

function closeChatBoxIPCC() {
    try {
        var iframe = document.getElementById('ipcc_chat_iframe');
        var innerDoc = (iframe.contentWindow || iframe.contentDocument);
        innerDoc.postMessage('close_chat_from_parent', '*');
    } catch (e) {
        // log(e);
    }
}

function openChatBoxIPCC() {
    try {
        var iframe = document.getElementById('ipcc_chat_iframe');
        var innerDoc = (iframe.contentWindow || iframe.contentDocument);
        innerDoc.postMessage('open_chat_from_parent', '*');
    } catch (e) {
        // log(e);
    }
}