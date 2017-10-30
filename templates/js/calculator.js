//css
require('./../css/general.css');
require('./../css/calculator.css');
require('./../css/tippy.css');
//javascript
var $ = require('jquery');
require('./../js/tippy.js');
var helper = require('./../js/helpers.js');
//handlebars
var nextLevelTemplate = require('./../handlebars/calculator/next_level_template.hbs');
var templateDict = {
    'main_template': require('./../handlebars/calculator/main_template.hbs'),
    'combat_calc': require('./../handlebars/calculator/combat_calc.hbs'),
    'prayer_calc': require('./../handlebars/calculator/prayer_calc.hbs'),
    'herblore_calc': require('./../handlebars/calculator/herblore_calc.hbs'),
    'construction_calc': require('./../handlebars/calculator/construction_calc.hbs'),
    'magic_calc': require('./../handlebars/calculator/magic_calc.hbs'),
    'cooking_calc': require('./../handlebars/calculator/cooking_calc.hbs'),
    'crafting_calc': require('./../handlebars/calculator/crafting_calc.hbs'),
    'smithing_calc': require('./../handlebars/calculator/smithing_calc.hbs'),
    'fletching_calc': require('./../handlebars/calculator/fletching_calc.hbs')
};

var levels = {
    '1': 0, '2': 83, '3': 174, '4': 276, '5': 388, '6': 512, '7': 650, '8': 801, '9': 969, '10': 1154, '11': 1358,
    '12': 1584, '13': 1833, '14': 2107, '15': 2411, '16': 2746, '17': 3115, '18': 3523, '19': 3973, '20': 4470,
    '21': 5018, '22': 5624, '23': 6291, '24': 7028, '25': 7842, '26': 8740, '27': 9730, '28': 10824, '29': 12031,
    '30': 13363, '31': 14833, '32': 16456, '33': 18247, '34': 20224, '35': 22406, '36': 24815, '37': 27473,
    '38': 30408, '39': 33648, '40': 37224, '41': 41171, '42': 45529, '43': 50339, '44': 55649, '45': 61512,
    '46': 67983, '47': 75127, '48': 83014, '49': 91721, '50': 101333, '51': 111945, '52': 123660, '53': 136594,
    '54': 150872, '55': 166636, '56': 184040, '57': 203254, '58': 224466, '59': 247886, '60': 273742, '61': 302288,
    '62': 333804, '63': 368599, '64': 407015, '65': 449428, '66': 496254, '67': 547953, '68': 605032, '69': 668051,
    '70': 737627, '71': 814445, '72': 899256, '73': 992895, '74': 1096278, '75': 1210421, '76': 1336443, '77': 1475581,
    '78': 1629200, '79': 1798808, '80': 1968068, '81': 2192818, '82': 2421087, '83': 2673114, '84': 2951373,
    '85': 3258594, '86': 3597729, '87': 3972294, '88': 4385776, '89': 4842295, '90': 5346332, '91': 5902831,
    '92': 6517253, '93': 7195629, '94': 7994614, '95': 8771558, '96': 9684577, '97': 10692629, '98': 11805606,
    '99': 13034431
};

