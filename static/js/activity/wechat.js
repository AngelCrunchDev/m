/**
 * Created by Benson on 15/11/10.
 */
//全局初始化
(function(){
    var self = this,
        mobile   = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

    this.touchstart = mobile ? "touchstart" : "mousedown";
    this.touchend = mobile ? "touchend" : "mouseup";
    this.touchmove = mobile ? "touchmove" : "mousemove";
    this.tap = mobile ? "tap" : "click";

    this.__define = function (s) {
        return (typeof  s != 'undefined' && typeof  this[s] == 'undefined') ? this[s] = {} : (this[s] || {});
    };

    this.init = function(){
        $('html,body').on(self.touchmove,function(e){
            e.preventDefault()
        });
        $('.page').on(self.touchstart,function(e){
            e.preventDefault();
        });
    };
    $.fn.extend({
        touchtap:function(fn,delay){
            var x, y,s;
            if(typeof document.ontouchstart!='undefined'){
                $(this).bind('touchstart',function(e){
                    x= e.originalEvent.touches[0].pageX;
                    y= e.originalEvent.touches[0].pageY;
                    s = new Date().getTime();
                });
                $(this).bind('touchend',function(e){
                    var event=e.originalEvent.changedTouches[0],move=Math.pow(event.pageX-x,2)+Math.pow(event.pageY-y,2),o = new Date().getTime(),self = $(this);
                    if(o-s<150 && move<81){
                        !delay?fn.call(self):setTimeout(function(){fn.call(self)},200);
                    }
                });
            }
            else{
                $(this).click(fn);
            }

        }
    });
    self.init();
}).call(this);

//声音播放模块
(function(){
    var current;

    createjs.Sound.alternateExtensions = ["ogg"];
    createjs.Sound.registerSounds([{src: "weixin_message.mp3", id: 1}], 'http://dn-acac.qbox.me/mobile/activity/');
    this.play = function(){
        current = createjs.Sound.play('1');
        current.volume = 0.1;
    }
    
}).call(__define('sound_controll'));

//动画流程
(function(){
    var self = this;

    //队列
    this.queue = [
        {
            delay : 1500,
            id:1,
            sound:true,
            condition:function(){
                return true;
            }
        },
        {
            delay : 1500,
            id:2,
            sound:true,
            condition:function(){
                return true;
            }
        },
        {
            delay :2500,
            id:3,
            sound:false,
            condition:function(){
                return true;
            }
        },
        {
            delay : 2000,
            id:4,
            sound:true,
            condition:function(){
                return true;
            }
        },
        {
            delay : 2000,
            id:5,
            sound:true,
            condition:function(){
                return true;
            }
        },
        {
            delay : 2000,
            id:6,
            sound:true,
            condition:function(){
                return true;
            }
        },
        {
            delay :2500,
            id:7,
            sound:false,
            condition:function(){
                return true;
            }
        },
        {
            delay : 2000,
            id:8,
            sound:true,
            condition:function(){
                return true;
            }
        },
        {
            delay : 2000,
            id:9,
            sound:true,
            condition:function(){
                return true;
            }
        },
        {
            delay : 2000,
            id:10,
            sound:true,
            condition:function(){
                return true;
            }
        },
        {
            delay : 2000,
            id:11,
            sound:true,
            condition:function(){
                return true;
            }
        },
        {
            delay : 2000,
            id:12,
            sound:true,
            condition:function(){
                return true;
            }
        },
        {
            delay : 2000,
            id:14,
            sound:true,
            condition:function(){
                return true;
            }
        },
        {
            delay : 2000,
            id:15,
            sound:false,
            condition:function(){
                return true;
            }
        },
        {
            delay : 2000,
            id:16,
            sound:true,
            condition:function(){
                return true;
            }
        },
        {
            delay :2500,
            id:17,
            sound:false,
            condition:function(){
                return true;
            }
        },
        {
            delay : 2000,
            id:18,
            sound:true,
            condition:function(){
                return true;
            }
        },
        {
            delay : 2500,
            id:19,
            sound:true,
            condition:function(){
                return true;
            }
        },
        {
            delay : 0,
            id:20,
            sound:false,
            condition:function(){
                return true;
            }
        }
    ];
    //消息显示
    this.msg_show = function(id, sound){
        $('#msg'+id).fadeIn();
        !!sound && sound_controll.play();
    };
    //滚动同步
    this.scroll_syn = function(){
        var height  = $(window).height(),
            top     = $('#bottom-line').position().top,
            page    = $('#page'),
            scrolled= parseInt(page.css('margin-top'));
        if(top+200 > height){
            page.animate({'margin-top':-150+scrolled});
        }
    };
    this.debug = function(){
        return $('#bottom-line').position().top+' '+$(window).height();
    };
    this.pause = 0;
    this.engine = function(){
        var l       = self.queue.length,
            current = 0,
            time    = 0;

        return function(){
            var queue_pointer = self.queue[current];
            if(l<1 || self.pause)return false;
            if(current+1>l)return clearInterval(self.timer);
            if(queue_pointer.condition()){
                time+=100;
                if(time>queue_pointer.delay){
                    self.msg_show(queue_pointer.id,queue_pointer.sound);
                    self.scroll_syn();
                    time=0;
                    current++;
                }
            }
        }
    };

    this.timer = setInterval(self.engine(),100);

}).call(__define('animate_controll'));

(function(){
    var self = this,
        $picker = $('.pick'),
        $hongbao= $('#hongbao'),
        $close = $hongbao.children('.close');

    this.hongbao = {
        show:function(){
            $hongbao.fadeIn(100,function(){
                TweenMax.to('#hb-img',.5, {alpha:1, scale:1, ease:Bounce.easeOut});
            });
        },
        hide:function(){
            TweenMax.to('#hb-img',.5, {alpha:0, scale:0.5, ease:Bounce.easeOut});
            setTimeout(function(){$hongbao.fadeOut(100);},500);
        }
    };
    $picker.touchtap(self.hongbao.show);
    $close.touchtap(self.hongbao.hide);
}).call(__define('event_controll'));