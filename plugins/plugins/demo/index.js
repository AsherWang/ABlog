//插件样例
var sample=require('../../plugin_factory').create();
sample.config.model=false;
sample.config.static=true;
sample.meta={
    display_name:'A DEMO ',
    name:'demo'
};
var inner_controller=function *() {
    this.render(__dirname+'/view/index', {title: "每日小asd记",content:'23333',other:"alkasjdlkal"});
};



//prefix 不需要加/
sample.router = function (app,manager_middleware,prefix) {
    app.get('demo-index', prefix + '/index',manager_middleware(this), inner_controller);
};

module.exports=sample;