function init() {
    $('#calculator-link').addClass('active');

    var $calculatorWrapper = $('#calculator-wrapper');
    var calculatorTemplate = templateDict[globals.template];

    $calculatorWrapper.append(calculatorTemplate(globals.calc_data));

    if (localStorage.getItem("username") !== null && globals.template == 'combat_calc') {
        fillCombatHighscores(localStorage.getItem("username"), $('#highscore-username'));
    } else if(localStorage.getItem("username") !== null && globals.template != 'main_template') {
        fillHighscoreLevel(localStorage.getItem("username"), $('#highscore-username'), true);
    }

    var $gpPerExpColumn = $('.gp-per-exp-column');

    if(globals.calc_type != '') {
        if(globals.calc_type == 'Prayer') {
            $.when(priceLookup(globals.calc_type)).done(function(response) {
                var $bones = $('.bone');
                var $ensouled = $('.ensouled');

                for (var i = 0; i < $bones.length; i++) {
                    var $currentBone = $($bones[i]);
                    var boneId = $currentBone.attr('data-id');
                    var boneExp = parseFloat($currentBone.find('.exp').text());
                    var boneSelling = -(parseInt(response[boneId]['selling']));
                    var boneAmount = parseInt($currentBone.find('.amount').text());

                    $currentBone.attr('data-selling', boneSelling);
                    $currentBone.find('.gp-per-exp').text(Math.round(100*(boneSelling/boneExp))/100);
                    $currentBone.find('.profit').text(helper.numberCommaFormat(boneAmount*boneSelling));
                }

                for (var h = 0; h < $ensouled.length; h++) {
                    var $currentEnsouled = $($ensouled[h]);
                    var ensouledId = $currentEnsouled.attr('data-id');
                    var ensouledExp = $currentEnsouled.attr('data-exp');
                    var ensouledAmount = parseInt($currentEnsouled.find('.amount').text());
                    var ensouledSelling = -(parseInt(response[ensouledId]['selling']));
                    var $content = $currentEnsouled.find('.content');

                    for (var f = 0; f < $content.length; f++) {
                        var $currentContent = $($content[f]);
                        var multiple = parseInt($currentContent.attr('data-multiple'));
                        ensouledSelling = ensouledSelling - (parseInt(response[$currentContent.attr('data-id')]['selling'])*multiple);
                    }

                    $currentEnsouled.attr('data-selling', ensouledSelling);
                    $currentEnsouled.find('.gp-per-exp').text(Math.round(100*(ensouledSelling/ensouledExp))/100);
                    $currentEnsouled.find('.profit').text(helper.numberCommaFormat(ensouledAmount*ensouledSelling));
                }

                for (var g = 0; g < $gpPerExpColumn.length; g++) {
                    $gpPerExpColumn[g].click();
                    $gpPerExpColumn[g].click();
                }
            });
        } else if(globals.calc_type == 'Construction') {
            $.when(priceLookup(globals.calc_type)).done(function(response) {
                var $planks = $('.plank');

                for (var i = 0; i < $planks.length; i++) {
                    var $currentPlank = $($planks[i]);
                    var plankId = $currentPlank.attr('data-id');
                    var plankExp = parseFloat($currentPlank.find('.exp').text());
                    var plankSelling = -(parseInt(response[plankId]['selling']));
                    var plankAmount = parseInt($currentPlank.find('.amount').text());

                    $currentPlank.attr('data-selling', plankSelling);
                    $currentPlank.find('.gp-per-exp').text(Math.round(100*(plankSelling/plankExp))/100);
                    $currentPlank.find('.profit').text(helper.numberCommaFormat(-(plankAmount*plankSelling)));
                }

                $gpPerExpColumn.click();
                $gpPerExpColumn.click();
            });
        } else if(globals.calc_type == 'Magic') {
            $.when(priceLookup(globals.calc_type)).done(function(response) {
                var $spells = $('.spell');

                for (var h = 0; h < $spells.length; h++) {
                    var $currentSpell = $($spells[h]);
                    var spellExp = $currentSpell.attr('data-exp');
                    var spellAmount = parseInt($currentSpell.find('.amount').text());
                    var $content = $currentSpell.find('.content');
                    var spellSelling = 0;

                    for (var f = 0; f < $content.length; f++) {
                        var $currentContent = $($content[f]);
                        var multiple = parseInt($currentContent.attr('data-multiple'));
                        if($currentContent.attr('data-id') == '') {
                            spellSelling = spellSelling - multiple;
                        } else if(!$currentContent.hasClass('infinite')){
                            spellSelling = spellSelling - (parseInt(response[$currentContent.attr('data-id')]['selling'])*multiple);
                        }
                    }

                    if($currentSpell.attr('data-output') != ""){
                        var outputList = $currentSpell.attr('data-output').slice(0, -1).split(',');
                        var multipleList = $currentSpell.attr('data-multi-output').slice(0, -1).split(',');
                        for (var o = 0; o < outputList.length; o++) {
                            var currentMultiple = multipleList[o];
                            if(spellExp == 78) {
                                var spellSellingRange = (parseInt(currentMultiple.split('-')[1]) * parseInt(response[outputList[o]]['buying'])) + spellSelling;
                            }

                            spellSelling = (parseInt(currentMultiple) * parseInt(response[outputList[o]]['buying'])) + spellSelling;
                        }
                    }

                    var gpPerExp = Math.round(100*(spellSelling/spellExp))/100;
                    var profit = spellAmount*spellSelling;
                    var $gpPerExp = $currentSpell.find('.gp-per-exp');
                    var $profit = $currentSpell.find('.profit');

                    if(gpPerExp > 0 && profit > 0) {
                        $gpPerExp.addClass('positive');
                        $profit.addClass('positive')
                    } else {
                        $gpPerExp.addClass('negative');
                        $profit.addClass('negative');
                    }
                    if (spellExp == 78) {
                        $gpPerExp.text(gpPerExp.toString() + ' - ' + Math.round(100*(spellSellingRange/spellExp))/100).toString();
                        $profit.text(helper.numberCommaFormat(profit) + ' - ' + helper.numberCommaFormat(spellSellingRange*spellAmount));
                        $currentSpell.attr('data-selling', spellSelling.toString() + '-' + spellSellingRange.toString());
                    } else {
                        $gpPerExp.text(gpPerExp);
                        $profit.text(helper.numberCommaFormat(profit));
                        $currentSpell.attr('data-selling', spellSelling);
                    }
                }

                for (var g = 0; g < $gpPerExpColumn.length; g++) {
                    $gpPerExpColumn[g].click();
                    $gpPerExpColumn[g].click();
                }
            });
        } else if(globals.calc_type == "Herblore") {
            fillPrices($('.potion'), false);
        } else if(globals.calc_type == "Cooking") {
            fillPrices($('.food'), false);
        } else if(globals.calc_type == "Crafting") {
            fillPrices($('.craft'), false);
        } else if(globals.calc_type == "Smithing") {
            fillPrices($('.smith'), true);
        } else if(globals.calc_type == "Fletching") {
            fillPrices($('.fletch'), true);
        }
    }
}

