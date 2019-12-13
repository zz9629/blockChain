'use strict';

var __dirname = '/home/fisco-bcos/nodejs-sdk';
var path = require('path');

//给api配置私钥和证书
const config = require(path.join(__dirname, "./packages/api/common/configuration")).Configuration;
config.setConfig(path.join(__dirname, "./packages/cli/conf/config.json"));

//调用API: sendRawTx
const web3jService = require(path.join(__dirname, "./packages/api/web3j")).Web3jService
const web3 = new web3jService;

//decodeParams
const util = require(path.join(__dirname, "./packages/api/common/web3lib/utils"));
const utils = require(path.join(__dirname, "./packages/api/common/utils"));

//get abi
const getAbi = require(path.join(__dirname, "./packages/cli/interfaces/base")).getAbi;

//express框架
const express = require('express');
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express();
app.use(express.static('.'));

//合约地址
var contractAddress = '0xfdb2d15cb5fabaf05d1e148f4052e67776a77ed3';

var funcArray = new Array();
funcArray[0] = 'login';
funcArray[1] = 'register';
funcArray[2] = 'buyGoods';
funcArray[3] = 'transferReceipt';
funcArray[4] = 'raiseMoney';
funcArray[5] = 'payReceipt';
funcArray[6] = 'getReceipt';

var currentUserName = ""
var ReceiptIndex = -1

app.get('/getname', (req, res) => {
    console.log("menu getName-get 请求");
    var ret = { status: "ok", name: currentUserName }
    res.send(ret)
});


app.post('/register', urlencodedParser, (request, response) => {
    console.log("主页 register-POST 请求");
    // 输入数据
    var name = request.body.name;
    var password = request.body.password;
    var type = request.body.type;

    var params = new Array();
    params.push(name);
    params.push(password);
    params.push(type);

    //promise, get register index
    const promise = register(params);
    promise.then(function(temp) {
        console.log('part2: get index');
        console.log('returns to js web: ' + JSON.stringify(temp));
        // returns temp = Eg:12
        response.send(temp)
    });
});

async function register(params) {
    //API
    var result = await web3.sendRawTransaction(
        contractAddress, // '0x..6...8'
        "register(string,string,string)", //'register'
        params //array()
    ).catch((err) => { console.error(err) });
    // response will be undefined if the promise is rejected

    console.log('part 1 web3 sendRTx')
    console.log(typeof(result))
    console.log(result)

    var output = result.output; //result is a object, contains the transaction
    //0x000000000000000000000000000000000000000000000000000000000000000e
    if (output != '0x') {
        //decode
        var types = new Array();
        types.push('uint');
        var decodeResult = util.decodeParams(types, output);
        //Result { '0': '0', __length__: 1 }

        var index = decodeResult[0];
        // index = '0', typeof(index) = string
        console.log(typeof(index))
        if (index != "99999999")
            return { status: "ok", index: index };
        else return { status: "err" }
    } else return { status: "err", index: -1 };
}

app.post('/login', urlencodedParser, (request, response) => {
    console.log("主页 login-POST 请求");
    // 输入数据
    var name = request.body.name;
    var password = request.body.password;

    var params = new Array();
    params.push(name);
    params.push(password);

    //promise, get true/false
    const promise = login(params);
    promise.then(function(temp) {
        console.log('returns to js web: ' + JSON.stringify(temp));
        if (temp.boolValue) //if success login in, record the name
            currentUserName = name;
        // console.log(typeof(JSON.stringify(temp)));
        response.send(temp)
    });
});

async function login(params) {
    var result = await web3.sendRawTransaction(
        contractAddress,
        "login(string,string)",
        params
    ).catch((err) => { console.error(err) });
    console.log('part 1 web3 sendRTx');

    var output = result.output;
    if (output != '0x') {
        var types = new Array();
        types.push('bool');
        var decodeResult = util.decodeParams(types, output);
        return { status: "ok", boolValue: decodeResult[0] }
    } else return { status: "err", boolValue: false };
}
// func1,buyGoods
app.post('/func1', urlencodedParser, (request, response) => {
    console.log("主页 func1-POST 请求");
    // 输入数据
    var buyer = currentUserName
    var seller = request.body.seller;
    var amount = parseInt(request.body.amount)
    console.log(typeof(amount))
    var time = parseInt(request.body.time)
    var info = request.body.info;

    var params = new Array();
    params.push(buyer);
    params.push(seller);
    params.push(amount);
    params.push(time);
    params.push(info);

    console.log(params)
        //promise, get true/false
    const promise = func1(params);
    promise.then(function(temp) {
        console.log('returns to js web: ' + JSON.stringify(temp));
        response.send(temp)
    });
});

async function func1(params) {
    var functionName = "buyGoods(string,string,uint256,uint256,string)"
    var item = {
        "constant": false,
        "inputs": [{
            "name": "buyer",
            "type": "string"
        }, {
            "name": "seller",
            "type": "string"
        }, {
            "name": "money",
            "type": "uint256"
        }, {
            "name": "daysAfter",
            "type": "uint256"
        }, {
            "name": "information",
            "type": "string"
        }],
        "name": "buyGoods",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }

    return web3.sendRawTransaction(contractAddress, functionName, params).then(result => {
        let txHash = result.transactionHash;
        let status = result.status;
        let ret = {
            transactionHash: txHash,
            status: status
        };
        let output = result.output;
        if (output !== '0x') {
            ret.output = utils.decodeMethod(item, output);
            var index = ret.output[0] // {"0":"f"}
            if (index != 99999999) {
                return { status: "ok", index: index }
            } else return { status: "err", index: index }
        } else return { status: "Error", index: index }
            //   { transactionHash: '0xd96a1225c2d0d49d7b605661217a4ce34d36b5934e69c3359e50947e890459d3',
            //      status: '0x0',
            //      output: Result { '0': <BN: f> } }   //array

    });
}
// func2,transfer
app.post('/func2', urlencodedParser, (request, response) => {
    console.log("主页 func2-POST 请求");
    // 输入数据
    var from = currentUserName
    var to = request.body.to;
    var amount = parseInt(request.body.amount)

    var params = new Array();
    params.push(from);
    params.push(to);
    params.push(amount);

    console.log(params)
        //promise, get true/false
    const promise = func2(params);
    promise.then(function(temp) {
        console.log('returns to js web: ' + JSON.stringify(temp));
        response.send(temp)
    });
});

