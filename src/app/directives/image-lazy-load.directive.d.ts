import { ElementRef, Renderer, OnInit } from '@angular/core';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import { ImageLazyLoaderService, IImageLazyLoadConfig } from '../services/image-lazy-load.service';
export declare class ImageLazyLoadItemDirective {
    private el;
    private renderer;
    private lazyLoader;
    imageLazyLoadItem: string;
    imageLazyLoadingContainer: string;
    loading: boolean;
    loaded: boolean;
    error: boolean;
    private tagName;
    constructor(el: ElementRef, renderer: Renderer, lazyLoader: ImageLazyLoaderService);
    getPosition(): {
        top: any;
        left: any;
        bottom: any;
    };
    getLoadingContainer(): any;
    hasClassName(name: string): boolean;
    addClassName(name: string): void;
    removeClassName(name: string): void;
    toggleLoaded(enable: boolean): void;
    loadImage(): void;
    setImage(): void;
}
export declare class ImageLazyLoadAreaDirective implements OnInit {
    private lazyLoader;
    threshold: number;
    /**
     * Object that implements IImageLazyLoadConfig:
     * headers?: any = custom headers
     * loadingClass?: string = 'custom-loading-class'
     * loadedClass?: string = 'custom-loaded-class'
     * errorClass?: string = 'custom-error-class'
     */
    imageLazyLoadConfig: IImageLazyLoadConfig;
    private items;
    private itemsToLoad;
    private _sub;
    constructor(lazyLoader: ImageLazyLoaderService);
    private loadInView(list?);
    private scrollSubscribe();
    private init();
    ngOnInit(): void;
    ngAfterContentInit(): void;
}
export declare const IMAGELAZYLOAD_DIRECTIVES: any[];
