//css
require('./../css/general.css');
require('./../css/quest.css');
require('./../css/tippy.css');
require('./../css/sortable.css');
//javascript
var $ = require('jquery');
var helper = require('./../js/helpers.js');
require('./../js/tippy.js');
//handlebars
var questIndexTemplate = require('./../handlebars/quest/quest_index.hbs');
var quest = require('./../handlebars/quest/quest.hbs');

function init() {
    $('#quest-link').addClass('active');

    var $questWrapper = $('#quest-wrapper');

    if(!$.isEmptyObject(globals.f2p_quests) && !$.isEmptyObject(globals.member_quests)) {
        $questWrapper.empty();
        $questWrapper.append(questIndexTemplate({'f2p_quests': globals.f2p_quests, 'member_quests': globals.member_quests}));
    } else {
        $questWrapper.append(quest(globals.quest));
    }

    if (localStorage.getItem("expand") == 'true') {
        $('#flexible-button').text('Minimize');
        $(".collapsible").each(function() {
            var $collapisible = $(this);
            $collapisible.show();
            $collapisible.siblings('.step').addClass('expanded');
        });
    }
}

function comparer(index) {
    return function(a, b) {
        var valA = parseFloat(helper.replaceAll(getCellValue(a, index),',', '')), valB = parseFloat(helper.replaceAll(getCellValue(b, index), ',', ''));
        return valA - valB;
    }
}

function getCellValue(row, index) {
    if($(row).children('td').eq(index).attr('data-value')) {
        return $(row).children('td').eq(index).attr('data-value');
    } else {
        return $(row).children('td').eq(index).html();
    }
}

$(document).ready(function() {
    init();

    $('.sortable').click(function(){
        var $this = $(this);
        var $sortable = $this.closest('table').find('.sortable');
        for (var s = 0; s < $sortable.length; s++){
            if($sortable[s] != this) {$sortable[s].asc = false;}
            $($sortable[s]).removeClass('ascending').removeClass('descending');
        }
        var table = $this.parents('table').eq(0);
        var rows = table.find('tr:gt(0)').toArray().sort(comparer($this.index()));

        this.asc = !this.asc;
        if (!this.asc){
            rows = rows.reverse();
            $this.addClass('descending');
        } else {
            $this.addClass('ascending');
        }
        for (var i = 0; i < rows.length; i++){table.append(rows[i])}
    });

    $(document).on('click', '.toggle', function () {
        var $toggle = $(this);
        var $collapisible = $toggle.find('.collapsible');
        var $step = $toggle.find('.step');

        if ($step.hasClass('expanded')) {
            $step.removeClass('expanded');
        } else {
            $step.addClass('expanded');
        }

        $collapisible.slideToggle(250, function () {
            //execute this after slideToggle is done
        });
    });

    $(document).on('click', '.collapsible', function (e) {
        e.stopPropagation();
    });

    $(document).on('click', '#flexible-button', function (e) {
        var $this = $(this);

        if($this.text() == 'Expand') {
            $this.text('Minimize');
            localStorage.setItem("expand", 'true');
            $(".collapsible").each(function() {
                var $collapisible = $(this);
                $collapisible.show();
                $collapisible.siblings('.step').addClass('expanded');
            });
        } else {
            $this.text('Expand');
            localStorage.setItem("expand", 'false');
            $(".collapsible").each(function() {
                var $collapisible = $(this);
                $collapisible.hide();
                $collapisible.siblings('.step').removeClass('expanded');
            });
        }
    });

});