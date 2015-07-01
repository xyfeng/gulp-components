FROG.addCountdown = function($el, clearCount) {
    $el.on('click', function() {
        $this = $(this);
        var $label = $this.find('label');
        var num = parseInt($label.text()) - clearCount;
        if (num === 0) {
            $label.hide();
            $this.css('background-color', '#000');
        } else {
            $label.text(num);
        }
    });
};

/* sample */
// this is data related to compoent
FROG_SAMPLE.alertClearCount = 1;

/* component */
// this is js related to component, only show up in single component page
FROG.addCountdown($('#alert_btn_1'), FROG_SAMPLE.alertClearCount);