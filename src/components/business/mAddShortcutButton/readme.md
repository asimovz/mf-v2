## 模板使用说明 ##

快捷按钮和设置中的固定按钮总和不能超过10个

在HTML中引用：
<add-shortcutbutton :data="addBTNData" />

具体数据说明：
addBTNData = []

1、“回复按钮”
{"type":"reply","description":""}
2、“跳转按钮”
{"type":"url","description":"","url":""}
3、“打开app按钮”
{"type":"openApp","description":"","url":"","openAppAndroid":"","openAppIos":""}
4、“打电话按钮”
{"type":"call","description":"","url":"","phoneNum":""}
5、“发送地址按钮”
{"type":"sendAddress","description":""}
6、“地址定位按钮”
{{"type":"addressLocation","description":"","sendAddressPlaceName":"","sendAddressLongitude":"","sendAddressLatitude":""}}
7、“拍摄按钮”
{"type":"screen","description":"","targetContact":""}
8、“调起指定联系人”
{"type":"bringUp","description":"","targetContact":"","presendContent":""}