function fillPrices($item, outputHasMultiple) {
    var $gpPerExpColumn = $('.gp-per-exp-column');
    $.when(priceLookup(globals.calc_type)).done(function(response) {
        for (var h = 0; h < $item.length; h++) {
            var $currentItem = $($item[h]);
            var itemId = $currentItem.attr('data-id');
            var itemExp = $currentItem.attr('data-exp');
            var itemAmount = parseInt($currentItem.find('.amount').text());
            var itemMultiple = outputHasMultiple ? parseInt($currentItem.find('.output').attr('data-multiple')) : 1;
            var itemBuying = parseInt(response[itemId]['buying']) * itemMultiple;
            var $content = $currentItem.find('.content');

            for (var f = 0; f < $content.length; f++) {
                var $currentContent = $($content[f]);
                var multiple = parseInt($currentContent.attr('data-multiple'));
                itemBuying = itemBuying - (parseInt(response[$currentContent.attr('data-id')]['selling']) * multiple);
            }

            var gpPerExp = Math.round(100*(itemBuying/itemExp))/100;
            var profit = itemAmount*itemBuying;
            var $gpPerExp = $currentItem.find('.gp-per-exp');
            var $profit = $currentItem.find('.profit');

            if(gpPerExp > 0 && profit > 0) {
                $gpPerExp.addClass('positive');
                $profit.addClass('positive')
            } else if(gpPerExp < 0 && profit < 0) {
                $gpPerExp.addClass('negative');
                $profit.addClass('negative');
            }

            $gpPerExp.text(gpPerExp);
            $profit.text(helper.numberCommaFormat(profit));
            $currentItem.attr('data-selling', itemBuying);
        }

        for (var g = 0; g < $gpPerExpColumn.length; g++) {
            $gpPerExpColumn[g].click();
            $gpPerExpColumn[g].click();
        }
    });
}

function highscoreLookup(username, highscoreType) {
    return $.ajax ({
        url: globals.base_url + '/calculator/highscore',
        data: {'username': username, 'type': highscoreType},
        dataType: 'json',
        type: "GET"
    });
}

function priceLookup(calcType) {
    return $.ajax ({
        url: globals.base_url + '/calculator/prices',
        data: {'calc_type': calcType},
        dataType: 'json',
        type: "GET"
    });
}

