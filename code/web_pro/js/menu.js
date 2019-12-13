$.ajax({
    url: '/getname',
    type: 'get',
    dataType: 'json',
    success: function(currentUser) {
        //打印服务端返回的数据(调试用)
        var name = currentUser.name
        if (name == "") {
            console.log('Please log in! ');
        } else {
            $("#welcomeText").append(name + '!');
            console.log('current user :' + name);
        }
    },
    error: function(err) {
        console.log('failed to get post-returns!')
    }
});

$("#receipt").hide()


$("#func1_buttom").click(function() {
    func1();
});

$("#func2_buttom").click(function() {
    func2();
});

$("#func3_buttom").click(function() {
    func3();
});

$("#func4_buttom").click(function() {
    func4();
});

$("#func5_button").click(function() {
    // console.log("fdgsdfgs")
    func5();
});

function func1() {
    if (isValidForfunc1()) {
        $.ajax({
            url: '/func1',
            type: 'post',
            dataType: 'json',
            data: $('#func1_form').serialize(),

            success: function(result) {
                //打印服务端返回的数据(调试用)
                if (result.status == "ok") {
                    result.index = '0x' + result.index
                    $("#resultText").html('buyGoods success! Receipt index : ' + parseInt(result.index));
                    console.log();
                } else
                    $("#resultText").html('buyGoods failed!');
                console.log();
            },
            error: function(err) {
                $("#resultText").html('failed to get post-returns!');
                console.log('failed to get post-returns!')
            }
        });
    }
}

function isValidForfunc1() {
    //获取name/amount/time/info
    var seller = $("#func1_seller").val();
    var amount = $("#func1_amount").val();
    var time = $("#func1_delaytime").val();
    var info = $("#func1_info").val();

    //检验是否合法
    if (seller == "") {
        alert("Please input seller name!")
        console.log('invalid input.');
        return false;
    }
    if (amount <= 0 || time <= 0) {
        alert("Please input amount and delay time for payback!")
        console.log('invalid input.');
        return false;
    }
    return true;
}

function func2() {
    if (isValidForfunc2()) {
        $.ajax({
            url: '/func2',
            type: 'post',
            dataType: 'json',
            data: $('#func2_form').serialize(),
            success: function(result) {
                //打印服务端返回的数据(调试用)
                if (result.status == "ok") {
                    var count = parseInt('0x' + result.count);
                    var sum = parseInt('0x' + result.sum);

                    $("#resultText").html('transfer recipt success! count:' + count + 'total Amount: ' + sum)
                    console.log('transfer recipt success! count: ' + count + 'total Amount: ' + sum);
                } else {
                    $("#resultText").html('transfer recipt failed!')
                    console.log('transfer recipt failed!');
                }

            },
            error: function(err) {
                $("#resultText").html('failed to get post-returns!')
                console.log('failed to get post-returns!')
            }
        });
    }
}

function isValidForfunc2() {
    //获取name/amount/time/info
    var to = $("#func2_to").val();
    var amount = $("#func2_amount").val();

    //检验是否合法
    if (to == "") {
        alert("Please input a company name!")
        console.log('invalid input.');
        return false;
    }
    if (amount <= 0) {
        alert("Please input a valid amount !")
        console.log('invalid input.');
        return false;
    }
    return true;
}

// func3:raiseMoney
function func3() {
    if (isValidForfunc3()) {
        $.ajax({
            url: '/func3',
            type: 'post',
            dataType: 'json',
            data: $('#func3_form').serialize(),
            success: function(result) {
                //打印服务端返回的数据(调试用)
                if (result.status == "ok") {
                    $("#resultText").html('raiseMoney success!Receipt count: ' + result.count + ' total amount: ' + result.sum);
                    console.log('raiseMoney success!Receipt count: ' + result.count + ' total amount: ' + result.sum);
                } else {
                    $("#resultText").html('raiseMoney failed!');
                    console.log('raiseMoney failed!');
                }

            },
            error: function(err) {
                $("#resultText").html('failed to get post-returns!')
                console.log('failed to get post-returns!')
            }
        });
    } else {
        alert("Please input bank name!")
        console.log('invalid input.');
    }
}

function isValidForfunc3() {
    //获取name/amount/time/info
    var bank = $("#func3_bank").val();
    //检验是否合法
    if (bank == "") {

        return false;
    }
    return true;
}

// func4:payReceipt
function func4() {
    $.ajax({
        url: '/func4',
        type: 'get',
        dataType: 'json',
        success: function(result) {
            //打印服务端返回的数据(调试用)
            if (result.status == "ok") {
                $("#resultText").html('payReceipt success!Receipt count = ' + result.count + ', total amount = ' + result.sum);
                console.log('payReceipt success!Receipt count = ' + result.count + ', total amount = ' + result.sum);
            } else {
                $("#resultText").html('payReceipt failed!');
                console.log('payReceipt failed!');
            }
        },
        error: function(err) {
            $("#resultText").html('failed to get post-returns!')
            console.log('failed to get post-returns!')
        }
    });
}

function func5() {
    if (isValidForfunc5) {
        $("#result").hide()
        $("#receipt").show()
        $.ajax({
            url: '/getReicept',
            type: 'post',
            dataType: 'json',
            data: $('#func5_form').serialize(),
            success: function(result) {
                //打印服务端返回的数据(调试用)
                console.log(result);
                if (result.status == "ok") {
                    console.log('success to get receipt!');

                    showReceipt(result);


                } else console.log('failed to get receipt!');
            },
            error: function(err) {
                console.log('failed to get post-returns!')
            }
        });
    } else {
        alert("Please input number which is not negative!")
        console.log('invalid input.')
    }
}

function isValidForfunc5() {
    //获取name/amount/time/info
    var index = $("#func5_index").val()
        //检验是否合法
    if (index == "") {
        return false
    }
    return true
}

function showReceipt(result) {
    $('#receiptHead').html('Receipt: 0x' + result.index)
    console.log(result)
    var txt1 = $("<p></p>").text("From: " + result.from);
    var txt2 = $("<p></p>").text("To: " + result.to);
    var txt3 = $("<p></p>").text("Receipt Type: " + result.type);
    result.amount = '0x' + result.amount
    var txt4 = $("<p></p>").text("Receipt Amount: " + parseInt(result.amount));
    var txt5 = $("<p></p>").text("buildDate: " + result.buildDate);
    var txt6 = $("<p></p>").text("dueDate: " + result.dueDate);
    var txt7 = $("<p></p>").text("extra information: " + result.info);
    $("#textBox").empty()

    $("#textBox").append(txt1, txt2, txt3, txt4, txt5, txt6, txt7); // 追加新元素

}