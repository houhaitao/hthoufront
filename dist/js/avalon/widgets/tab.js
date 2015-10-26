define(["avalon","domReady!"], function(avalon) {
    var widget = avalon.ui.tab = function(element, data, vmodels) {
        var vmodel = avalon.define(data.tabId, function(vm) {

            vm.current = 0;
            var tabcount = 0;
            var singlewidth = 0;
            var isIE6 = $("html").hasClass("ie6");

            vm.$init = function() {//初始化组件的界面，最好定义此方法，让框架对它进行自动化配置
                //$(element).addClass("ms-tab");
                $(".tabs li" ,element).append("<i class='underline'></i>");
                if($(element).data("tab-current")) vm.current = $(element).data("tab-current");
                tabcount = $(".tabs li" ,element).length;
                //detectWidth();
                $(".tabs" ,element).on("click", "li", function(event){
                    vm.current = $(event.delegateTarget.children).index(event.currentTarget);
                })

                changeTo(vm.current);

                //$(window).resize(function(){
                //    detectWidth();
                //});

                avalon.scan(element, [vm].concat(vmodels));
            };


            var changeTo = function(current){
                var offset = singlewidth * current;
                $(".tabs li" ,element).removeClass("active").eq(current).addClass("active");
                $(".tabs-panel" ,element).removeClass("active").eq(current).addClass("active");
                //$(".tabs-panels-wrapper" ,element).css("left", 0-offset+"px");
            }



            //var detectWidth = function(){
            //    var width = $(".tabs-panels" ,element).innerWidth();
            //
            //    if(isIE6) $(".tabs-panels" ,element).width(width);
            //    if(width === singlewidth) return;
            //
            //    singlewidth = width;
            //    $(".tabs-panel" ,element).css("width", singlewidth+"px");
            //    //$(".tabs-panels-wrapper" ,element).css({"width": singlewidth * tabcount + "px", "left": 0-singlewidth * vm.current+"px", "visibility": "visible"});
            //}

            vm.$watch("current", function(current){
                changeTo(current);
            })

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