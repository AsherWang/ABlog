//维护一个plugin_list
var manager = module.exports;
var plugin_manager=require('./plugin_manager');  //后台
var list = [];
var debug=false;
var inner_log=function(content)
{
    if(debug) {
        console.log(content);
    }
};
//设置插件的列表
manager.setPluginList = function (plugin_list) {
    //list = [plugin_manager];
    list=plugin_list;
    list.unshift(plugin_manager);
    inner_log('plugin list updated');
    inner_log(list);
};

//获取插件的列表
manager.getPluginList = function () {
    return list.slice(1);
};

//给插件添加一些方法
manager.wrapper=function(plugin)
{
    plugin.meta.manager=this;
    plugin.isEnabled=function(list){
    //    查询此插件是否在list中
        plugin_name=this.meta.name;
        if(plugin_name == plugin_manager.meta.name)return true;
        var flag=false;
        list.forEach(function(plugin_config_item){
            if(plugin_config_item.name ==plugin_name){
                flag= plugin_config_item.status;
            }
        });
        return flag;
    };
    plugin.getDisplayName=function()
    {
        if(this.meta.displayName)return this.meta.displayName;
        return this.meta.name
    };

    plugin.isMust=function(){
        return this.meta.name==plugin_manager.meta.name;
    }
}



//遗留问题：为何我的Model定义的方法需要Model.schema.methods.sth 来访问= =

//将插件列表中的各个插件按照列表顺序依次添加model
manager.model_init = function (database, mongoose) {
    var Schema = mongoose.Schema;
    list.forEach(function (plugin) {
        inner_log('model inti for plugin'+plugin.meta.name);
        manager.wrapper(plugin);
        for (var index in plugin.models) {
            model = plugin.models[index];
            var schema = new Schema(model.Schema, {collection: plugin.meta.name + '_' + model.collection});
            schema.methods = model.methods;
            model_name = plugin.meta.name + '_' + model.name;
            database.models[model_name] = mongoose.model(model_name, schema);
            plugin.models[index] = database.models[model_name]; //在插件内部可以不用global.databases.models.blabla访问，直接可以plugin.models.blabla;
        }
    });
};

//将插件列表中的各个插件按照列表顺序依次添加routes
manager.router_init = function (app) {
    if(debug){
        app.use(require('koa-logger')());
    }
    list.forEach(function (plugin) {

        //各个plugin设置子路由,即 某plugin接管/pluginname 路由
        plugin.router(app,manager.middleware,"/" + plugin.meta.name);
    });
};

//在这里检查插件是否被启用，然后根据启用状态分配路由
manager.middleware = function (plugin) {
    return function *(next) {
        var config_model = global.database.models[plugin_manager.meta.name + '_config'];
        var user_id = 'test_user_id'; //临时测试参数
        var config = yield plugin_manager.getConfig(user_id);
        if(plugin.isEnabled(config.plugin_list))
        {
            inner_log(plugin.meta.name);
            yield next;
        }
        else
        {
            //如果没有启用，那么就重定向到首页
            this.redirect('/');
        }
    };
};

