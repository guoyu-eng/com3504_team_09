function updateName(name) {
    //弹出对话框，要求用户输入新的Name信息
    let newName = prompt("请输入新的名称：", name);
    if (newName == null) {
        return;  //如果用户点击取消，则返回原本界面
    }

    //通过AJAX请求将新的Name信息传递到后端进行比对和修改操作
    $.ajax({
        url: "/updateName",  //请求的URL地址
        type: "POST",  //请求方式为POST
        data: { name: newName },  //要传递的数据
        success: function (result) {
            //如果修改成功，则将Name属性值更新为用户输入的值
            if (result == "success") {
                document.getElementById("name").innerText = newName;
            } else {
                alert("输入的名称有误，请重新输入！"); //如果输入的名称有误，则提示用户重新输入
            }
        }
    });
}
