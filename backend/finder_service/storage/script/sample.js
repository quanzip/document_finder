<script type="text/javascript">
    function loadJsAsync(src, callback) {
    let s = document.createElement('script');
    s.type = "text/javascript";
    s.src = src;
    s.addEventListener('load', function (e) { callback(null, e); }, false);
    let head = document.getElementsByTagName('head')[0];
    head.appendChild(s);
}
    window.onload = function() {
    loadJsAsync('http://localhost:4200/assets/js/IpccChat.js', function() {
        let IpccChat = {
            realmName: 'document_finder',
            domain: 'domain_code',
            url: 'http://localhost:4200'
        };
        embedIpccChat(IpccChat);
    })
};
</script>