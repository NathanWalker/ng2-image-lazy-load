import {NgModule, ModuleWithProviders} from "@angular/core";
import {IMAGELAZYLOAD_DIRECTIVES} from './src/app/directives/image-lazy-load.directive';
import {ImageLazyLoaderService} from './src/app/services/image-lazy-load.service';
import {WebWorkerService} from './src/app/services/web-worker.service';

// for manual imports
export * from './src/app/services/image-lazy-load.service';
export * from './src/app/services/web-worker.service';
export * from './src/app/directives/image-lazy-load.directive';

@NgModule({
  declarations: [
    IMAGELAZYLOAD_DIRECTIVES
  ],
  providers: [
    ImageLazyLoaderService,
    WebWorkerService
  ],
  exports: [
    IMAGELAZYLOAD_DIRECTIVES
  ]
})
export class ImageLazyLoadModule {

  static forRoot(configuredProviders: Array<any>): ModuleWithProviders {
    return {
      ngModule: ImageLazyLoadModule,
      providers: configuredProviders
    };
  }
}
