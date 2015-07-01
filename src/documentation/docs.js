// doc related js
$('a[href^="#"]').on('click', function(e) {
    e.preventDefault();

    var target = this.hash;
    var $target = $(target);

    $('#comps').stop().animate({
        'scrollTop': $target.offset().top - 80
    }, 800, 'swing', function() {
        window.location.hash = target;
    });
});

// get codes for each example
$('.example-one').each(function() {
    $this = $(this);
    if ($this.hasClass('no-code')) {
        $this.wrapInner('<div class=code></div>');
        return;
    }
    var code_id = $this.data('js');
    var code_html = $.htmlClean($this.html(), {
        format: true
    });
    //escape html
    code_html = $("<div>").text(code_html).html();
    var code_js = code[code_id];
    var code_str = '<pre><code class="language-markup">' + code_html + (code_js ? '</code><code class="language-javascript">\n\n//JS\n' + code_js + '</code></pre>' : '</code></pre>');
    $this.wrapInner('<div class=code></div>');
    var $code_el = $(code_str).appendTo($this);
});


// other
FROG.addCountdown($('#btn_6'), FROG_SAMPLE.alertClearCount);