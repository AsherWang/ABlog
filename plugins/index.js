var plugin_center = module.exports;
var staticCache = require('koa-static-cache');
var path = require('path');


var plugin_manager=require('./manager');
var plugin_list=[]; //插件列表
var debug=true;
var inner_log=function(content)
{
    if(debug) {
        console.log(content);
    }
};



//载入各个插件
plugin_center.plugins_load=function(){
    plugin_list=[
        plugin_manager,
        require('./plugins/demo')
    ];
    plugin_manager.plugin_list=plugin_list;
};

//载入配置

//设置静态资源路径
plugin_center.static_init=function(app){
    plugin_list.forEach(function (plugin) {
        if(plugin.config.static){
            app.use(staticCache(path.join(__dirname,'plugins',plugin.meta.name,'public')));
        }
    });
};


//设置router
plugin_center.router_init=function(app){
    plugin_list.forEach(function (plugin) {
        //各个plugin设置子路由,即 某plugin接管/pluginname 路由
        plugin.router(app,plugin_center.middleware,"/" + plugin.meta.name);
    });
};

//设置model
plugin_center.model_init=function(database, mongoose){
    var Schema = mongoose.Schema;
    plugin_list.forEach(function (plugin) {
        if(plugin.config.model){//如果需要载入model
            for (var index in plugin.models) {
                model = plugin.models[index];
                var schema = new Schema(model.Schema, {collection: 'plugin_'+plugin.meta.name + '_' + model.collection});
                schema.methods = model.methods;
                model_name = plugin.meta.name + '_' + model.name;
                database.models[model_name] = mongoose.model(model_name, schema);
                plugin.models[index] = database.models[model_name]; //在插件内部可以不用global.databases.models.blabla访问，直接可以plugin.models.blabla;
            }
        }
    });
};


//在这里检查插件是否被启用，然后根据启用状态分配路由
plugin_center.middleware = function (plugin) {
    return function *(next) {
        var user_id = 'test_user_id'; //临时测试参数
        var config = yield plugin_manager.getConfig(user_id);
        if(config.is_enabled(plugin.meta.name))
        {
            yield next;
        }
        else
        {
            //如果没有启用，那么就重定向到首页
            this.redirect('/');
        }
    };
};


