var Config = {
    name:'config',
    collection: 'config',
    methods:{}
};

Config.Schema = {
    user_id: {
        type: String,
        required: true
    },
    plugin_list: {
        type: Array,
        required: false,
        default: []
    }
};


Config.methods.tool_test_text = function () {
    return "tool_test_text";
};


module.exports = Config;