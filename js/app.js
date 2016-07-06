$(function() {
    "use strict";

    function WpPicModel(id) {
        var mask = $("#" + id),
            pic = mask.find(".wp-pic");
        var pointData = {};

        function dataInit() {
            pointData = {
                picX: pic.position().left, //图片相对于父div的横坐标
                picY: pic.position().top, //图片相对于父div的纵坐标
                picW: pic.width(), //图片的原始大小
                picH: pic.height(),
                downX: 0, //鼠标按下时坐标位置，初始为0，取pageX,pageY
                downY: 0,
                maskX: mask.offset().left, //遮罩相对于windows的偏移量
                maskY: mask.offset().top,
                maskW: mask.width(),
                maskH: mask.height()
            };
            console.log(pointData);
        }
        pic.width() == 0 ? pic.load(dataInit) : dataInit();//保证能获取图片数据

        var canMove = false;
        var positionData = []; //题目分布坐标信息
        mask.mousedown(function(event) {
            pointData.downX = event.pageX;
            pointData.downY = event.pageY;
            pointData.picX = pic.position().left;
            pointData.picY = pic.position().top;
            canMove = true;
        }).mouseup(function(event) {
            canMove = false;
            pointData.picX = pic.position().left;
            pointData.picY = pic.position().top;
        }).mouseout(function() {
            canMove = false;
            pointData.picX = pic.position().left;
            pointData.picY = pic.position().top;
        }).mousemove(function(event) {
            if (canMove) {
                if (event.preventDefault) {
                    event.preventDefault();
                }
                pic.css("left", pointData.picX + event.pageX - pointData.downX)
                    .css("top", pointData.picY + event.pageY - pointData.downY);
            }
        }).dblclick(function(event) {
            var r = model.inArea(event.pageX, event.pageY);
            if (r) {
                var percent;
                if (pointData.maskW >= r.w && pointData.maskH >= r.h) { //放大percent>1
                    percent = pointData.maskW / r.w < pointData.maskH / r.h ? pointData.maskW / r.w : pointData.maskH / r.h;
                } else { //缩小percent<1
                    percent = r.w / pointData.maskW > r.h / pointData.maskH ? pointData.maskW / r.w : pointData.maskH / r.h;
                }
                var disW = (percent - 1) * pic.width(),
                    disH = (percent - 1) * pic.height();
                pic.width(pic.width() + disW);
                var targetX = pointData.maskX + (pointData.maskW - r.w * percent) / 2,
                    targetY = pointData.maskY + (pointData.maskH - r.h * percent) / 2;
                pic.css("left", pic.position().left + targetX - (r.x - pic.offset().left) * percent - pic.offset().left)
                    .css("top", pic.position().top + targetY - (r.y - pic.offset().top) * percent - pic.offset().top);

            }
        });


        function PicModel() {

        }

        PicModel.prototype.setLarge = function(ele) {
            ele.click(function() {
                var addWidth = 0.25 * pic.width(),
                    addHeight = 0.25 * pic.height();
                pic.css("left", pic.position().left - addWidth / 2)
                    .css("top", pic.position().top - addHeight / 2)
                    .width(pic.width() + addWidth);
            });
            return this;
        }
        PicModel.prototype.setLess = function(ele) {
            ele.click(function() {
                var reduWidth = 0.2 * pic.width(),
                    reduHeight = 0.2 * pic.height();
                pic.css("left", pic.position().left + reduWidth / 2)
                    .css("top", pic.position().top + reduHeight / 2)
                    .width(pic.width() - reduWidth);
            });
            return this;
        }

        PicModel.prototype.add = function(x, y, w, h) {
            positionData.push({
                x: x,
                y: y,
                w: w,
                h: h
            });
            return this;
        }

        PicModel.prototype.inArea = function(pageX, pageY) {
            var startX, startY, w, h;
            var xPercent = pic.width() / pointData.picW;
            var yPercent = pic.height() / pointData.picH;
            var picX = pic.offset().left,
                picY = pic.offset().top;
            for (var i in positionData) {
                startX = picX + xPercent * positionData[i].x;
                startY = picY + yPercent * positionData[i].y;
                if (pageX >= startX && pageX <= startX + xPercent * positionData[i].w) {
                    if (pageY >= startY && pageY <= startY + yPercent * positionData[i].h) {
                        return {
                            x: startX, //当前状态的坐标和长宽
                            y: startY,
                            w: xPercent * positionData[i].w,
                            h: yPercent * positionData[i].h
                        };
                    }
                }
            }
            return false;
        }
        var model = new PicModel();
        return model;
    }



    var model = WpPicModel("test1");
    model.setLess($("#small")).setLarge($("#big"));
    model.add(40, 440, 490, 60)
        .add(40, 500, 490, 60);
});
