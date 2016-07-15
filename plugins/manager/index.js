//负责提供插件管理功能
var manager=require('../plugin_factory').create();
manager.meta.name='plugin_manager';
manager.meta.display_name='plugin manager';

//指定models
var Config=require('./model/config');
manager.models={Config};
var config=null;
manager.getConfig = function*(user_id) {
    var config_model = manager.models.Config;
    config = yield config_model.findOne({user_id: user_id});
    if (!config) {
        var all_plugin_list = manager.plugin_list;
        var config_plugin_list = [];
        all_plugin_list.forEach(function (plugin) {
            config_plugin_list.push({
                name: plugin.meta.name,
                status: true,
                proprity: 1
            });
        });
        config = new config_model({user_id: user_id, plugin_list: config_plugin_list});
        config = yield config.save();
    }
    config.is_enabled=function(plugin_name){
        if(plugin_name == manager.meta.name)return true;
        var flag=false;
        config.plugin_list.forEach(function(plugin_config_item){
            if(plugin_config_item.name ==plugin_name){
                flag= plugin_config_item.status;
            }
        });
        return flag;
    };
    config.is_must=function(plugin_name){return plugin_name == manager.meta.name;};
    return config;
};

//接受全局参数user_id
var controller_index = function *() {
    //this.body = 'Hello World';
    _this = this;
    var user_id = 'test_user_id'; //临时测试参数
    var all_plugin_list = manager.plugin_list;
    this.render(__dirname + '/view/index', {
        title: "插件管理",
        content: '启用或者关闭插件',
        plugin_list: all_plugin_list,
        config: config
    });

};
//接受全局参数{user_id:"test_user_id",plugin_name:string,status:bool}
//打开或者关闭某个插件
var controller_switch = function *() {
    var config_model = manager.models.Config;
    var user_id = 'test_user_id'; //临时测试参数
    var plugin_name = this.params.plugin_name;
    var status = this.query.status == 'true';
    for(var index=0;index<config.plugin_list.length;index++)
    {
        if (config.plugin_list[index].name==plugin_name){
            config.plugin_list[index].status=status;
            break;
        }
    }

    //啊啊啊我不服啊，为什么我这里需要删了再新建一个才行
    yield config.remove();
    config=new config_model({user_id: user_id,plugin_list:config.plugin_list});
    yield config.save();

    this.redirect(this.app.url("plugin-conifg-list", {user_id: user_id}));
};


//prefix 不需要加/
manager.router = function (app, manager_middleware, prefix) {
    //显示插件列表和插件启用状态
    app.get('plugin-conifg-list', prefix + '/plugins', manager_middleware(this), controller_index);
    //更新插件启用状态
    app.put('plugin-conifg-switch', prefix + '/plugins/:plugin_name', manager_middleware(this), controller_switch);
};

module.exports=manager;