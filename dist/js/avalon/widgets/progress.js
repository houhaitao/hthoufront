define(["avalon","domReady!"], function(avalon) {
    var widget = avalon.ui.progress = function(element, data, vmodels) {
        var vmodel = avalon.define(data.progressId, function(vm) {
            vm.progress = 0;

            vm.$init = function() {//初始化组件的界面，最好定义此方法，让框架对它进行自动化配置
                var progress =  $(element).data("progress");
                progress = progress ? progress : 0;
                vm.progress = progress;
            }

            vm.$watch("progress", function(progress){
                $(".passed" ,element).css("width", progress);
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
