/** touch the given filepath */
export declare const touch: (filepath: string) => void;
/** execute the given async task n times */
export declare const doTimes: (n: any, task: any) => any;
export declare const tabby: (app: any, partial: any, full: any, expectOK?: boolean) => any;
export declare const tabbyWithOptions: (app: any, partial: any, expected?: any, full?: any, { click, nTabs, expectOK, expectedPromptAfterTab }?: {
    click?: any;
    nTabs?: any;
    expectOK?: boolean;
    expectedPromptAfterTab?: any;
}) => any;
export declare const tabbyWithOptionsThenCancel: (app: any, partial: any, expected: any) => any;
