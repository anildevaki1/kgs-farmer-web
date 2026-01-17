import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[capitalize]'
})
export class CapitalizeDirective {
  private composing = false;

  constructor(private el: ElementRef) {}

  // Track IME composition
  @HostListener('compositionstart') onCompositionStart() { this.composing = true; }
  @HostListener('compositionend', ['$event']) onCompositionEnd(event: CompositionEvent) {
    this.composing = false;
    // process final value after composition ends
    const tgt = event.target as HTMLElement;
    const value = this.getNativeValue(tgt);
    this.processInput(value);
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    if (this.composing) return;
    const input = event.target as HTMLElement;
    const value = this.getNativeValue(input);
    this.processInput(value);
  }

  // find the native <input> or <textarea> element and return its value (or '' if none)
  private getNativeInput(el?: HTMLElement): HTMLInputElement | HTMLTextAreaElement | null {
    const host = el || (this.el && (this.el.nativeElement as HTMLElement));

    if (!host) return null;

    // if host is already a native input/textarea
    if (host instanceof HTMLInputElement || host instanceof HTMLTextAreaElement) {
      return host;
    }

    // common wrappers: search for an input or textarea inside
    const foundInput = host.querySelector && (host.querySelector('input') || host.querySelector('textarea'));
    if (foundInput instanceof HTMLInputElement || foundInput instanceof HTMLTextAreaElement) {
      return foundInput;
    }

    // For Ionic <ion-input>, the real input sits inside shadow DOM. Try known patterns:
    //  - Ion input often exposes a shadow input under shadowRoot -> input
    //  - But direct access to shadowRoot may be blocked; querySelector('input') sometimes works on the host
    // If nothing found, return null.
    return null;
  }

  private getNativeValue(el?: HTMLElement): string {
    const native = this.getNativeInput(el);
    if (native) return native.value;
    // fallback: try reading host.value (some custom components expose it)
    const host: any = this.el && (this.el.nativeElement as any);
    if (host && typeof host.value === 'string') return host.value;
    return '';
  }

  private processInput(currentValue: string) {
    const native = this.getNativeInput();
    const host: any = this.el && (this.el.nativeElement as any);

    const transformed = this.capitalizeWords(currentValue);

    // If there is no native input element, try to set host.value if writable, otherwise skip.
    if (!native) {
      if (host && typeof host.value === 'string') {
        if (host.value !== transformed) host.value = transformed;
      }
      return;
    }

    // preserve caret positions safely
    const start = native.selectionStart;
    const end = native.selectionEnd;

    if (transformed === currentValue) {
      return; // nothing changed
    }

    const posFromEnd = (typeof start === 'number') ? (currentValue.length - start) : null;

    native.value = transformed;

    // restore caret only if setSelectionRange exists and start/end are numbers
    if (typeof native.setSelectionRange === 'function') {
      if (posFromEnd !== null && typeof end === 'number' && typeof start === 'number') {
        const newPos = Math.max(0, transformed.length - posFromEnd);
        const newEnd = newPos + (end - start);
        native.setSelectionRange(newPos, newEnd);
      } else if (typeof start === 'number' && typeof end === 'number') {
        native.setSelectionRange(start, end);
      }
    }
  }

  private capitalizeWords(value: any): string {
    if (typeof value !== 'string') return '';
    return value
      .split(' ')
      .map(word => {
        if (!word) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }
}


// import { Directive, ElementRef, HostListener } from '@angular/core';

// @Directive({
//   selector: '[capitalize]'
// })
// export class CapitalizeDirective {
//   private composing = false;

//   constructor(private el: ElementRef<HTMLInputElement>) {}

//   @HostListener('compositionstart')
//   onCompositionStart() {
//     this.composing = true;
//   }

//   @HostListener('compositionend', ['$event'])
//   onCompositionEnd(event: CompositionEvent) {
//     this.composing = false;
//     // After composition ends, process the final value
//     this.processInput((event.target as HTMLInputElement).value);
//   }

//   @HostListener('input', ['$event'])
//   onInput(event: Event): void {
//     if (this.composing) return; // don't interfere with IME/compose
//     const input = event.target as HTMLInputElement;
//     this.processInput(input.value);
//   }

// @HostListener('blur')
//   onBlur() {
//     const input = this.el.nativeElement;
//     this.processInput(input.value);
//   }

//   private processInput(currentValue: string) {
//     const input = this.el.nativeElement;
//     // save caret positions (may be null)
//     const start = input.selectionStart;
//     const end = input.selectionEnd;

//     const transformed = this.capitalizeWords(currentValue);

//     // if nothing to change, avoid resetting the value (prevents caret jump)
//     if (transformed === currentValue) {
//       return;
//     }

//     // compute caret position relative to the end so it's resilient to small changes
//     const posFromEnd = (typeof start === 'number') ? (currentValue.length - start) : null;

//     input.value = transformed;

//     // restore caret safely
//     if (posFromEnd !== null) {
//       const newPos = Math.max(0, transformed.length - posFromEnd);
//       input.setSelectionRange(newPos, newPos + (end! - start!));
//     } else if (start !== null && end !== null) {
//       // fallback - if both present just restore them
//       input.setSelectionRange(start, end);
//     }
//   }

//   private capitalizeWords(value: any): string {
//     if (typeof value !== 'string') return '';
//     // collapse multiple spaces? up to you — here we preserve spacing but avoid empty words capitalizing
//     return value
//       .split(' ')
//       .map(word => {
//         if (word.length === 0) return word; // keep multiple spaces
//         return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//       })
//       .join(' ');
//   }
// }




// import { Directive, ElementRef, HostListener } from '@angular/core';

// @Directive({
//   selector: '[capitalize]'
// })
// export class CapitalizeDirective {
//   constructor(private el: ElementRef<HTMLInputElement>) {}

//   @HostListener('input', ['$event'])
//   onInput(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     const start = input.selectionStart;
//     const end = input.selectionEnd;

//     const capitalized = this.capitalizeWords(input.value);
//     input.value = capitalized;

//     input.setSelectionRange(start, end);
//   }

//   private capitalizeWords(value: any): string {
//     if (typeof value !== 'string') return '';
//     return value
//       .toLowerCase()
//       .split(' ')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   }
// }
