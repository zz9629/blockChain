window.onload = function() {

    document.querySelector('.img__btn').addEventListener('click', function() {
        document.querySelector('.content').classList.toggle('s--signup')
    })

    initialize()

    $("#login_button").click(function() {
        login();
    });
    $("#reg_button").click(function() {
        register();
    });
}

var name = "";

function initialize() {
    $("#header").hide();
}

function register() {
    if (isValidForRegister()) {
        $.ajax({
            url: '/register',
            type: 'post',
            dataType: 'json',
            data: $('#reg_form').serialize(),
            success: function(result) {
                //打印服务端返回的数据(调试用)
                console.log(result)
                if (result.status == "ok") {
                    console.log('register success!index = ' + result.index);
                    var a = confirm("Register success! maybe you wanna log in now?");
                    if (true == a) {
                        location.reload();
                    }

                } else {
                    console.log('register failed!');
                    alert('register failed!');
                }
            },
            error: function(err) {
                console.log('failed to get post-returns!')
            }
        });
    }
}

function isValidForRegister() {
    //获取name和pw
    var name = $("#name_reg").val();
    var pw = $("#pw_reg").val();
    var type = $("#type_reg").val();

    //检验是否合法
    if (name == "" || pw == "") {
        alert("Please input name and password!")
        console.log('invalid input.');
        return false;
    }
    if (type != "0" && type != "1") {
        alert("Please input 0/1 as organisation type!")
        console.log('invalid input.');
        return false;
    }
    return true;
}

function login() {
    var name = $("#name_login").val();
    var pw = $("#pw_login").val();
    //检验是否合法
    if (name == "" || pw == "") {
        alert("Please input name and password!")
        console.log('invalid input.');
    }
    var flag = false;
    $.ajax({
        url: '/login',
        type: 'post',
        dataType: 'json',
        data: $('#login_form').serialize(),
        success: function(result) {
            //打印服务端返回的数据(调试用)
            flag = result.boolValue
            if (flag) {
                // 进入menu()
                menu();
                console.log('login success! = ' + flag);

            } else
                console.log('login failed!');
        },
        error: function(err) {
            console.log('failed to get post-returns!')
        }
    });
}

function menu() {
    //显示功能界面
    window.location.href = "menu.html"
}