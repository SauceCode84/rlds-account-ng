import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from "@angular/core";

@Directive({
  selector: "[formatNumber]"
})
export class FormatNumberDirective implements OnInit, OnChanges {
  
  private el: HTMLInputElement;

  @Input("formatNumber")
  public input: any;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.value = this.formatNumber(this.el.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.input && !this.hasFocus) {
      this.el.value = this.formatNumber(changes.input.currentValue);
    }
  }

  private get hasFocus() {
    return this.el === document.activeElement;
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    this.el.value = parseFloat(value).toString();
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    this.el.value = this.formatNumber(value);
  }

  private formatNumber(value): string {
    let result: any = Math.round(value * 100) / 100;
    return parseFloat(result).toFixed(2);
  }

}
