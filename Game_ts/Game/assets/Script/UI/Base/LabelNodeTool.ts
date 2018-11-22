import LanguageTool = require('../../Tool/System/LanguageTool');

const { ccclass, property } = cc._decorator;

@ccclass
class LabelToolUI extends cc.Component {

    @property
    label_key: string = '';

    onLoad() {
        //显示界面
        let labelComponent = this.node.getComponent(cc.Label);
        if (!labelComponent) {
            return;
        }
        labelComponent.string = LanguageTool.getLanguageStr(this.label_key) || "";
    }
}
