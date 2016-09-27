import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {WebWorkerService} from './web-worker.service';

@Injectable()
export class ImageLazyLoaderService {
  public imageCache:any = {};
  
  constructor(private http: Http, private worker: WebWorkerService) {}
  /*
  * Loads the url via `WebWorker` where supported and gracefully degrades to using `Http` if needed.
  * @param url  url of image to load.
  * @param headers  **(optional)** any custom headers (as an `Object`) that may be required to load the image.
  * @returns return `Promise`
  */
  load(url: string, headers?: any): Promise<any> {
    if (this.imageCache[url]) {
      // image has been previously loaded, rely on browser cache
      return Promise.resolve(true);
    } else if (WebWorkerService.supported) {
      return this.loadViaWorker(url, headers);
    } else {
      return this.loadViaHttp(url, headers);
    }
  }
  /*
  * Loads the url via `WebWorker` directly.
  * @param url  url of image to load.
  * @param headers  **(optional)** any custom headers (as an `Object`) that may be required to load the image.
  * @returns return `Promise`
  */
  loadViaWorker(url: string, headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let id: any, completeHandler: any, msgFn: any, errorFn: any;
      
      completeHandler = (success:boolean, err?:any) => {
        this.worker.terminate(id);  
        
        if (success) {
          this.imageCache[url] = true;
          resolve(true);
        } else {
          reject(err);
        }
      };
      
      msgFn = (e: any) => {
        if (e && e.data !== 'ERROR') {
          completeHandler(true);
        } else {
          completeHandler(false, e);
        }
      };
      
      errorFn = (e: any) => {
        completeHandler(false, e);
      };
  
      let config:any = {
        method: 'GET',
        url: url
      };
      
      // optionally set headers
      if (headers) {
        config.headers = headers;
      }
      id = this.worker.load(config, msgFn, errorFn);
    }); 
  }
  /*
  * Loads the url via `Http` directly.
  * @param url  url of image to load.
  * @param headers  **(optional)** any custom headers (as an `Object`) that may be required to load the image.
  * @returns return `Promise`
  */
  loadViaHttp(url: string, headers?: any): Promise<any> {
    let ro: RequestOptions = null;
    if (headers) {
      ro = new RequestOptions({
        headers: new Headers(headers)
      });
    }
    return new Promise((resolve, reject) => {
      this.http.get(url, ro)
        .subscribe(res => {
          this.imageCache[url] = true;
          resolve(true);
        });
    }); 
  }
}