function calculateCombat(hitpoints, attack, strength, defence, magic, ranged, prayer) {
    var base = 0.25*(defence + hitpoints + Math.floor(prayer/2));
    var melee = 0.325*(attack + strength);
    var range = 0.325*(Math.floor(ranged*1.5));
    var mage = 0.325*(Math.floor(magic*1.5));
    var max = Math.max(melee, range, mage);

    var combat = base + max;

    $('#combat-level').text(Math.round(combat*100)/100);

    var nextLevel = Math.floor(combat) + 1;

    var meleeLevels = numberOfLevels(base+melee, 0.325);
    var baseLevels = numberOfLevels(combat, 0.25);
    var prayerLevels = numberOfLevels(combat, 0.125);
    var rangeLevels = numberOfLevelRM(ranged, base);
    var magicLevels = numberOfLevelRM(magic, base);

    function numberOfLevels(combatLevel, add) {
        var levels = 0;
        while(combatLevel < nextLevel) {
            combatLevel += add;
            ++levels;
        }
        return levels;
    }

    function numberOfLevelRM(currentLevel, baseCombat) {
        var levels = 0;
        var calc = Math.floor(currentLevel * 1.5) * 0.325;
        while((calc + baseCombat) < nextLevel) {
            calc = Math.floor((currentLevel + ++levels) * 1.5) * 0.325;
        }
        return levels;
    }

    if(prayerLevels % 2 == 0){
        ++prayerLevels;
    }

    var nextLevelData = { 'combat_level': combat, 'next_level': nextLevel, 'base_levels': baseLevels,
        'melee_levels': meleeLevels, 'prayer_levels': prayerLevels, 'range_levels': rangeLevels,
        'magic_levels': magicLevels, 'hitpoints_total': hitpoints+baseLevels, 'defence_total': defence+baseLevels,
        'attack_total': attack+meleeLevels, 'strength_total': strength+meleeLevels, 'magic_total': magic+magicLevels,
        'range_total': ranged+rangeLevels, 'prayer_total': prayer+prayerLevels
    };

    var $nextLevelWrapper = $('#next-level-wrapper');
    $nextLevelWrapper.empty();
    $nextLevelWrapper.append(nextLevelTemplate(nextLevelData));
}

function fillCombatHighscores(username, $highscoreUsername) {
    $highscoreUsername.val(username);

    $.when(highscoreLookup(username, 'hiscore_oldschool')).done(function(response) {
        var $highscoreInputs = $('.combat-input');

        for (var i = 0; i < $highscoreInputs.length; i++) {
            var $currentInput = $($highscoreInputs[i]);
            $currentInput.val(response[$currentInput.attr('data-input-type')]['level'])
        }

        calculateCombat(response['Hitpoints']['level'], response['Attack']['level'], response['Strength']['level'],
        response['Defence']['level'], response['Magic']['level'], response['Ranged']['level'], response['Prayer']['level']);

        if(!$.isEmptyObject(response)){
            localStorage.setItem("username", username);
        }
    });
}

function fillHighscoreLevel(username, $highscoreUsername, calculateAmount) {
    $highscoreUsername.val(username);
    var calcType = $highscoreUsername.attr('data-type');
    var $currentLevelInput = $('#current-level-input');
    var $targetLevelInput = $currentLevelInput.siblings('#target-level-input');
    var $currentExpInput = $('#current-exp-input');

    $.when(highscoreLookup(username, 'hiscore_oldschool')).done(function(response) {
        var skillData = response[calcType];
        var currentSkillLevel = skillData['level'];
        var currentExp = skillData['exp'];
        var targetLevel = currentSkillLevel + 1;
        var targetExp = levels[targetLevel];

        $currentLevelInput.val(currentSkillLevel);
        $targetLevelInput.val((targetLevel == 100) ? 99 : targetLevel);
        $currentExpInput.val((currentExp == -1) ? 0 : currentExp);

        if(calculateAmount == true) {
            var $amount = $('.amount');

            for (var i = 0; i < $amount.length; i++) {
                var $currentAmount = $($amount[i]);
                var exp = parseFloat($currentAmount.siblings('.exp').text());
                $currentAmount.text(Math.ceil((targetExp - currentExp)/exp));
            }
        }

        if(!$.isEmptyObject(response)){
            localStorage.setItem("username", username);
        }
    });
}

function calculateTargetLevel($items) {
    var targetLevel = $('#target-level-input').val();
    var targetExp = levels[targetLevel];
    var currentExp = parseInt($('#current-exp-input').val());

    for (var i = 0; i < $items.length; i++) {
        var $currentItem = $($items[i]);
        var exp = parseFloat($currentItem.attr('data-exp'));
        var selling = parseInt($currentItem.attr('data-selling'));
        var amount = Math.ceil((targetExp - currentExp)/exp);

        $currentItem.find('.amount').text(helper.numberCommaFormat(amount));
        $currentItem.find('.profit').text(helper.numberCommaFormat(amount*selling));
    }
}

function comparer(index) {
    return function(a, b) {
        var valA = parseFloat(helper.replaceAll(getCellValue(a, index),',', '')), valB = parseFloat(helper.replaceAll(getCellValue(b, index), ',', ''));
        return valA - valB;
    }
}

function getCellValue(row, index){
    return $(row).children('td').eq(index).html()
}

