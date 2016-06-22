import {Component} from '@angular/core';
import {Resizable} from '../lib';
@Component({
    selector: 'my-app',
    template: `<div style="position:fixed; background-color: whitesmoke;" resizable > <h1>It is a resizeable component. </h1> </div>
    `,
    directives: [Resizable] 
})
export class AppComponent { }
