/**
 * 针对scrollview的优化
 */
var outModule = {};
var local = {};

/**
 * 显示一个scrollview
 * @param {cc.Node} contentNode 内容节点
 * @param {cc.Node} itemNode item节点，需要的话会通过这个节点克隆子节点
 * @param {Array} dataArr 数据队列
 * @param {Function} dataShowFunc 更新子节点的函数
 * @param {Boolean} isVertical 是否是垂直的
 */
outModule.showScrollView = (contentNode, itemNode, dataArr, dataShowFunc, isVertical) => {
    if (!contentNode || !dataArr) {
        return;
    }
    if (!itemNode) {
        //默认选择第一个节点作为克隆根节点
        itemNode = contentNode.children[0];
    }
    //判断contentNode的锚点数据，不是0的话需要给出警告
    if (contentNode.anchorX !== 0) {
        
    }
    if (contentNode.anchorY !== 0) {

    }
    //先判断是否要克隆新的节点
    //如果已有的item节点多余要显示的数量，那么就不需要克隆节点
    let childCount = contentNode.childrenCount;
    let showCount = dataArr.length;
    while (showCount > childCount) {
        //开始克隆节点
        let newItemNode = cc.instantiate(itemNode);
        contentNode.addChild(newItemNode);
        childCount++;
    }
    //开始更新
    //位置数据是由这边负责的，显示的话需要通过dataShowFunc来定制
    contentNode.children.forEach((childNode, index) => {
        if (index >= showCount) {
            childNode.active = false;
            return;
        }
        childNode.active = true;
        //先更新显示，这边可能会修改到itemNode的size属性
        if (dataShowFunc) {
            dataShowFunc(childNode, dataArr[index]);
        }
        //更新位置
        if (isVertical) {
            childNode.y = itemNode.y - itemNode.height * index;
        } else {
            childNode.x = itemNode.x - itemNode.width * index;
        }
    });
    //更新contentNode高度
    contentNode.height = itemNode.height * showCount;
};

module.exports = outModule;