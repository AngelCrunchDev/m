/**
 * Created by Benson on 15/10/21.
 */
(function(){
    log.type = 'login';
    this.api = {
        verify:base_mobile+'v4/home/new_phone',
        bind:base_mobile+'v4/home/phone_bind_on_account'
    }
}).call(define('page_config'));
//APP 回调方法
(function(){
    var self = this;
    setTimeout(function(){
        self.bind_result = window.hasOwnProperty('bindPhone') ? function(result,msg,phone){
            window.bindPhone.bindFinished(result,msg,phone);
        } : function(result,msg,phone){
            location.hash = "bindFinished:"+result+":"+encodeURIComponent(msg)+":"+phone;
        };
    },100);
}).call(window);
//数据获取
(function(){
    this.get = function(url,call,data){
        base_remote_data.ajaxjsonp(url,call, $.extend({},data,{
            'access_token':account_info.token,
            'uid':account_info.id
        }),function(){bind_result(0,'网络错误',0)});
    }
}).call(define('data_model'));
(function(){
    var self        = this,
        $pwd        = $('#pwd'),
        $phone      = $('#phone'),
        $verify_btn = $('#verify-btn'),
        $verify_code= $('#verify-code'),
        $submit_btn = $('#submit-btn'),
        $pwd_eye       = $pwd.next(),
        send_time = 0,
        timer = 0,
        btn_lock = false;

    this.form = function(){
        return {
            'password':$pwd.val(),
            'phone':$phone.val(),
            'captcha':$verify_code.val()
        }
    };
    this.check_form = function(){
        var form = self.form();
        return (form.password.length>=6 && base_regex().phone.test(form.phone) && form.captcha != '');
    };
    this.check_verify = function(){
      var form = self.form();
        return (form.password.length>=6 && base_regex().phone.test(form.phone));
    };
    this.verify_btn_active = function(active){
        if(active){
            $verify_btn.prop('disabled',false).removeClass('disable');
        }
        else{
            $verify_btn.prop('disabled',true).addClass('disable');
        }
    };
    this.submit_btn_active = function(active){
        return !!active ? $submit_btn.addClass('active') : $submit_btn.removeClass('active');
    };
    this.submit_verify = function(){
        $phone.blur();
        if(self.check_verify() && !btn_lock){
            data_model.get(page_config.api.verify,function(data){
                if(data.success){
                    self.already_sent();
                }
                else{
                    bind_result(0,data.message || '操作失败',0);
                }
            },self.form());
        }
    };
    this.already_sent = function(){
        $phone.prop('disabled',true);
        $verify_btn.prop('disabled',true).addClass('disable');
        $verify_code.prop('disabled',false);
        btn_lock = true;
        send_time = new Date().getTime();
        timer && clearInterval(timer);
        timer = setInterval(function(){
            var down = 60-(new Date().getTime() - send_time)/1000;

            if(down>=0){
                $verify_btn.html(Math.floor(down)+' s');
            }
            else{
                $phone.prop('disabled',false);
                $verify_btn.prop('disabled',false).removeClass('disable');
                $verify_btn.html('重新发送');
                clearInterval(timer);
                btn_lock = false;
            }

        },500);
    };
    this.form_event = function(){
        self.check_verify() ? self.verify_btn_active(true) : self.verify_btn_active(false);
        return self.check_form() ? self.submit_btn_active(true) : self.submit_btn_active(false);
    };
    this.submit_form = function(){
        if(self.check_form()){
            data_model.get(page_config.api.bind,function(data){
                if(data.success){
                    bind_result(1,'绑定手机号成功',self.form().phone);
                }
                else{
                    bind_result(0,data.message || '绑定失败',0);
                }
            },self.form());
        }
    };
    setInterval(self.form_event,300);
    $pwd_eye.on('touchstart mousedown',function(){$pwd.attr('type','text')});
    $pwd_eye.on('touchend mouseup',function(){$pwd.attr('type','password')});
    $submit_btn.touchtap(self.submit_form);
    $verify_btn.touchtap(self.submit_verify);
}).call(define('controller_bind'));