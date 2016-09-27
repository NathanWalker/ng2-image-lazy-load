[![Dependency Status](https://david-dm.org/NathanWalker/ng2-image-lazy-load.svg)](https://david-dm.org/NathanWalker/ng2-image-lazy-load)
[![devDependency Status](https://david-dm.org/NathanWalker/ng2-image-lazy-load/dev-status.svg)](https://david-dm.org/NathanWalker/ng2-image-lazy-load#info=devDependencies)

# ng2-image-lazy-load

Demo: https://ng2-image-lazy-load-demo.herokuapp.com

## Installation
```sh
npm i ng2-image-lazy-load --save
```

## Example implementation

This library utilizes `WebWorkers` (https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) for background loading of images.

By default, the location of the worker file is `assets/js/xhrWorker.js`. You can copy this [xhrWorker.js](https://github.com/NathanWalker/ng2-image-lazy-load/blob/master/src/public/xhrWorker.js) file for your own use from this repo or you can create your own.

To set a custom path to load your worker file relative to your web server root:
```
WebWorkerService.workerUrl = 'path/to/your/custom_worker.js'
```
The example below will help illustrate this.

Also, ensure you've loaded the angular/http bundle as well as this library falls back to using `Http` wherever `Worker` is not supported.

```ts
import {BrowserModule} from "@angular/platform-browser";
import {NgModule, Component} from '@angular/core';
import {HttpModule} from '@angular/http';
import {ImageLazyLoadModule, WebWorkerService} from 'ng2-image-lazy-load';

// default: 'assets/js/xhrWorker.js'
WebWorkerService.workerUrl = 'path/to/your/xhrWorker.js';

// default: true
// set to false if you want to force Http instead of WebWorker
WebWorkerService.enabled = true;

@Component({
    selector: 'app',
    template: `
      <div imageLazyLoadArea>
        <div *ngFor="let image of images">
          <img [imageLazyLoadItem]="image.url"/>
        </div>
      </div>
    `
})
export class AppComponent {
    public images: Array<any> = [
      {
        name:`image 1`,
        url:`image.jpg`
      },
      {
        name:`image 2`,
        url:`image_2.jpg`
      }
    ];
}

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        ImageLazyLoadModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
```

### Configuration

You can configure custom headers as well as custom loading, loaded and error classes by using the `imageLazyLoadConfig` directive:

```
// view template
<div imageLazyLoadArea [imageLazyLoadConfig]="lazyLoadConfig">
  <div *ngFor="let image of images">
    <img [imageLazyLoadItem]="image.url"/>
  </div>
</div>

// Component
public lazyLoadConfig: IImageLazyLoadConfig = {
  headers: {
    'Authorization': 'Bearer auth-token'
  },
  loadingClass: 'custom-loading',
  loadedClass: 'custom-loaded',
  errorClass: 'custom-error'
};
```

## API
### ImageLazyLoaderService
#### Properties:
- `imageCache:any`: Object where the key is the url of the image the library has already loaded and doesn't need to be loaded again. i.e., {'http://domain.com/image.png':true}

#### Methods:
- `load(url: string, headers?: any): Promise<any>`: Load url with optional custom headers
- `loadViaWorker(url: string, headers?: any): Promise<any>`: Use a webworker directly to load url with optional custom headers
- `loadViaHttp(url: string, headers?: any): Promise<any>`: Use the `Http` service directly to load url with optional custom headers

### WebWorkerService
##### This is a helper service used by the library that wraps the usage of the browser's `Worker` api, however you can use it directly if you'd like to interact with it.
#### Properties:
- `static supported: boolean`: Determine if workers are supported
- `static workerUrl: string`: Used to set the path to a worker file. Defaults to 'assets/js/xhrWorker.js'
- `activeWorkers: Array<any>`: At any given moment, this can be checked to see how many workers are currently activated

#### Methods:
- `load(config: any, msgFn: any, errorFn?: any):number`: Load a configuration with your worker and wire it to a `message` function and/or an `error` function. Returns an `id` which can be used to terminate the worker.
- `terminate(id: number)`: Terminate the worker


# How to contribute

See [CONTRIBUTING](https://github.com/NathanWalker/ng2-image-lazy-load/blob/master/CONTRIBUTING.md)

# Big Thank You

This library was made possible with help from this article by [Olivier Combe](https://github.com/ocombe):
https://medium.com/@OCombe/how-to-publish-a-library-for-angular-2-on-npm-5f48cdabf435

Also, this project setup is based on the excellent [angular2-seed](https://github.com/mgechev/angular2-seed) by [Minko Gechev](https://github.com/mgechev).

# License

MIT
