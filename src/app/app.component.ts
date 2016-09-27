import { Component, ViewEncapsulation } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';

import '../style/app.scss';

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  public atTop: boolean = true;
  public images: Array<any> = [
    {
      id: 1,
      name:`Oneonta Falls 1`,
      url:`img/oneonta.jpg`
    },
    {
      id: 2,
      name:`Oneonta Falls 2`,
      url:`img/DSC01920-L.jpg`
    },
    {
      id: 3,
      name:`Oneonta Falls 3`,
      url:`img/oneonta-gorge-800x600.jpg`
    },
    {
      id: 4,
      name:`Oneonta Falls 4`,
      url:`img/oneonta-gorge-11.jpg`
    },
    {
      id: 5,
      name:`Oneonta Falls 5`,
      url:`img/IMG_2039.jpg`
    },
    {
      id: 6,
      name:`Oneonta Falls 6`,
      url:`img/horsetail_falls_9-b.jpg`
    },
    {
      id: 7,
      name:`Oneonta Falls 7`,
      url:`img/P1000662-L.jpg`
    },
    {
      id: 8,
      name:`Oneonta Falls 8`,
      url:`img/DSC01920-L.jpg`
    },
    {
      id: 9,
      name:`Oneonta Falls 9`,
      url:`img/IMG_8356_Medium.JPG`
    },
    {
      id: 10,
      name:`Oneonta Falls 10`,
      url:`img/IMG_2036.jpg`
    }
  ];

  constructor() {
    let scrollStream = Observable.fromEvent(window, 'scroll').debounceTime(500);

    scrollStream.subscribe(() => {
      this.atTop = window.pageYOffset < 25;
    });
  }

  public addImage(): void {
    this.images.push({
      id: 11,
      name: `Simpsons as the ${this.images.length+1}th image!`,
      url: `img/The-Simpsons-post2.jpg`,
      added: true
    });
    if (window.confirm(`You added an image dynamically, click "Ok" to scroll down to see it load in when you get there!`)) {
      setTimeout(function(){
        location.hash = '#11';
      }, 100);

    }
  }
}
