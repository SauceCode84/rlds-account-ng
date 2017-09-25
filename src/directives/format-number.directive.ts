import { Directive, OnInit, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[formatNumber]"
})
export class FormatNumberDirective implements OnInit {
  
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.value = this.formatNumber(this.el.value);
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
