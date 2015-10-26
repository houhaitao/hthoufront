define(["avalon","domReady!"], function(avalon) {
    var widget = avalon.ui.button = function(element, data, vmodels) {
        var vmodel = avalon.define(data.buttonId, function(vm) {

            vm.$init = function() {//初始化组件的界面，最好定义此方法，让框架对它进行自动化配置

                $(element).addClass("btn-ripple");
                $(element).click(function(ev){
                    var evY = ev.offsetY;
                    var evX = ev.offsetX;
                    var height = $(element).outerHeight();
                    var width = $(element).outerWidth();
                    var size = width > height ? width : height;

                    var top = evY - size /2;
                    var left = evX - size /2;



                    if($(".btn-ink", element).length === 0){
                        $("<div class='btn-ink'></div>").appendTo(element).on("webkitAnimationEnd animationend", function(){
                            $(this).removeClass("btn-ink-animate")
                        });
                    }

                    $(".btn-ink", element).css({width:size, height:size, position:"absolute", top:top, left:left}).addClass("btn-ink-animate")
                })

                avalon.scan(element, [vm].concat(vmodels));
            }


            vm.$remove = function() {//清空构成UI的所有节点，最好定义此方法，让框架对它进行自动化销毁
                element.innerHTML =  ""
            }
            //其他属性与方法
        })
        return vmodel//必须返回组件VM
    }
    widget.defaults = {

    }
    return avalon;
})
