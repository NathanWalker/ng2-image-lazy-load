import { ModuleWithProviders } from "@angular/core";
export * from './src/app/services/image-lazy-load.service';
export * from './src/app/services/web-worker.service';
export * from './src/app/directives/image-lazy-load.directive';
export declare class ImageLazyLoadModule {
    static forRoot(configuredProviders: Array<any>): ModuleWithProviders;
}
