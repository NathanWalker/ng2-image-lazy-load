import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { IMAGELAZYLOAD_DIRECTIVES } from './directives/image-lazy-load.directive';
import { ImageLazyLoaderService } from './services/image-lazy-load.service';
import { WebWorkerService } from './services/web-worker.service';

WebWorkerService.workerUrl = 'xhrWorker.js';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    IMAGELAZYLOAD_DIRECTIVES
  ],
  providers: [
    ImageLazyLoaderService,
    WebWorkerService
  ],
  exports: [
    IMAGELAZYLOAD_DIRECTIVES
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
