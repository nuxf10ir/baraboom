_.templateSettings = {
    evaluate: /\{\[([\s\S]+?)\]\}/g,
    interpolate: /\{\{([\s\S]+?)\}\}/g
};

function plural(n,f) {n%=100;if(n>10&&n<20)return f[2];n%=10;return f[n>1&&n<5?1:n==1?0:2]};

var daysTitles = ['день', 'дня', 'дней'];
var hoursTitles = ['час', 'часа', 'часов'];
var minutesTitles = ['минуту', 'минуты', 'минут'];
var endTime = new Date(2019, 0, 23, 14);

jQuery.fn.Baramooms = function() {
    var $self = $(this),
        resultTmpl = _.template($("#bb-results_tmpl").html()),
        countdownTmpl = _.template($("#bb-countdown_tmpl").html()),
        $title = $('#title'),
        $countdown = $('#countdown'),
        $balloonItems = $self.find('.bb-balloon-item'),
        shootsLeft = 5,
        scores = {
            a1: 2,
            a2: 2,
            a3: 2,
            a4: 2,
            a5: 2,
            a6: 2,
            a7: 2,
            a8: 2,
            a9: 2,
            a10: 2
        };

    function getTimeRemaining(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor( (t/1000) % 60 );
        var minutes = Math.floor( (t/1000/60) % 60 );
        var hours = Math.floor( (t/(1000*60*60)) % 24 );
        var days = Math.floor( t/(1000*60*60*24) );
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function initializeClock(endtime){
        var timeinterval = setInterval(function() {

            var t = getTimeRemaining(endtime);

            $countdown.html(countdownTmpl(getTimeRemaining(endtime)));

            if (t.total <= 0) {
                clearInterval(timeinterval);
            }

        }, 1000);
    }

    initializeClock(endTime);

    if (getTimeRemaining(endTime)['total'] > 0) {

        $self.show();

        $balloonItems.on('click.barabooms', '.bb-balloon', function (e) {
            var $currentItem = $(e.delegateTarget),
                $current = $(e.target);

            boom($currentItem, $current);

        });
    } else {
        sendResults();
    }





    function boom($item, $balloon) {

        $item
            .off('click.barabooms')
            .addClass('empty');

        $balloon.replaceWith('<div class="bb-boom animated faster booom"></div>');

        scores['a' + ($item.index() + 1)] = 0;
        shootsLeft--;

        if (shootsLeft === 0) {
            $balloonItems.off('click.barabooms');
            setTimeout(function () {
                $balloonItems.addClass('fadeOutUpBig slow');
                setTimeout(sendResults(true), 1000);
            }, 500);
        }





    }

    function sendResults(isSendResults) {

        var sendType = isSendResults ? 'SET' : 'VIEW';

        $.ajax({
            method: "POST",
            dataType: 'json',
            url: "//opros.gd.ru/api/set-result.php",

            data: { answers: scores, type: sendType }
        })
            .done(function( response ) {
                showResults(response)
            })
            .fail(function(e) {
                console.warn( "error", e );
            })
            .always(function() {

            });
    }

    function showResults(response) {
        $title.hide();
        $countdown.show();
        $self
            .empty()
            .addClass('results')
            .html(resultTmpl(response));

    }

    return this;
};

$(function() {
    $("#barabooms").Baramooms();
});
