/**
 * Created by Obscurity on 2016/5/12.
 */
var Tool = {
    name:'tool',
    collection: 'tool',
    methods:{}
};

Tool.Schema = {
    name: {
        type: String,
        required: true
    }
};


Tool.methods.tool_test_text = function () {
    return "2233445566";
};



module.exports = Tool;