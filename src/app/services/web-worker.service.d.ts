export declare class WebWorkerService {
    static supported: boolean;
    static enabled: boolean;
    static workerUrl: string;
    activeWorkers: Array<any>;
    load(config: any, msgFn: any, errorFn?: any): number;
    terminate(id: number): void;
}
