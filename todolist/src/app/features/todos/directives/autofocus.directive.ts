import { Directive, ElementRef, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true,
})
export class AutofocusDirective implements OnInit {
  private el = inject(ElementRef) as ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    queueMicrotask(() => this.el.nativeElement?.focus());
  }
}
