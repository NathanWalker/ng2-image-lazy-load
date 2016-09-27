export declare class WebWorkerStub {
    static supported: boolean;
    static workerUrl: string;
    activeWorkers: Array<any>;
    load(config: any, msgFn: any, errorFn?: any): number;
    terminate(id: number): void;
}
