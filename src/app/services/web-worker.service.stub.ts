import {Injectable} from '@angular/core';

@Injectable()
export class WebWorkerStub {
  static supported: boolean = true;
  static workerUrl: string = 'assets/js/xhrWorker.js';
  public activeWorkers: Array<any> = [];
  //public workersCalled: number = 0;

  load(config: any, msgFn: any, errorFn?: any):number {
    let id: number = Math.floor(Math.random()*1000000000000);
    this.activeWorkers.push({
      id: id,
      config: config
    });
    setTimeout(() => {
     if (msgFn) {
       msgFn({data:'success'});
     } else if (errorFn) {
       errorFn({data:'ERROR'});
     }
    });
    //this.workersCalled++;
    return id;
  }
  terminate(id: number):void {
    let index = this.activeWorkers.findIndex(item => item.id === id);
    if (index > -1) {
      this.activeWorkers.splice(index, 1);
    }
  }
}
