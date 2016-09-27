import {Injectable} from '@angular/core';

@Injectable()
export class WebWorkerService {
  static supported: boolean = typeof (Worker) !== 'undefined';
  static enabled: boolean = true; // enabled by default, however can be manually turned off
  static workerUrl: string = 'assets/js/xhrWorker.js';
  public activeWorkers: Array<any> = [];

  load(config: any, msgFn: any, errorFn?: any):number {
    if (typeof(config) !== 'object') {
      throw(`config must be an Object with method and url defined.`);
    } else if (!config.url) {
      throw(`config.url must be defined.`);
    }
    let id:number = Math.floor(Math.random()*1000000000000);
    let w = new Worker(WebWorkerService.workerUrl);
    if (msgFn) {
      w.addEventListener('message', msgFn, false);
    }
    if (errorFn) {
      w.addEventListener('error', errorFn, false);
    }

    this.activeWorkers.push({
      id: id,
      worker: w,
      msgFn: msgFn,
      errorFn: errorFn
    });
    w.postMessage(config);
    return id;
  }
  terminate(id: number):void {
    let index = this.activeWorkers.findIndex(item => item.id === id);
    if (index > -1) {
      let activeWorker = this.activeWorkers[index];
      if (activeWorker && activeWorker.worker) {
        if (activeWorker.worker.msgFn) {
          activeWorker.worker.removeEventListener('message', activeWorker.worker.msgFn);
        }
        if (activeWorker.worker.errorFn) {
          activeWorker.worker.removeEventListener('error', activeWorker.worker.errorFn);
        }
        activeWorker.worker.terminate();
      }
      this.activeWorkers.splice(index, 1);
    }
  }
}
