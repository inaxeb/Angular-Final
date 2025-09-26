import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true,
})
export class AutofocusDirective implements OnInit {
  constructor(private el: ElementRef<HTMLInputElement>) {}
  ngOnInit(): void {
    setTimeout(() => this.el.nativeElement?.focus(), 0);
  }
}
