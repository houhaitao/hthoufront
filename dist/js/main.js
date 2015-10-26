require.config({//第一块，配置
    paths: {
//        avalon  : "vendor/avalon/avalon",      //必须修改源码，禁用自带加载器，或直接删提AMD加载器模块
//        text    : 'vendor/require/text',
        domReady: 'require/domReady',
//        css     : 'vendor/require/css.js',
        mmRouter: 'avalon/mmRouter.js',
        mmState : 'avalon/mmState.js',
        mmPromise : 'avalon/mmPromise.js',
        mmRequest : 'avalon/mmRequest.js',
        scrollspy : 'avalon/widgets/scrollspy/avalon.scrollspy.js',
        jwplayer : 'player/jwplayer.js',
        layer : 'layer/layer.js',
        videoplayer : 'avalon/widgets/videoplayer.js'
    },
    priority: ['text', 'css'],
    shim: {
        avalon: {
            exports: "avalon"
        },
        jwplayer :{
            exports: "jwplayer"
        },
        layer : {
            exports : "layer"
        }
    }
});


require(["domReady!", "scrollspy", "videoplayer"], function() {//第二块，添加根VM（处理共用部分）

    avalon.config({
        interpolate: ["[[","]]"]
    })

    var vmroot = avalon.define({
        $id : "vmroot",
        overlap : "hide",
        overlapClick : function(){
            vmroot.overlap = 'hide';
            if($(".searchbtn2").length > 0){
                $(".searchbtn2").remove();
                $(".search_box2").remove();
            }
        }
    })


    var vmindex = avalon.define({
        $id : "vmindex",
        zhuanye_filter : "推荐专业",
        huodong_filter : "最新活动",
        menuactive : '',
        setHuodong : function(val){
            vmindex.huodong_filter = val;
        },
        setZhuanye : function(val){
            vmindex.zhuanye_filter = val;
        },
        setMenuActive : function(val){
            vmindex.menuactive = vmindex.menuactive === val ? '' : val;
            if(!vmindex.menuactive) {
                vmroot.overlap = 'hide';
            }else{
                vmroot.overlap = 'show';
            }
        },
        menuZhuanyeActive : false,
        menuHuodongActive : false,
        menuZhuanye : function(val){
            vmindex.menuZhuanyeActive = val;
        },
        menuHuodong : function(val){
            vmindex.menuHuodongActive = val;
        }
    });

    var vmyinxiang = avalon.define({
        $id : "yinxiang",
        type : '',
        setType : function(val){
            vmyinxiang.type = val;
        }
    })

    vmyinxiang.$watch("type", function(val){
        var items = window.data[val];
        $(".xygk .yinxiang .pics .slider .slide-news li").each(function(index, obj){
            $('.slide-news').trigger("removeItem", obj)
        })

        for(var i=0; i< items.length; i++){
            $('.slide-news').trigger("insertItem", '<li><a href="'+items[i].link+'" target="_blank"><img src="'+items[i].pic+'"/></a></li>')
        }

        $('.slide-news').imagesLoaded(function(){
            $('.slide-news').trigger("updateSizes")
        })
    })

    vmroot.$watch("overlap", function(val){
        if(val === 'hide'){
            vmindex.menuactive = false;
        }
    })


    var vmIntro = avalon.define({
        $id : 'intro',
        index : 1,
        scrollopt : "",
        $scrollspy : {
            onChangeNew : function(indexs){
                if(indexs.length !== 0) vmIntro.index = indexs[0]+1;
            },
            panelListGetter : function(){
                var res = [];
                $(".intro-left dt").each(function(i, obj){
                    res.push(obj);
                })
                return res
            },
            onInit: function(vmodel, option) {
                vmIntro.scrollopt = option;
            }
        },
        scrollTo : function(index){
            vmIntro.scrollopt.scrollTo(null, index-1)
        },
        backToTop : function(){
            $("html,body").animate({"scrollTop": 0}, 500)
        }
    });

    //课程信息书签
    var vmfloatBar = avalon.define({
        $id : "floatbar",
        scrolltop : $(document).scrollTop(),
        maxTop : 0,
        minTop :0,
        top : function(){
            var top = 0;
            if(vmfloatBar.scrolltop > vmfloatBar.minTop) {
                top = vmfloatBar.scrolltop - vmfloatBar.minTop;
                if(top > vmfloatBar.maxTop) top = vmfloatBar.maxTop;
            }else {
                top = 0;
            }
            return top;
        },
        init : function(){
            vmfloatBar.minTop = $(".intro-right").offset().top;
            vmfloatBar.maxTop = $('.header').height()+$('.nav-wrapper').height()+$(".kcjs, .intro-page").height() - $(".float-bar").height() - vmfloatBar.minTop;
        },
        scan : function(){
            vmfloatBar.init();

            $(window).scroll(function(){
                vmfloatBar.scrolltop = $(document).scrollTop();
            })

            $(window).resize(function(){
                vmfloatBar.init();
            })
        }
    })
    
    ///招生报名 报名指南 下拉子菜单
    var lc = avalon.define({
        $id: "liucheng",
        hide: false,
        click: function(){
            lc.hide = !lc.hide;
        }
    });
    
    //校友首页 校友会标签切换
    var xyh_tags = avalon.define({
        $id: "xyh",
        val: '校友会',
        hide: false,
        click: function(val){
            xyh_tags.val = val;
        }
    });
    
    //学习中心简介的弹出幻灯
    var vmlayer = avalon.define({
        $id : "layer",
        layerload : function(){
            //加载layer模块
            require(["layer"], function(layer){
                window.layer = layer;
                layer.config({
                    path: avalon.config.baseUrl+"layer/",
                    extend: 'extend/layer.ext.js'
                });

                layer.ready(function(){
                    layer.photos({
                        photos: '.lueying'
                    });
                })

            })
        }
    })

    avalon.scan(document.body);
});

