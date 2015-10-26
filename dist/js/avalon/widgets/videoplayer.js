define(["avalon","domReady!", "jwplayer"], function(avalon) {

    var widget = avalon.ui.videoplayer = function(element, data, vmodels) {

        var options = data.videoplayerOptions;
        if(options.playlist.length === 0 ) delete options.playlist;

        var vmodel = avalon.define(data.videoplayerId, function(vm) {

            vm.$player = null;
            vm.playerReady = false;
            vm.playlistReady = false;


            vm.play = function(val){
                vm.$player.play(val);
            }

            vm.stop = function(){
                vm.$player.stop();
                vm.playlistReady = false;
                $(element).trigger("playerStop");
            }

            vm.seek = function(time){
                if(vmodel.playlistReady) {
                    vm.$player.seek(time);
                }else{
                    $(element).die("playlistLoad");
                    $(element).one("playlistLoad", function(){
                        vm.$player.seek(time);
                    })
                }
            }

            vm.load = function(playlist){
                vm.$player.load(playlist);
                vm.playlistReady = true;
                $(element).trigger("playlistLoad");
            }

            vm.unload = function(){
                vm.$player.load({});
                vm.stop();
            }

            vm.setup = function(options){
                vm.$player = jwplayer(data.videoplayerId).setup(options);
                vm.$player.onReady(function(){
                    vm.playerReady = true;
                    //vm.$player.stop();
                    options.onReady();
                    $(element).trigger("playerReady");
                })

                vm.$player.onPlay(function(){
                    options.onPlay();
                });

                vm.$player.onTime(function(Event){
                    options.onPositionChange(Event.position);
                })

                vm.$player.onComplete(function(){
                    options.onComplete();
                    vm.stop();
                });
            }

            vm.$init = function() {//初始化组件的界面，最好定义此方法，让框架对它进行自动化配置
                $(element).append("<div id='"+data.videoplayerId+"'></div>");
                vm.setup(options);
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
        autostart : false,
        file : 'http://course.edufe.cn/mp4/blank.mp4',
        playlist : [],
        aspectratio: "16:9",
        width: '100%',
        primary: "flash",
        stretching: 'exactfit',
        onReady : function(){},
        onPlay : function(){},
        onPositionChange : function(){}
    }
    return avalon;
})
