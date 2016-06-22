import { ViewChild, Directive, Component, ElementRef, EventEmitter, Renderer, OnInit, OnDestroy } from '@angular/core';


interface IElPosition {
  width: number, height: number, left: number, top: number
}

interface IPosition {
  x: number, y: number
}

@Directive({
  selector: '[resizable]',
  host: {
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd($event)',
    '(drag)': 'onDrag($event)'
  }
})
export class Resizable implements OnInit {
  private _elementPosition: IElPosition = { width: 0, height: 0, left: 0, top: 0 };
  private _elementCurrentPosition: IElPosition = { width: 0, height: 0, left: 0, top: 0 };
  private _lastMousePosition: IPosition = { x: 0, y: 0 };
  private _firstMousePosition: IPosition = { x: 0, y: 0 };
  private _canTranslate: boolean = true;
  private mustBePosition: Array<string> = ['absolute', 'fixed', 'relative'];
  public constructor(private _element: ElementRef, private _renderer: Renderer) {
    try {
      if (this.mustBePosition.indexOf(this._element.nativeElement.style.position) === -1) {
        console.warn(this._element.nativeElement, 'Must be having position attribute set to ' + this.mustBePosition.join('|'));
      }
    } catch (ex) {
      console.error(ex);
    }
  }
  public ngOnInit(): void {
    this._renderer.setElementAttribute(this._element.nativeElement, 'draggable', 'true');
  }

  private translation(Δposition: IElPosition) {
    this._renderer.setElementStyle(this._element.nativeElement, 'width', Δposition.width + 'px');
    this._renderer.setElementStyle(this._element.nativeElement, 'height', Δposition.height + 'px');
    this._renderer.setElementStyle(this._element.nativeElement, 'top', Δposition.top + 'px');
    this._renderer.setElementStyle(this._element.nativeElement, 'left', Δposition.left + 'px');
  }

  public onDrag(event: MouseEvent) {
    if (event.x === 0 && event.y === 0) return;
    // if (!this._firstMousePosition) {
    // }

    /**
     *y/x *****************
     * 
     *__left____[--w--]
     * 
     * Δx +/- left/right
     * Δy +/- up/down
     */
    let midPointX = (this._elementCurrentPosition.width / 2) + (this._elementCurrentPosition.left);
    let midPointY = (this._elementCurrentPosition.height / 2) + (this._elementCurrentPosition.top);
    let Δx = midPointX - event.x;
    let Δy = midPointY - event.y;

    // this._elementCurrentPosition.height = (event.y) + (this._elementPosition.top + this._elementPosition.height - this._firstMousePosition.y);
    // this._elementCurrentPosition.width = (event.x) + (this._elementPosition.left + this._elementPosition.width - this._firstMousePosition.x);



    if (Δx > 0) { //left
      
         this._elementCurrentPosition.left = event.x + (this._firstMousePosition.x - this._elementPosition.left);
         this._elementCurrentPosition.width +=  event.x + (this._firstMousePosition.x - this._elementPosition.left);
    } else { //right
      this._elementCurrentPosition.width = (event.x) + (this._elementPosition.left + this._elementPosition.width - this._firstMousePosition.x);
    }

    if (Δy) {
      console.log('down');
    }
    else {
      console.log('up');
    }

    this._lastMousePosition.x = event.x;
    this._lastMousePosition.y = event.y;

    this.translation(this._elementCurrentPosition);


    // console.log('Δx = %s , Δy = %s', Δx, Δy);
    // let dx = event.x - this._lastMousePosition.x;
    // let dy = event.y - this._lastMousePosition.y;
    // console.log('\t\t\t dx = %s , dy = %s', dx, dy);

    // if (Math.abs(dx) > Math.abs(dy)) {

  }

  public onDragStart(event: MouseEvent) {
    this._canTranslate = true;
    this._firstMousePosition = { x: event.x, y: event.y };
    this._lastMousePosition = { x: event.x, y: event.y };

    this._elementPosition.width = this._element.nativeElement.offsetWidth;
    this._elementPosition.height = this._element.nativeElement.offsetHeight;
    this._elementPosition.left = this._element.nativeElement.offsetLeft;
    this._elementPosition.top = this._element.nativeElement.offsetTop;

    this._elementCurrentPosition.width = this._element.nativeElement.offsetWidth;
    this._elementCurrentPosition.height = this._element.nativeElement.offsetHeight;
    this._elementCurrentPosition.left = this._element.nativeElement.offsetLeft;
    this._elementCurrentPosition.top = this._element.nativeElement.offsetTop;
  }

  public onDragEnd(event: Event) {
    this._canTranslate = false;
    this._firstMousePosition = { x: 0, y: 0 };
    this._lastMousePosition = { x: 0, y: 0 };
  }
}