async function func2(params) {
    var functionName = "transferReceipt(string,string,uint256)"
    var item = {
        "constant": false,
        "inputs": [{
            "name": "company1",
            "type": "string"
        }, {
            "name": "company2",
            "type": "string"
        }, {
            "name": "money",
            "type": "uint256"
        }],
        "name": "transferReceipt",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }, {
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }

    return web3.sendRawTransaction(contractAddress, functionName, params).then(result => {
        let txHash = result.transactionHash;
        let status = result.status;
        let ret = {
            transactionHash: txHash,
            status: status
        };
        let output = result.output;
        if (output !== '0x') {
            ret.output = utils.decodeMethod(item, output);
            console.log(ret.output)
            var countReceipts = ret.output[0]
            var sum = ret.output[1]
            if (sum != 0) {
                console.log(sum + ' ' + typeof(sum))
                return { status: "ok", count: countReceipts, sum: sum }
            } else return { status: "err" }
        } else return { status: "Error" }
            //   { transactionHash: '0xd96a1225c2d0d49d7b605661217a4ce34d36b5934e69c3359e50947e890459d3',
            //      status: '0x0',
            //      output: Result { '0': <BN: f> } }   //array

    });
}
// func3 raisemoney
app.post('/func3', urlencodedParser, (request, response) => {
    console.log("主页 func3-POST 请求");
    // 输入数据
    var company = currentUserName
    var bank = request.body.bank;

    var params = new Array();
    params.push(company);
    params.push(bank);

    console.log(params)
        //promise, get true/false
    const promise = func3(params);
    promise.then(function(temp) {
        console.log('returns to js web: ' + JSON.stringify(temp));
        response.send(temp)
    });
});

async function func3(params) {
    var result = await web3.sendRawTransaction(
        contractAddress,
        "raiseMoney(string,string)",
        params
    ).catch((err) => { console.error(err) });
    console.log('part 1 web3 sendRTx');

    var output = result.output;
    console.log(result)
    var types = new Array();
    types.push('uint');
    types.push('uint');
    if (output != '0x') {
        var decodeResult = util.decodeParams(types, output);
        console.log(decodeResult)
        var count = decodeResult[0]
        var sum = decodeResult[1]
        if (count != 99999999 && sum != 0) {
            return { status: "ok", count: count, sum: sum }
        } else return { status: "err", sum: 0 }
    } else return { status: "Err" }; //invalid transaction
}

// function4,payback
app.get('/func4', (request, response) => {
    console.log("主页 func4-POST 请求");
    var company = currentUserName
    var params = new Array();
    params.push(company);

    const promise = func4(params);
    promise.then(function(temp) {
        console.log('returns to js web: ' + JSON.stringify(temp));
        response.send(temp)
    });
});

async function func4(params) {
    var result = await web3.sendRawTransaction(
        contractAddress,
        "payReceipt(string)",
        params
    ).catch((err) => { console.error(err) });
    console.log('part 1 web3 sendRTx');

    var output = result.output;
    console.log(result)
    var types = new Array();
    types.push('uint');
    types.push('uint');

    var status = ""
    if (output != '0x') {
        var decodeResult = util.decodeParams(types, output);
        var count = decodeResult[0]
        var sum = decodeResult[1]
        if (count != 99999999 && sum != 0) {
            return { status: "ok", count: count, sum: sum }
        } else return { status: "err", sum: 0 }
    }
    return { status: "err", count: 0, sum: 0 };

}


//get the receipt information
app.post('/getReicept', urlencodedParser, (request, response) => {
    console.log("receipt GET 请求");
    var ReceiptIndex = parseInt(request.body.index)
    console.log('received index = ' + ReceiptIndex)

    if (ReceiptIndex >= 0) {
        var params = new Array();
        params.push(ReceiptIndex);

        const promise = getReicept(params);
        promise.then(function(temp) {
            console.log('returns to js web: ' + JSON.stringify(temp));
            temp.index = ReceiptIndex
            response.send(temp)
        });
    }
});

async function getReicept(params) {
    var functionName = "getReceipt(uint256)"
    var item = {
        "constant": true, //true
        "inputs": [{
            "name": "i",
            "type": "uint256"
        }],
        "name": "getReceipt",
        "outputs": [{
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view", //!!nonpayable
        "type": "function"
    }


    return web3.call(contractAddress, functionName, params).then(result => {
        console.log(JSON.stringify(result.result))

        let txHash = result.transactionHash;
        let status = result.status;
        let ret = {
            transactionHash: txHash,
            status: status
        };
        let output = result.result.output;
        if (output !== '0x') {
            ret = utils.decodeMethod(item, output); //return array
            console.log(ret)
            if (ret[0] != "")
                return {
                    status: "ok",
                    from: ret[0],
                    to: ret[1],
                    type: ret[2],
                    amount: ret[3],
                    buildDate: ret[4],
                    dueDate: ret[5],
                    info: ret[6]
                }
            else return { status: "err" }
        }
    });
}
//4.监听端口号
app.listen(8080, function() {
    console.log('Server running at http://127.0.0.1:8080/');
});