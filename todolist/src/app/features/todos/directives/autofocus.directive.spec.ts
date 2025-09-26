import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AutofocusDirective } from './autofocus.directive';

@Component({
  standalone: true,
  imports: [AutofocusDirective],
  template: `<input appAutofocus />`
})
class Host {}

describe('AutofocusDirective', () => {
  it('should create and not crash', async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
