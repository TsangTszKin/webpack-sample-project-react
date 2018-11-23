function check(){//这里是函数定义，必须调用才会运行里面的代码，用于检查数据；此处应该写在代码的对前面
    var isOk = true;
    if( !$('dbf.number3').number())
    {
        alert("请输入正确的共计时长");
        isOk = false;
    }


    if((new Date($('dbf.time0').value()).getTime())>(new Date($('dbf.time1').value()).getTime()))
    {
        alert("开始时间＞结束时间，请重新输入");
        isOk = false;
    }

    if($('dbf.text5').value()=="年假")
    {
        $('temp').value(ajax('catalogue1.aspx?name=form.fieldScalar&sql=select AnnualLeaveDays from userX where sid='+$('dbf.operator').attribute('dbf.key')));
        if($('dbf.number3').number()>$('temp').number())
        {alert("年假不足");
            isOk = false;
        }
    }
    if($('dbf.text5').value()=="调休")
    {
        $('temp').value(ajax('catalogue1.aspx?name=form.fieldScalar&sql=select leaveDays from userX where sid='+$('dbf.operator').attribute('dbf.key')));
        if($('dbf.number3').number()>$('temp').number())
        {
            alert("调休时长不足");
            isOk = false;
        }
    }


    if((new Date('{!session.variable('today')}').getTime())-(new Date($('dbf.time0').value()).getTime())>777600000)
    {
        alert("开始日期为10天前，禁止填报");
        //一天相差86400000，看着改这个时间即可
        isOk = false;
    }

    if(($('dbf.time0').value().indexOf(':')<0 )||($('dbf.time1').value().indexOf(':')<0 ))
    {
        alert("请输入正确的时间日期 yyyy/MM/dd hh:mm:ss");
        isOk = false;
    }
    return isOk
}



if (!check()){
    alert("数据不通过....");
}

