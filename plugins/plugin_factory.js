//插件的..嗯,工厂...
//要求以变量命名规范来起plugin名字
//确保文件夹的名字就是plugin的名字
var util=require('util');
var Base=function(){
    this.meta = {
        display_name:'a buti plugin',
        name:'pluginA'
    };
    this.config={
        static:true,//false表示此插件不需要独立的css，js
        model:true //false表示此插件不需要model
    };
    this.models=[];
};
module.exports.create=function(){
    var o=function(){
        Base.call(this);
    };
    util.inherits(o, Base);
    return new o();
};