$(document).ready(function() {
    init();

    $(document).on('click', '.calculator', function () {
        var url = globals.base_url + $(this).attr('data-url');

        window.location.replace(url);
        window.location.href = url;
    });

    $(document).on('click', '#combat-submit', function () {
        var $highscoreSubmit = $(this);
        var $highscoreUsername = $highscoreSubmit.siblings('#highscore-username');
        var username = helper.replaceAll($highscoreUsername.val(), ' ', '_');

        fillCombatHighscores(username, $highscoreUsername);
    });

    $(document).on('keydown', '#highscore-username', function (e) {
        if(e.keyCode == 13) {
            var $highscoreSubmit = $('.highscore-submit');
            if($highscoreSubmit.length) {
                $highscoreSubmit.click();
            } else {
                $('#combat-submit').click();
            }

        }
    });

    $(document).on('click', '.highscore-submit', function () {
        var $highscoreUsername = $(this).siblings('#highscore-username');
        fillHighscoreLevel($highscoreUsername.val().trim(), $highscoreUsername, false);

        $('.calculate-submit').click();
    });

    $(document).on('keyup', '.combat-input', function () {
        var $tableContainer = $('.table-container');
        var hitpoints = $tableContainer.find('#hitpoints-input').val();
        var attack = $tableContainer.find('#attack-input').val();
        var strength = $tableContainer.find('#strength-input').val();
        var defence = $tableContainer.find('#defence-input').val();
        var magic = $tableContainer.find('#magic-input').val();
        var ranged = $tableContainer.find('#range-input').val();
        var prayer = $tableContainer.find('#prayer-input').val();

        calculateCombat(parseInt(hitpoints), parseInt(attack), parseInt(strength), parseInt(defence), parseInt(magic), parseInt(ranged), parseInt(prayer));
    });

    $(document).on('click', '#ectofuntus-input, #gilded-input', function () {
        $('#prayer-submit').click();
    });

    $(document).on('click', '#prayer-submit', function () {
        var $bones = $('.bone');
        var gildedAltar = $('#gilded-input').is(':checked');
        var targetLevel = $('#target-level-input').val();
        var targetExp = levels[targetLevel];
        var currentExp = parseInt($('#current-exp-input').val());

        for (var i = 0; i < $bones.length; i++) {
            var $currentBone = $($bones[i]);
            var multiple = (gildedAltar) ? 3.5 : 4;
            var originalExp = parseFloat($currentBone.attr('data-exp'));
            var selling = parseInt($currentBone.attr('data-selling'));
            var exp = originalExp * multiple;
            var amount = Math.ceil((targetExp - currentExp)/exp);

            $currentBone.find('.exp').text(exp);
            $currentBone.find('.amount').text(helper.numberCommaFormat(amount));
            $currentBone.find('.profit').text(helper.numberCommaFormat(amount*selling));
        }

        calculateTargetLevel($('.ensouled'));
    });

    $(document).on('click', '#construction-submit', function () {
        calculateTargetLevel($('.plank'));
    });

    $(document).on('click', '#herblore-submit', function () {
        calculateTargetLevel($('.potion'));
    });

    $(document).on('click', '#cooking-submit', function () {
        calculateTargetLevel($('.food'));
    });

    $(document).on('click', '#crafting-submit', function () {
        calculateTargetLevel($('.craft'));
    });

    $(document).on('click', '#smithing-submit', function () {
        calculateTargetLevel($('.smith'));
    });

    $(document).on('click', '#fletching-submit', function () {
        calculateTargetLevel($('.fletch'));
    });

    $(document).on('click', '#magic-submit', function () {
        var $items = $('.spell');
        var targetLevel = $('#target-level-input').val();
        var targetExp = levels[targetLevel];
        var currentExp = parseInt($('#current-exp-input').val());

        for (var i = 0; i < $items.length; i++) {
            var $currentItem = $($items[i]);
            var exp = parseFloat($currentItem.attr('data-exp'));
            var amount = Math.ceil((targetExp - currentExp)/exp);

            if(exp == 78) {
                var sellingList = $currentItem.attr('data-selling').split('-');
                var minSell = parseInt(sellingList[0]);
                var maxSell = parseInt(sellingList[1]);
                $currentItem.find('.profit').text(helper.numberCommaFormat(amount*minSell) + ' - ' + helper.numberCommaFormat(amount*maxSell))
            } else {
                var selling = parseInt($currentItem.attr('data-selling'));
                $currentItem.find('.profit').text(helper.numberCommaFormat(amount*selling));
            }

            $currentItem.find('.amount').text(helper.numberCommaFormat(amount));
        }
    });

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
});