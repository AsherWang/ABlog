var controller = require('../controller');
var userRouter = require('./users');
var contestRouter = require('./contests');
var paperRouter = require('./papers');
var projectRouter = require('./projects');
var journalRouter = require('./journals');
var diaryRouter = require('./diaries');

module.exports = function(app,plugin_manager){
    //首页
    app.get('home', '/',controller.home.index);
    plugin_manager.router_init(app);
    userRouter(app);
    contestRouter(app);
    paperRouter(app);
    projectRouter(app);
    journalRouter(app);
    diaryRouter(app);
};