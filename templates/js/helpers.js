function timePassed(epochTime) {
    var d1 = new Date(parseInt(epochTime));
    var milliseconds = Math.abs(new Date() - d1);
    var minutes = Math.floor(milliseconds / 60000);
    var minuteString = '';
    var timestampString = '';

    if(minutes > 43800) {
        var months =  Math.floor(minutes / 43800);
        var monthString = months != 1 ? 'months' : 'month';
        timestampString = months.toString() + ' ' + monthString;
    } else if(minutes > 10080) {
        var weeks =  Math.floor(minutes / 10080);
        minutes = minutes - (weeks * 10080);
        var days = Math.floor(minutes / 1440);
        minutes = minutes - (days * 1440);
        var hours = Math.floor(minutes / 60);
        minutes = minutes - (hours * 60);
        var weekString = weeks != 1 ? 'weeks' : 'week';
        var dayString = days != 1 ? 'days' : 'day';
        timestampString = weeks.toString() + ' ' + weekString + ' and ' + days.toString() + ' ' + dayString;
    } else if(minutes > 1440) {
        var days = Math.floor(minutes / 1440);
        minutes = minutes - (days * 1440);
        var hours = Math.floor(minutes / 60);
        minutes = minutes - (hours * 60);
        var dayString = days != 1 ? 'days' : 'day';
        var hourString = hours != 1 ? 'hours' : 'hour';
        timestampString = days.toString() + ' ' + dayString + ' and ' + hours.toString() + ' ' + hourString;
    } else if(minutes > 60) {
        var hours = Math.floor(minutes / 60);
        minutes = minutes - (hours * 60);
        var hourString = hours != 1 ? 'hours' : 'hour';
        minuteString = minutes != 1 ? 'minutes' : 'minute';
        timestampString = hours.toString() + ' ' + hourString + ' and ' + minutes.toString() + ' ' + minuteString;
    } else {
        minuteString = minutes != 1 ? 'minutes' : 'minute';
        timestampString = minutes.toString() + ' ' + minuteString;
    }

    return timestampString;
}

function numberCommaFormat(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), replace);
}

function scrollToElement($container, $element, speed){
    var elementTop = $element.offset().top;
    var elementHeight = $element.height();
    var containerTop = $container.offset().top;
    var containerHeight = $container.height();

    if ((((elementTop - containerTop) + elementHeight) > 0) && ((elementTop - containerTop) < containerHeight)) {

    } else {
        $container.animate({
            scrollTop: $element.offset().top - $container.offset().top + $container.scrollTop()
        }, speed);
    }
}


function upAndDownPopups(keyCode, $popup, $options, scroll) {
    var $selected = $popup.find('.selected');
    var $firstOption = $options.filter(':visible').eq(0);
    var $lastOption = $options.filter(':visible').eq(-1);

    if (keyCode == 40) { //down arrow
        var $nextOption = $selected.nextAll($options).filter(':visible').first();
        if($selected.length) {
            $selected.removeClass('selected');
            if($nextOption.length){
                $nextOption.addClass('selected');
                if(scroll) {
                    scrollToElement($popup, $nextOption, 50);
                }
            } else{
                $firstOption.addClass('selected');
                if(scroll) {
                    scrollToElement($popup, $firstOption, 50);
                }
            }
        } else {
            $firstOption.addClass('selected');
            if(scroll) {
                scrollToElement($popup, $firstOption, 50);
            }
        }
    } else if (keyCode == 38) { //up arrow
        var $prevOption = $selected.prevAll($options).filter(':visible').first();
        if($selected.length) {
            $selected.removeClass('selected');
            if($prevOption.length){
                $prevOption.addClass('selected');
                if(scroll) {
                    scrollToElement($popup, $prevOption, 50);
                }
            }else{
                $lastOption.addClass('selected');
                if(scroll) {
                    scrollToElement($popup, $lastOption, 50);
                }
            }
        } else {
            $lastOption.addClass('selected');
            if(scroll) {
                scrollToElement($popup, $lastOption, 50);
            }
        }
    } else if(keyCode == 13) { //enter button
        $selected.trigger('click');
    }
}

module.exports = {
    timePassed: timePassed,
    numberCommaFormat: numberCommaFormat,
    replaceAll: replaceAll,
    scrollToElement: scrollToElement,
    upAndDownPopups: upAndDownPopups
};