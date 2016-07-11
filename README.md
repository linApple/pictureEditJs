#图片插件
###使用说明
1.引入文件

	<link rel="stylesheet" type="text/css" href="css/css.css">
	<script type="text/javascript" src="js/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="js/wp-picEdit.js"></script>
	transparent.png//透明图片，css用到，用于ie下的事件穿透触发

2.具体使用

	var model = WpPicModel("test1", "test.jpg");//获得picModel模型
	var data1 = [{
        position: {//题目相对于试卷的位置坐标以及宽高，单位px
            x: 40,
            y: 440,
            w: 450,
            h: 60
        },
        data: {
            title: "选择题一"
        }
    }, {
        position: {
            x: 40,
            y: 500,
            w: 450,
            h: 60
        },
        data: {
            title: "选择题二"
        }
    }, {
        position: {
            x: 40,
            y: 565,
            w: 450,
            h: 60
        },
        data: {
            title: "选择题三"
        }
    }, {
        position: {
            x: 40,
            y: 620,
            w: 450,
            h: 60
        },
        data: {
            title: "选择题四"
        }
    }, {
        position: {
            x: 500,
            y: 330,
            w: 450,
            h: 100
        },
        data: {
            title: "选择题九"
        }
    }];

    model.setPicData(data1)//设置图片相关数据
        .setEvent("click", function(area) {//点击图片上题目区域触发的点击事件
            console.log(area.data);
            //area.location("center").onlyShow();
        })
        .setEvent("dblclick", function(area) {//双击事件
            area.location("top");
        })
        .setAreaDiv(function(area) {//设置鼠标移入和点击题目区域时显示的选中样式
            var areaStyle = {
                css: {
                    border: "1px solid red"
                },//无样式写{}
                inner: [{//无内置元素写[]
                    html: "<input type='checkbox'>",
                    css: {
                        float: "left"
                    },
                    event: function(area) {
                        console.log("checkbox");
                        console.log(area.data);
                    }
                }, {
                    html: "<span>编辑1</span>",
                    css: {
                        float: "right",
                        background: "green"
                    },
                    event: function(area) {
                        console.log("编辑1");
                        console.log(area.data);
                    }
                }, {
                    html: "<span>编辑2</span>",
                    css: {
                        float: "right",
                        background: "blue"
                    },
                    event: function(area) {
                        console.log("编辑2");
                        console.log(area.data);
                    }
                }]
            };
            return {
                click:areaStyle,
                hover:areaStyle
            };
        });

3.方法说明              
有两个对象PicModel 和 AreaModel，     
PicModel就是var model = WpPicModel("test1", "test.jpg");               
AreaModel就是function(area){}

PicModel              
>>PicModel.prototype.Large = function() {  图片放大            
PicModel.prototype.Less = function() {   图片缩小 		
PicModel.prototype.add = function(x, y, w, h, data) {加入题目信息	
PicModel.prototype.getArea = function(pageX, pageY) {根据坐标获取当前区域的题目对象，如果没有当前区域的areaModel返回false 	
PicModel.prototype.change = function(url, picData) {变更图片	
PicModel.prototype.setPicData = function(picData) {设置图片数据	
PicModel.prototype.getCurrentArea = function() {获取本次操作选中的areaModel	
PicModel.prototype.setEvent = function(type, callback) {设置题目区域的点击事件click/dblclick	
PicModel.prototype.setAreaDiv = function(fc) {设置题目区域移入和点击的显示样式	
PicModel.prototype.positionChange = function() {当图片外面的框的位置发生变化时需调用此方法	
PicModel.prototype.setMove = function(m) {设置图片是否可移动          	
	
AreaModel
>>AreaModel.prototype.getCurrentPosition = function() {获取当前区域的实际位置信息{x,y,w,h}    
AreaModel.prototype.next = function() {获取下一个areaModel			
AreaModel.prototype.prev = function() {获取上一个areamodel			
AreaModel.prototype.location = function(arg) { //center,top定位		
AreaModel.prototype.onlyShow = function() {只显示当前选中区域		
