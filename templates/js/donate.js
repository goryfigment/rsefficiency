require('./../css/general.css');
require('./../css/home.css');
require('./../css/donate.css');
var $ = require('jquery');

function init() {
    $('#donate-link').addClass('active');
}

$(document).ready(function() {
    init();
});