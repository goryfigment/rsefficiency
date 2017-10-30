var helper = require('./../../js/helpers.js');
module.exports = function(num, format) {
    return (format) ? helper.numberCommaFormat(Math.ceil(num)) : Math.ceil(num);
};