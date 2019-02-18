/**
 * 任务条件工厂
 */
export class TaskCondition {
    //任务文本
    conditionStr: string;
    //任务完成进度
    nowFinishNum: number;
    //任务要求进度
    askNun: number;
    //比较方式
    //0等于 1大于 2小于 3大于等于 4小于等于
    equalMode: number;
}

/**
 * 任务工厂
 */
export class Task {
    //任务条件
    taskConditions: TaskCondition[];
    //是否完成
    isFinish: boolean;
    //任务名字
    taskName: string;
    //任务详情
    
}