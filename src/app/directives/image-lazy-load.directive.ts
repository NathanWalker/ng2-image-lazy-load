import {Directive, ContentChildren, QueryList, Input, ElementRef, Renderer, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import {ImageLazyLoaderService} from '../services/image-lazy-load.service';

@Directive({
  selector: '[imageLazyLoadItem]'
})
export class ImageLazyLoadItemDirective {
  @Input('imageLazyLoadItem') imageLazyLoadItem: string;
  @Input() imageLazyLoadingContainer: string;
  @Input() imageLazyLoadConfig: any;
  public loading: boolean = false;
  public loaded: boolean = false;
  public error: boolean = false;
  private tagName: string;
  private loadingClass: string = 'loading';
  private loadedClass: string = 'loaded';
  private errorClass: string = 'error';

  constructor(private el: ElementRef, private renderer: Renderer, private lazyLoader: ImageLazyLoaderService) {
    this.tagName = el.nativeElement.tagName;

    if (typeof(this.imageLazyLoadConfig) === 'object') {
      this.loadingClass = this.imageLazyLoadConfig.loadingClass || this.loadingClass;
      this.loadedClass = this.imageLazyLoadConfig.loadedClass || this.loadedClass;
      this.errorClass = this.imageLazyLoadConfig.errorClass || this.errorClass;
    }
  }
  /*
  * @returns return position/dimension info as an Object `{top, left, bottom}`.
  */
  getPosition() {
    let box = this.el.nativeElement.getBoundingClientRect();
    let top = box.top + (window.pageYOffset - document.documentElement.clientTop);
    return {
      top: top,
      left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
      bottom: top + this.el.nativeElement.clientHeight
    };
  }
  /*
  * @returns container target to place `loading`/`loaded` classes onto.
  */
  getLoadingContainer() {
    if (this.imageLazyLoadingContainer) {
      // find parent node with specified selector
      let collectionHas = (a:any, b:any) => {
        for(let i in a) {
          if(a[i] === b) return true;
        }
        return false;
      };
      let all = document.querySelectorAll(this.imageLazyLoadingContainer);
      let cur = this.el.nativeElement.parentNode;
      while(cur && !collectionHas(all, cur)) {
        cur = cur.parentNode;
      }
      if (cur) {
        return cur;
      } else {
        // fallback to direct parentNode if not found
        return this.el.nativeElement.parentNode;
      }
    } else {
      // default is direct parentNode for IMG and the node itself for background-image
      if (this.tagName === 'IMG') {
        return this.el.nativeElement.parentNode;
      } else {
        return this.el.nativeElement;
      }
    }
  }
  hasClassName(name: string) {
    return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(this.getLoadingContainer().className);
  }
  addClassName(name: string) {
    if (!this.hasClassName(name)) {
      let container = this.getLoadingContainer();
      container.className = container.className ? [container.className, name].join(' ') : name;
    }
  }
  removeClassName(name: string) {
    if (this.hasClassName(name)) {
      let container = this.getLoadingContainer();
      let c = container.className;
      container.className = c.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    }
  }
  toggleLoaded(enable:boolean) {
    this.loaded = enable;
    if (enable) {
      this.removeClassName(this.loadingClass);
      this.addClassName(this.loadedClass);
    } else {
      this.removeClassName(this.loadedClass);
    }
  }
  /*
  * starts loading the image in the background.
  */
  loadImage() {
    if (!this.loaded && !this.loading) {
      this.loading = true;
      this.addClassName(this.loadingClass);

      let customHeaders:any = this.imageLazyLoadConfig ? this.imageLazyLoadConfig.headers : null;
      this.lazyLoader.load(this.imageLazyLoadItem, customHeaders).then(() => {
        this.setImage();
      }, (err) => {
        this.error = true;
        this.loading = false;
        this.removeClassName(this.loadingClass);
        this.addClassName(this.errorClass);
      });
    }
  }
  /*
  * sets the image to `imageLazyLoadItem`.
  */
  setImage() {
    if (!this.loaded) {
      if (this.tagName === 'IMG') {
        this.renderer.setElementAttribute(this.el.nativeElement, 'src', this.imageLazyLoadItem);
      } else {
        this.renderer.setElementAttribute(this.el.nativeElement, 'style', `background-image:url('${this.imageLazyLoadItem}')`);
      }
      this.loading = false;
      this.toggleLoaded(true);
    }
  }
}

@Directive({
  selector: '[imageLazyLoadArea]'
})
export class ImageLazyLoadAreaDirective implements OnInit {
  @Input('imageLazyLoadArea') threshold: number;
  @ContentChildren(ImageLazyLoadItemDirective) private items: QueryList<ImageLazyLoadItemDirective>;
  private itemsToLoad: Array<any>;
  private _sub: Subscription;

  private loadInView(list?: Array<ImageLazyLoadItemDirective>): void {
    this.itemsToLoad = (list || this.itemsToLoad).filter((item) => !item.loaded && !item.loading);
    for (let item of this.itemsToLoad) {
      let ePos = item.getPosition();
      console.log((ePos.bottom > 0 && (ePos.bottom >= (window.pageYOffset - this.threshold)) && (ePos.top <= ((window.pageYOffset + window.innerHeight) + this.threshold))));
      if (ePos.bottom > 0 && (ePos.bottom >= (window.pageYOffset - this.threshold)) && (ePos.top <= ((window.pageYOffset + window.innerHeight) + this.threshold))) {
        item.loadImage();
      }
    }
    if (this.itemsToLoad.length === 0 && this._sub) {
      // subscription is no longer needed
      this._sub.unsubscribe();
      this._sub = undefined;
    }
  }
  private scrollSubscribe() {
    let scrollStream = Observable.fromEvent(window, 'scroll').debounceTime(250);

    this._sub = scrollStream.subscribe(() => {
      this.loadInView();
    });
  }
  private init() {

    let subScroll = () => {
      if (!this._sub) {
        this.scrollSubscribe();
      }
    };

    // load the initial children in view
    if (this.items.length) {
      // using setTimeout to ensure styles have applied before triggering load
      setTimeout(() => {
        this.loadInView(this.items.toArray());
      });
    }

    // listen to scroll event
    subScroll();

    // fired with subsequent changes
    // ideally this would fire on subscribe but it doesn't
    // therefore the above ensures it's handled on ngAfterContentInit
    this.items.changes.subscribe((list) => {
      console.log('item changes...');
      this.loadInView(list.toArray());
      // since scroll subscription is unsuscribed when all items have loaded
      // ensure it is re-subscribed when changes occur
      subScroll();
    });
  }
  ngOnInit() {
    this.threshold = +this.threshold || 100;
  }
  ngAfterContentInit() {
    this.init();
  }
}

export const IMAGELAZYLOAD_DIRECTIVES: any[] = [ImageLazyLoadAreaDirective, ImageLazyLoadItemDirective];
