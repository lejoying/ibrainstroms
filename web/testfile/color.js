$(document).ready(function() {
    ShowColorControl("test");
    //绑定控件 调用此函数实现调用调色板
    function ShowColorControl(controlId)
    {
        $("#" + controlId).bind("click", OnDocumentClick);
    }
//<div id="colorpanel" style="position:absolute;display:none;width:253px;height:177px;"></div> 在页面中加载此HTML
    var ColorHex = new Array('00', '33', '66', '99', 'CC', 'FF');
    var SpColorHex = new Array('FF0000', '00FF00', '0000FF', 'FFFF00', '00FFFF', 'FF00FF');
    var current = null;

//初始化调色板
    function initPanel() {
        var colorTable = '';
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 6; j++) {
                colorTable = colorTable + '<tr style="height:12px;">'
                colorTable = colorTable + '<td  style="width=11px;height:12px;background-color:#000000">'
                if (i == 0) {
                    colorTable = colorTable + '<td style="width=11px;height:12px;background-color:#' + ColorHex[j] + ColorHex[j] + ColorHex[j] + '">'
                }
                else {
                    colorTable = colorTable + '<td style="width=11px;height:12px;background-color:#' + SpColorHex[j] + '">'
                }
                colorTable = colorTable + '<td style="width=11px;height:12px;background-color:#000000">'
                for (var k = 0; k < 3; k++) {
                    for (var l = 0; l < 6; l++) {
                        colorTable = colorTable + '<td style="width=11px;height:12px;background-color:#' + ColorHex[k + i * 3] + ColorHex[l] + ColorHex[j] + '">'
                    }
                }
            }
        }
        colorTable = '<table width=253 border="0" cellspacing="0" cellpadding="0" style="border:1px #000000 solid;border-bottom:none;border-collapse: collapse" bordercolor="000000">'
            + '<tr height="30px"><td colspan=21 bgcolor=#cccccc>'
            + '<table cellpadding="0" cellspacing="1" border="0" style="border-collapse: collapse">'
            + '<tr><td width="3"><td><input type="text" id="DisColor" size="6" disabled style="border:solid 1px #000000;background-color:#ffff00"></td>'
            + '<td width="3"><td><input type="text" id="HexColor" size="7" style="border:inset 1px;font-family:Arial;" value="#000000"></td><td align="right" width="100%"><span id="spnClose" style="cursor:hand;">Ⅹ</span>&nbsp;</td></tr></table></td></table>'
            + '<table  width=253  id="tblColor" border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse" bordercolor="000000"  style="cursor:hand;">'
            + colorTable + '</table>';
        $("#colorpanel").html(colorTable);
        $("#tblColor").bind("mouseover", doOver);
        $("#tblColor").bind("mouseout", doOut);
        $("#tblColor").bind("click", doclick);
        $("#spnClose").bind("click", function() { $("#colorpanel").css("display","none"); });
    }

//鼠标覆盖事件
    function doOver(event) {

        var e = $.event.fix(event);
        var element = e.target;
        if ((element.tagName == "TD") && (current != element)) {

            if (current != null) { current.style.backgroundColor = current.style.background; }
            element.style.background = element.style.backgroundColor;
            $("#DisColor").css("backgroundColor", element.style.backgroundColor);
            var clr = element.style.backgroundColor.toUpperCase();
            if (clr.indexOf('RGB') > -1) {
                clr = clr.substring(clr.length - 18);
                clr = rgb2hex(clr);
            }
            $("#HexColor").val(clr);
            //element.style.backgroundColor = "white";
            current = element;
        }
    }
//鼠标移开事件
    function doOut(event) {
        if (current != null) current.style.backgroundColor = current.style.background.toUpperCase();
    }
//鼠标点击事件
    function doclick(event) {
        var e = $.event.fix(event);
        if (e.target.tagName == "TD") {
            var clr = e.target.style.background;
            clr = clr.toUpperCase();
            if (targetElement) {
                if (clr.indexOf('RGB') > -1) {
                    clr = clr.substring(clr.length - 18);
                    clr = rgb2hex(clr);
                }
                targetElement.value = clr;
            }
            DisplayClrDlg(false, e);
            return clr;
        }
    }

    var targetElement = null;
    function OnDocumentClick(event) {
        var e = $.event.fix(event);
        var srcElement = e.target;
//    if (srcElement.alt == "clrDlg") {
        targetElement = srcElement;
        DisplayClrDlg(true, e);
//    }
//    else {
//        while (srcElement && srcElement.id != "colorpanel") {
//            srcElement = srcElement.parentElement;
//        }
//        if (!srcElement) {
//            DisplayClrDlg(false, e);
//        }
//    }
    }

//显示颜色对话框
//display 决定显示还是隐藏
//自动确定显示位置
    function DisplayClrDlg(display, event) {

        var clrPanel = $("#colorpanel");
        if (display) {
            var left = document.body.scrollLeft + event.clientX;
            var top = document.body.scrollTop + event.clientY;
            if (event.clientX + clrPanel.width > document.body.clientWidth) {
                //对话框显示在鼠标右方时，会出现遮挡，将其显示在鼠标左方
                left -= clrPanel.width;
            }
            if (event.clientY + clrPanel.height > document.body.clientHeight) {
                //对话框显示在鼠标下方时，会出现遮挡，将其显示在鼠标上方
                top -= clrPanel.height;
            }

            clrPanel.css("left", left);
            clrPanel.css("top", top);
            clrPanel.css("display", "block");
        }
        else {
            clrPanel.css("display", "none");
        }
    }

    $(document).ready(function() {
        initPanel();
    });

//RGB转十六进制颜色值
    function zero_fill_hex(num, digits) {
        var s = num.toString(16);
        while (s.length < digits)
            s = "0" + s;
        return s;
    }

    function rgb2hex(rgb) {
        if (rgb.charAt(0) == '#')
            return rgb;
        var n = Number(rgb);
        var ds = rgb.split(/\D+/);
        var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
        return "#" + zero_fill_hex(decimal, 6);
    }

});