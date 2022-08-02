const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

let reportPathRemoveConsole = path.resolve(__dirname, '../packages/babel-remove-console/coverage/lcov-report/index.html');
let reportPathParseTemplatei18 = path.resolve(__dirname, '../packages/parseTemplatei18/coverage/lcov-report/index.html');

const getFlag = (path) => {
    const result = fs.readFileSync(path);
    const $ = cheerio.load(result);

    let isExitFlag = false;

    const domStrongList = $('.pad1 .fl.pad1y.space-right2 .strong');
    const resultStrongList = [];
    domStrongList.each(function () {
        resultStrongList.push({
            strong: $(this).text(),
        });
    });

    const domQuietList = $('.pad1 .fl.pad1y.space-right2 .quiet');
    const resultQuietList = [];
    domQuietList.each(function () {
        resultQuietList.push({
            quiet: $(this).text(),
        });
    });

    const resultObj = resultStrongList.reduce((result, item, idx) => {
        const { quiet } = resultQuietList[idx];
        const val = item.strong;

        const [realVal] = val.split('%', 1);
        if (realVal * 1 !== 100) {
            isExitFlag = true;
        }
        result[(key = quiet)] = val;
        return result;
    }, Object.create(null));

    console.log(resultObj);
    return isExitFlag
}

Promise.all([getFlag(reportPathRemoveConsole), getFlag(reportPathParseTemplatei18)]).then((dataList) => {
    const flag = dataList.every(_ => _ === true)
    if (flag) {
        console.log("\033[41;30m 单元测试覆盖率不达标  \033[0m");
        process.exit(1);
    } else {
        console.log("\033[42;30m 单元测试覆盖率达标 \033[0m");
    }
})

