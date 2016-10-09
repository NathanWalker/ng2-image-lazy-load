import {Http} from '@angular/http';
import {WebWorkerStub} from './web-worker.service.stub';

export declare class ImageLazyLoaderService {
    http: Http;
    worker: WebWorkerStub;
    _config: Object;
    imageCache: Object;
    load(url: string, headers: Object): any;
    loadViaWorker(url: string, headers: Object): any;
    loadViaHttp(url: string, headers: Object): any;
}

export declare class IImageLazyLoadConfig {
    headers?: any;
    loadingClass?: string;
    loadedClass?: string;
    errorClass?: string;
}
