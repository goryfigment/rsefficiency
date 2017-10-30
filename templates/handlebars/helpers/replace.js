module.exports = function(string, stringToReplace, stringReplacement) {
    return string.split(stringToReplace).join(stringReplacement);
};