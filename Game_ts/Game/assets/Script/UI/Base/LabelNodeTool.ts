import { MyGame } from "../../Tool/System/Game";

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
        labelComponent.string = MyGame.LanguageTool.getLanguageStr(this.label_key) || "";
    }
}
