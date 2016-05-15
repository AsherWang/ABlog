var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Tool=require('./model/tool');

var toolbox = module.exports;
toolbox.meta = {
    name: 'toolbox',
    description: 'just 4 test',
    model: true
};



var inner_controller=function *() {
    //this.body = 'Hello World';
    //var model_tool = global.database.models.toolbox_tool; //两者均可
    var model_tool = toolbox.models.Tool;
    this.render(__dirname+'/view/index', {title: "每日小asd记",content:'23333',other:model_tool.schema.methods.tool_test_text()});
};

toolbox.models={Tool};


//prefix 不需要加/
toolbox.router = function (app,manager_middleware,prefix) {
    app.get('toolbox-index', prefix + '/index',manager_middleware(this), inner_controller);

//    blablabla


};


