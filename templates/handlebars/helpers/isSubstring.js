module.exports = function(substring, string) {
    if ((string.toString()).indexOf(substring) != -1) {
        return true;
    } else {
        return false;
    }
};