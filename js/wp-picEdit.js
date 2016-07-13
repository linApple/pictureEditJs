(function($) {
    "use strict";
    if (typeof $ == "undefined") {
        console.log("未导入jq环境");
        return false;
    }

    function WpPicModel(id, url) {
        var picUrl = url;
        var mask = $("#" + id),
            pic = mask.find(".wp-pic");
        var pointData = {};
        var mouseDown = false; //是否按下的标志
        var hasMove = false; //点击按下后是否移动过标志
        var examData = [];
        var index = 0;
        var canMove = true;
        var selfEvent = {
            click: function(area) {

            },
            dblclick: function(area) {

            },
            hover: function(area) {

            }
        };

        function dataInit() {
            pointData = {
                picX: 0, //图片相对于父div的横坐标
                picY: 0, //图片相对于父div的纵坐标
                picW: pic.width(), //图片的原始大小
                picH: pic.height(),
                downX: 0, //鼠标按下时坐标位置，初始为0，取pageX,pageY
                downY: 0,
                maskX: mask.offset().left, //遮罩相对于windows的偏移量
                maskY: mask.offset().top,
                maskW: mask.width(),
                maskH: mask.height()
            };
        }

        function moveBorder() {
            for (var i in examData) {
                examData[i].redraw();
            }
        }


        mask.mousedown(function(event) {
            pointData.downX = event.pageX;
            pointData.downY = event.pageY;
            pointData.picX = pic.position().left;
            pointData.picY = pic.position().top;
            mouseDown = true;
            mask.find(".smallmask").remove();
        }).mouseup(function(event) {
            mouseDown = false;
            hasMove = false;
        }).mouseout(function() {
            if (mouseDown) {
                mouseDown = false;
                hasMove = false;
            }
        }).mousemove(function(event) {
            if (!canMove) {
                return false;
            }
            if (mouseDown) {
                if (!hasMove) {
                    if (Math.pow((event.pageX - pointData.downX), 2) + Math.pow((event.pageY - pointData.downY), 2) >= 9) {
                        hasMove = true;
                    }
                }!event.preventDefault || event.preventDefault();
                pic.css("left", pointData.picX + event.pageX - pointData.downX)
                    .css("top", pointData.picY + event.pageY - pointData.downY);
                moveBorder();
            }
        });

        /***********鼠标滑轮监听***********/
        if (mask.get(0).addEventListener)
            mask.get(0).addEventListener('DOMMouseScroll', wheel, false);
        mask.get(0).onmousewheel = mask.get(0).onmousewheel = wheel;

        function wheel(event) {
            var delta = 0;
            if (!event)
                event = window.event;
            if (event.wheelDelta) {
                delta = event.wheelDelta / 120;
            } else if (event.detail) {
                delta = -event.detail / 3;
            }
            if (delta) {
                delta > 0 ? PicModel.prototype.Large() : PicModel.prototype.Less();
            }
            if (event.preventDefault)
                event.preventDefault();
            event.returnValue = false;
        }


        function PicModel() {

        }

        function AreaModel(positionArr, data, index) {
            this.order = index;
            this.position = positionArr;
            this.num = 0;
            this.data = data;
            this.click = false;
            this.div = [], this.hoverDiv = [], this.clickDiv = [];
            var that = this;
            var isdbClick = false;
            for (var i in this.position) {
                this.div[i] = $("<div></div>")
                    .width(this.position[i].w)
                    .height(this.position[i].h)
                    .addClass("areamask")
                    .css({
                        position: 'absolute',
                        left: this.position[i].x,
                        top: this.position[i].y
                    });
                this.hoverDiv[i] = $("<div></div>").css({
                    width: '100%',
                    height: '100%',
                    display: 'none'
                });
                this.clickDiv[i] = this.hoverDiv[i].clone();
                mask.append(this.div[i]);
                this.div[i].append(this.hoverDiv[i]).append(this.clickDiv[i]);
                this.div[i].click(function() {
                    return function() {
                        var o = i;
                        setTimeout(function() {
                            if (!isdbClick) {
                                if (!hasMove) {
                                    var j = 0;
                                    while (j < that.position.length) {
                                        that.hoverDiv[j].hide();
                                        that.click ? that.clickDiv[j].fadeOut() : that.clickDiv[j].fadeIn();
                                        j++;
                                    }
                                    that.click = !that.click;
                                    that.num = o;
                                    selfEvent.click(that);
                                } else {
                                    hasMove = false;
                                }
                            }
                        }, 200);
                    }
                }()).dblclick(function() {
                    var o = i;
                    return function() {
                        isdbClick = true;
                        var j = 0;
                        while (j < that.position.length) {
                            that.clickDiv[j].fadeOut();
                            j++;
                        }
                        selfEvent.dblclick(that);
                    }
                }()).mouseover(function() {
                    if (!that.click) {
                        var j = 0;
                        while (j < that.position.length) {
                            that.hoverDiv[j].show();
                            j++;
                        }
                    }
                }).mouseout(function() {
                    var j = 0;
                    while (j < that.position.length) {
                        that.hoverDiv[j].hide();
                        j++;
                    }
                });
            }

        }

        AreaModel.prototype.getCurrentPosition = function() {
            var xPercent = pic.width() / pointData.picW,
                yPercent = pic.height() / pointData.picH;
            var positions = [];
            for (var i in this.position) {
                positions.push({
                    x: pic.offset().left + xPercent * this.position[i].x,
                    y: pic.offset().top + yPercent * this.position[i].y,
                    w: xPercent * this.position[i].w,
                    h: yPercent * this.position[i].h
                });
            }
            return positions;
        }
        AreaModel.prototype.next = function() {
            if (this.order < examData.length - 1) {
                return examData[this.order + 1];
            }
            return false;
        }
        AreaModel.prototype.prev = function() {
            if (this.order > 0) {
                return examData[this.order - 1];
            }
            return false;
        }
        AreaModel.prototype.location = function(arg) { //center,top
            index = this.order;
            var r = this.getCurrentPosition();
            r = r[this.num];
            var percent;
            if (pointData.maskW >= r.w && pointData.maskH >= r.h) { //放大percent>1
                percent = pointData.maskW / r.w < pointData.maskH / r.h ? pointData.maskW / r.w : pointData.maskH / r.h;
            } else { //缩小percent<1
                percent = r.w / pointData.maskW > r.h / pointData.maskH ? pointData.maskW / r.w : pointData.maskH / r.h;
            }
            var disW = (percent - 1) * pic.width(),
                disH = (percent - 1) * pic.height();
            pic.width(pic.width() + disW);
            var targetX,
                targetY;
            if (arg == "center") {
                targetX = pointData.maskX + (pointData.maskW - r.w * percent) / 2;
                targetY = pointData.maskY + (pointData.maskH - r.h * percent) / 2;
            } else if (arg == "top") {
                targetX = pointData.maskX;
                targetY = pointData.maskY;
            }
            pic.css("left", pic.position().left + targetX - (r.x - pic.offset().left) * percent - pic.offset().left)
                .css("top", pic.position().top + targetY - (r.y - pic.offset().top) * percent - pic.offset().top);
            moveBorder();
            return this;
        }

        AreaModel.prototype.onlyShow = function() {
            var r = this.getCurrentPosition();
            r = r[this.num];
            var div = $("<div></div>")
                .addClass("smallmask")
                .css({ position: 'absolute', 'background-color': 'white' });
            if (r.x > pointData.maskX) {
                mask.append(div.clone().css("left", 0).css("top", 0).width(r.x - pointData.maskX).height(pointData.maskH));
            }
            if (r.y > pointData.maskY) {
                mask.append(div.clone().css("left", 0).css("top", 0).width(pointData.maskW).height(r.y - pointData.maskY));
            }
            if (pointData.maskX + pointData.maskW > r.x + r.w) {
                mask.append(div.clone().css("left", r.x + r.w - pointData.maskX).css("top", 0).width(pointData.maskX + pointData.maskW - r.x - r.w).height(pointData.maskH));
            }
            if (pointData.maskY + pointData.maskH > r.y + r.h) {
                mask.append(div.clone().css("left", 0).css("top", r.y + r.h - pointData.maskY).width(pointData.maskW).height(pointData.maskY + pointData.maskH - r.y - r.h));
            }
            return this;
        }


        AreaModel.prototype.redraw = function() {
            var r = this.getCurrentPosition();
            var j = -1;
            while (++j < this.position.length) {
                this.div[j].width(r[j].w)
                    .height(r[j].h)
                    .css("left", r[j].x - pointData.maskX)
                    .css("top", r[j].y - pointData.maskY);
            }

        }

        PicModel.prototype.initData = function() {
            if (picUrl) {
                var newPic = $("<img>").addClass("wp-pic");
                pic.parent().html(newPic);
                pic = newPic;
                pic.attr("src", picUrl);
            }
            pic.width() == 0 ? pic.load(dataInit) : dataInit(); //保证能获取图片数据
        }
        PicModel.prototype.Large = function() {
            var addWidth = 0.25 * pic.width(),
                addHeight = 0.25 * pic.height();
            pic.css("left", pic.position().left - addWidth / 2)
                .css("top", pic.position().top - addHeight / 2)
                .width(pic.width() + addWidth);
            moveBorder();
            return this;
        }
        PicModel.prototype.Less = function() {
            if (pic.width() <= pointData.picW) {
                return false;
            }
            var reduWidth = 0.2 * pic.width(),
                reduHeight = 0.2 * pic.height();
            pic.css("left", pic.position().left + reduWidth / 2)
                .css("top", pic.position().top + reduHeight / 2)
                .width(pic.width() - reduWidth);
            moveBorder();
            return this;
        }

        PicModel.prototype.add = function(positionArr, data) {
            examData.push(new AreaModel(positionArr, data, examData.length));
            return this;
        }

        PicModel.prototype.getArea = function(pageX, pageY) {
            var startX, startY, w, h;
            var xPercent = pic.width() / pointData.picW;
            var yPercent = pic.height() / pointData.picH;
            var picX = pic.offset().left,
                picY = pic.offset().top;
            var position;
            for (var i in examData) {
                position = examData[i].position;
                startX = picX + xPercent * position.x;
                startY = picY + yPercent * position.y;
                if (pageX >= startX && pageX <= startX + xPercent * position.w) {
                    if (pageY >= startY && pageY <= startY + yPercent * position.h) {
                        return examData[i];
                    }
                }
            }
            return false;
        }

        PicModel.prototype.maxSize = function(w, h) {
            var percent = pic.width() / w > pic.height() / h ? w / pic.width() : h / pic.height();
            percent >= 1 || pic.width(pic.width() * percent);
            return this;
        }

        PicModel.prototype.change = function(url, picData) {
            picUrl = url;
            this.setPicData(picData);
            return this;
        }

        PicModel.prototype.setPicData = function(picData) {
            examData = [];
            if (picData) {
                for (var i in picData) {
                    this.add(picData[i].position, picData[i].data);
                }
            }
            return this;
        }

        PicModel.prototype.getCurrentArea = function() {
            if (index >= 0 && index < examData.length) {
                return examData[index];
            }
        }

        PicModel.prototype.setEvent = function(type, callback) {
            selfEvent[type] = callback;
            return this;
        }
        PicModel.prototype.setAreaDiv = function(fc) {
            var style;
            for (var i in examData) {
                style = fc(examData[i]);
                var k = -1;
                while (++k < examData[i].position.length) {
                    examData[i].clickDiv[k].css(style.click.css).addClass(style.click.classes);
                    examData[i].hoverDiv[k].css(style.hover.css).addClass(style.hover.classes);
                }

                var ele;
                for (var j in style.click.inner) {
                    ele = style.click.inner[j];
                    examData[i].clickDiv[0].append($(ele.html).css(ele.css).addClass(ele.classes).click(function() {
                        var area = examData[i];
                        var ele2 = ele;
                        return function(event) {
                            ele2.event(area);
                            event.stopPropagation();
                        }
                    }()));

                }
                for (var j in style.hover.inner) {
                    ele = style.hover.inner[j];
                    examData[i].hoverDiv[0].append($(ele.html).css(ele.css).addClass(ele.classes).click(function() {
                        var area = examData[i];
                        var ele2 = ele;
                        return function(event) {
                            ele2.event(area);
                            event.stopPropagation();
                        }
                    }()));

                }
            }
            return this;
        }

        PicModel.prototype.positionChange = function() {
            pointData.maskX = mask.offset().left;
            pointData.maskY = mask.offset().top;
        }
        PicModel.prototype.setMove = function(m) {
            canMove = m;
        }
        var model = new PicModel();
        model.initData();
        return model;
    }


    window.WpPicModel = WpPicModel;

}(jQuery));
