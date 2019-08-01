/**
 *  使用node将翻译的谷歌文档内容更新到翻译json文件中。
 *
 *  使用方式：懒得写了，请找tony，手把手教学 :)
 */


const fs = require('fs');

/**
 *  格式化好的翻译文件组成的对象，格式类似于下面：
 "Wallet.Withdraw.CryptoCurrency": "암호화폐",
 "Headers.Assets": "5"
 */


/**
 * 合并数据-》只更新json文件，不增加
 * @param tranJsonObj
 * @param googleDoc
 */
function mergeData(tranJsonObj, googleDoc) {
    for (let key of Object.keys(googleDoc)) {
        const keyList = key.split('.');
        const name = keyList.pop();
        let obj = tranJsonObj;
        keyList.forEach(i => {
            obj = obj[i];
        });
        // 只更新json文件中存在的key，不存在的key不管他
        if (obj && obj[name] !== undefined) {
            obj[name] = googleDoc[key];
        }
        obj = null;
    }
}

/**
 *
 * @param fileName 更新的翻译文件
 * @param response
 */
exports.updateJson = function(fileName, response) {
    const googleDoc = {
        "Headers.Assets": "test",
    };
    // 需要更新的翻译文件
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err || !data) {
            console.log(err, data);
            return;
        }
        // 可以正常读取
        const obj = JSON.parse(data);
        console.log('Headers.Assets', obj['Headers']['Assets']);
        // 都是引用传递
        mergeData(obj, googleDoc);
        // 合并完后更新源文件
        fs.writeFileSync(fileName, `${JSON.stringify(obj, null, 4)}`);
        console.log('complete!');
        response.end('success');
    });
};
