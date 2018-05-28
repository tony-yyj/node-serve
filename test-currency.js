let currency = require('./lib/currency');

console.log('50 canadian dollars equals this amount of us dollars:', currency.canadianToUs(50));

console.log('30 us dollars equals this amount of canadian dollars:', currency.USToCanadian(30));