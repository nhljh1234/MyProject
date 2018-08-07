cc.Class({
    extends: cc.Component,

    properties: {
        //UI的名字
        _uiName: undefined
    },

    /**
     * 初始化，先初始化数据，后初始化UI
     */
    onLoad: function () {
        if ((typeof this.UIInit) === 'function') {
            this.UIInit();
        }
        if ((typeof this.dataInit) === 'function') {
            this.dataInit();
        }
    },

    /**
     * 这个函数会注册指定结点下所有的结点
     * 需要避免多次时间注册的情况
     * @param node cc.Node
     */
    buttonTravelRegister: function (node) {
        if (!node) {
            return;
        }
        if (node.getComponent(cc.Button)) {
            //注册事件
            node.on('click', this.buttonClickCb, this);
        }
        //遍历执行
        node.children.forEach(function (childNode) {
            this.buttonTravelRegister(childNode);
        }.bind(this));
    },

    /**
     * 按钮点击触发的回调
     * @param clickEvent 点击事件的具体参数
     */
    buttonClickCb: function (clickEvent) {
        if (this.onButtonClick && (typeof this.buttonClickCb) === 'function') {
            //解析参数
            //触发事件的结点
            var node = clickEvent.currentTarget;
            //触发事件的按钮组件
            var component = clickEvent.detail;
            //组件的名字
            var name = node.name;
            this.onButtonClick(name, node, component);
        }
    }
});
