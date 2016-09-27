import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import '../style/app.scss';
export declare class AppComponent {
    atTop: boolean;
    images: Array<any>;
    constructor();
    addImage(): void;
}