require(["domReady!"], function(){

    //首页专业推荐单选按钮
    $(".filter .label").click(function(e){
        var self = this;
        var parent = $(this).parent();
        e.stopPropagation();

        $(parent).addClass("active");
        var hide = function(e){
            setTimeout(function(){$(".filter").removeClass("active");}, 500)
        }
        $(document).one({"touchend":hide, "click":hide});
    })
    
    //icon图标action
    var v_timer = "";
    $(".wxicon, .androidicon, .iosicon").mouseover(function(e){
        
        if($("#wx2wm").length >0){
            clearTimeout(v_timer);
            $("#wx2wm").remove();
        }

        var imgUrl = $(this).attr("data-img") || "";

        var posX = parseInt($(this).offset().left) || 0;
        var posY = parseInt($(this).offset().top) || 0;

        var divWidth= 128;
        var divHeight = $(this).hasClass("androidicon") || $(this).hasClass("iosicon") ? 164 : 128;
        var imgWidth= 118;
        var imgHeight = 118;
        

        var posLeft = posX - parseInt(divWidth/2) + parseInt($(this).width()/2);
        var posTop = posY + 28;


        //添加div父级DOM并规定样式
        var divDom = document.createElement("div");
        divDom.style["position"] = "absolute";
        divDom.style["left"] = posLeft + "px";
        divDom.style["top"] = posTop + "px";
        divDom.style["width"] = divWidth + "px";
        divDom.style["height"] = divHeight + "px";
        divDom.style["border"] = "1px solid #d3d3d3";
        divDom.style["background"] = "#fff";
        divDom.id = "wx2wm";
        divDom.className = "yj";

        //三角 triangle
        var triDom = document.createElement("img");
        var triWidth = 18;
        var triHeight = 11;
        triDom.style["position"] = "absolute";
        triDom.style["left"] = parseInt(divWidth/2) - parseInt(triWidth/2) + "px";
        triDom.style["top"] = -(triHeight-2) + "px";
        triDom.src = "/css/edufe/img/triangle.png";
        triDom.style["width"] = triWidth + "px";
        triDom.style["height"] = triHeight + "px";
        triDom.style["borderRadius"] = "5px";

        //添加img DOM并规定样式
        var imgDom = document.createElement("img");
        imgDom.src = imgUrl;
        imgDom.style["width"] = imgWidth + "px";
        imgDom.style['height'] = imgHeight + "px";
        imgDom.style["marginLeft"] = "4px"; 
        imgDom.style["marginTop"] = "4px";
        imgDom.style["border"] = "1px solid #f2f2f2";

        divDom.appendChild(triDom);
        divDom.appendChild(imgDom);
        
        //添加下载链接按钮
        if($(this).hasClass("androidicon") || $(this).hasClass("iosicon")){
            var downloadUrl = $(this).attr("data-url") || "#";
            
            var downloadDom = dd = document.createElement("a");
            dd.style["width"] = 104 + "px";
            dd.style["height"] = 30 + "px";
            dd.style["background"] = "#6ab83a";
            dd.style["display"] = "block";
            dd.style["color"] = "#fff";
            dd.innerHTML = "本地下载";
            dd.style["marginLeft"] = "12px";
            dd.style["marginTop"] = "4px";
            dd.className = "yj";
            dd.style["fontSize"] = "12px";
            dd.style["textAlign"] = "center";
            dd.style["lineHeight"] = "30px";
            dd.style["fontFamily"] = "simsun";
            dd.href = downloadUrl;
            
            divDom.appendChild(dd);

			$(dd).mouseover(function(){
				$(this).css("background", "#629c5a");
			}).mouseout(function(){
				$(this).css("background", "#6ab83a");
			});
        }


        $("body").append(divDom);

    }).mouseout(function(e){
        var rmDivDom = function(){
            if($("#wx2wm").length>0){
                $("#wx2wm").remove();
            }           
        };
        v_timer = setTimeout(rmDivDom, 500);
        $("#wx2wm").mouseover(function(){
            clearTimeout(v_timer);
        }).mouseout(function(){
           v_timer = setTimeout(rmDivDom, 500);
        });
    });
    
    //头部搜索按钮click
    $(".searchicon").click(function(){
        if(!$(".searchbtn").length > 0){
            //searchicon DOM元素位置                
            var posLeft = $(this).parent("a").position().left;
            var posTop = $(this).parent("a").position().top;
            var marginLeft = parseInt($(this).parent("a").css("marginLeft"));

            //search_box 宽与高
            var sBW = 126;
            var sBH = 16;
            //padding
            var pLeft = 20;
            var pRight = 40;

            //search_box 起始位置 最后加的数字为位置调整
            var sBoxLeft = posLeft - sBW - pLeft - pRight + marginLeft + 30;
            var sBoxTop = posTop - sBH + 9;

            // 添加searchbtn DOM
            var searchDOM = document.createElement("input");
            searchDOM.type = "text";
            searchDOM.className = "search_box";
            searchDOM.name = "q";
            searchDOM.style["width"] = sBW + "px";
            searchDOM.style["height"] = sBH + "px";
            searchDOM.style["paddingLeft"] = pLeft + "px";
            searchDOM.style["paddingRight"] = pRight + "px";

            $(searchDOM).insertBefore($(".wxicon").parent("a"));

            // 添加searchbtn
            var searchBox = $(".searchicon").parent("a").clone();
            searchBox.children().removeClass("searchicon");
            searchBox.children().addClass("searchbtn");

            searchBox.insertBefore($(".wxicon").parent("a"));

            $(".searchbtn").parent("a").css("position", "absolute");
            $(".searchbtn").parent("a").css("left", posLeft+"px");
            $(".searchbtn").parent("a").css("top", posTop+"px");

            $(".search_box").css("position", "absolute");
            $(".search_box").css("left", sBoxLeft+"px");
            $(".search_box").css("top", sBoxTop+"px");  
            
            //searchbtn 按钮添加submit事件
            $(".searchbtn").click(function(){
                $("#searchform").submit();
            });
        }
        
    });
    
    $(".searchicon2").click(function(){
        if(!$(".searchbtn2").length > 0){
            var searchDOM = document.createElement("input");
            searchDOM.type = "text";
            searchDOM.className = "search_box2";
            searchDOM.name = "q";
            $(searchDOM).insertBefore($(".wxicon2").parent("a"));
            
            var domLeft= $(searchDOM).position().left || 0;
            var domWidth = $(searchDOM).width() + 10 || 0;
            var searchBtn = $(".searchicon2").parent("a").clone();
            $(searchBtn).removeClass("searchicon2");
            $(searchBtn).addClass("searchbtn2");
            $(searchBtn).css('position', 'absolute');
            $(searchBtn).css('left', domLeft + domWidth + 'px');
            $(searchBtn).insertBefore($(".wxicon2").parent("a"));
            
            $(".searchbtn2").click(function(){
                $("#searchform2").submit();
            });
        }
    });
    
    //登陆框内容重置
    $(".loginContainer .cleanBtn").on("click", function(){
        $(this).siblings("input[type='text'], input[type='password']").val("");
    });
});

