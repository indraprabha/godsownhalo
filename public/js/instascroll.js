
jQuery(document).ready(function (t) {
    /* Read Documentation at https://www.instagram.com/developer/endpoints/users/ */
    var url = "https://api.instagram.com/v1/users/35404723/media/recent/?callback=?";

    t.jsonp({
        "url": url,
        "data": {
            "access_token": "35404723.e5bcca4.4b8f54e204f440b2aaea610cfbe7c5d2"
        },
        "success": function (i) {
            var s = i.data;
            for (var e in s) {
                var o = t('<a href="" title=""><img src=""></a>');
                var title = s[e].caption.text;
                o.attr("href", s[e].images.standard_resolution.url),
                o.attr("title",title.substr(0, title.indexOf('\n'))),
                o.find("img").attr("src", s[e].images.low_resolution.url),
                o.appendTo("#js-instagram-list")
            }
            t("#instagram_spinner").remove()
        },
        "error": function (d, msg) {
            alert("Could not find get instagram images");
        }
    });
});
