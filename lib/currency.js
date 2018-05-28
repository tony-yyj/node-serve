let canadianDollar = 0.91;

function roundTwoDecimals(amount) {
    return Math.round(amount * 100) / 1000;
}

exports.canadianToUs = function(canadian) {
    return roundTwoDecimals(canadian * canadianDollar);
};

exports.USToCanadian = function(us) {
    return roundTwoDecimals(us / canadianDollar);
};