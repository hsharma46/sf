import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[OnlyNumberComma]'
})
export class OnlyNumberAndComma {

    constructor(private el: ElementRef) { }

    @Input('OnlyNumberComma') OnlyNumber: boolean;   

    @HostListener('keydown', ['$event']) onkeydown(event:any) {
        let e = <KeyboardEvent>event;
        if (this.OnlyNumber) {                        
            //&& (e.keyCode < 96 || e.keyCode > 105)
            //&& e.keyCode != 188 for ,
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) && (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode != 38
                && e.keyCode != 39 && e.keyCode != 40) && e.keyCode != 188) {
                e.preventDefault();                
            }
        }
    }
}