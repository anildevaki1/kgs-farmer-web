import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, forwardRef, NO_ERRORS_SCHEMA, NgZone, inject, ChangeDetectionStrategy } from '@angular/core';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl,
  ValidationErrors, FormsModule
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'dss-input',
  // templateUrl: './dss-input.html',
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:
    ` <div class="custom-input-group relative w-full mb-4">
    <!-- Optional label -->
    @if (label) {
      <label [for]="id" class="block mb-2 text-gray-700 font-medium">
        {{ label }} @if (required) {
        <span class="text-red-500" [ngClass]="required == true  ? 'text-blue-500' : 'text-red-500'">*</span>
      }
    </label>
  }
  
  <div class="relative w-full">
    <!-- PREFIX icon/text inside input -->
    @if (prefixIcon || prefixText) {
      @if (prefixIcon) {
        <i [class]="prefixIcon" class="absolute left-3 top-[33%] text-lg "></i>
      }
      @if (prefixIonIcon) {
        <ion-icon [name]="prefixIonIcon" class="absolute left-3 text-lg text-gray-600"></ion-icon>
      }
      @if (prefixText) {
        <span class="absolute left-3 text-sm text-gray-600">{{ prefixText }}</span>
      }
    }
  
    <!-- Actual input field -->
    <input
      [id]="id"
      [name]="name"
      [type]="type"
      [placeholder]="placeholder"
      [required]="required"
      [disabled]="disabled"
      [minlength]="minlength"
      [maxlength]="maxlength"
      [(ngModel)]="ngModel"
      (ngModelChange)="onChangeValue($event)"
      (focus)="onFocus($event)"
      (blur)="onTouched()"
      [pattern]="pattern"
  
      [class.pl-10]="prefixIcon || prefixIonIcon || prefixText"
      [class.pr-10]="suffixIcon || suffixIonIcon || suffixText"
      class="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
  
      <!-- SUFFIX icon/text inside input -->
      @if (suffixIcon || suffixText) {
        @if (suffixIcon) {
          <button   class="absolute right-3 top-[33%] "  (click)="onSuffixClick()">
            <i  [class]="suffixIcon" class="text-lg "></i>
          </button>
        }
        @if (suffixIonIcon) {
          <ion-icon [name]="suffixIonIcon" class="absolute right-3 text-lg text-gray-600"></ion-icon>
        }
        @if (suffixText) {
          <span class="absolute right-3 text-sm text-gray-600">{{ suffixText }}</span>
        }
      }
    </div>
  
    <!-- Validation error -->
    @if (showError) {
      <div class="mt-1 text-sm text-red-600">
        {{ errorMessage | translate}}
      </div>
    }
  </div>
  `,
  imports: [FormsModule, TranslateModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => dssInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => dssInputComponent),
      multi: true
    }
  ],
  schemas: [NO_ERRORS_SCHEMA],
  styles: [`
  .custom-input-group {
  i, ion-icon {
    pointer-events: none;
  }
  input:focus {
    outline: none;
  }
}`
  ]
})
export class dssInputComponent implements ControlValueAccessor, Validator {
  @Input() label?: string;
  @Input() id = '';
  @Input() name = '';
  @Input() type = 'text';
  @Input() placeholder!: string;
  @Input() autocomplete = 'off';
  @Input() faIcon?: string;
  @Input() ionIcon?: string;
  @Input() minlength?: number;
  @Input() maxlength?: number;
  @Input() iconColor = 'text-blue-700';
  @Input() required = false;
  @Input() disabled = false;
  @Input() pattern: any = null;
  @Input() errorMessage = 'This field is required';
  @Output() suffixClick = new EventEmitter<void>();
  @Output() valueChange = new EventEmitter<any>();
  @Input() prefixIcon?: string;
  @Input() prefixIonIcon?: string;
  @Input() prefixText?: string;
  @Input() suffixIcon?: string;
  @Input() suffixIonIcon?: string;
  @Input() suffixText?: string;
  @Output() focus = new EventEmitter<void>();
  private translate = inject(TranslateService);
  private ngZone = inject(NgZone);
  ngModel: any;
  showError = false;

  private onChange: (value: any) => void = () => { };
  private onTouchedCallback: () => void = () => { };

  writeValue(value: any): void {
    this.ngModel = value;
    this.validateValue();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  onTouched() {
    this.onTouchedCallback();
    this.validateValue();
  }

  onModelChange(value: any) {
    this.ngModel = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onChangeValue(value: any) {
    this.ngModel = value;
    this.onChange(value);

  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (this.required && !value) {
      this.showError = true;
      return { required: true };
    }
    if (this.minlength && value?.length < this.minlength) {
      this.showError = true;
      this.errorMessage = this.translate.instant('Minimum length is', { value: this.minlength });
      return { minlength: true };
    }
    if (this.maxlength && value?.length > this.maxlength) {
      this.showError = true;
      this.errorMessage =this.translate.instant('Maximum length is', { value: this.maxlength }); 
      return { maxlength: true };
    }


    // 👉 PATTERN VALIDATION (IMPORTANT)
  if (this.pattern && value) {
    const regex = new RegExp(this.pattern);
    if (!regex.test(value)) {
      this.showError = true;
      this.errorMessage = 'Invalid format';
      return { pattern: true };
    }
  }

    this.showError = false;
    return null;
  }


  private validateValue() {
    if (this.required && !this.ngModel) {
      this.showError = true;
      this.errorMessage = 'This field is required';
    } else if (this.minlength && this.ngModel?.length < this.minlength) {
      this.showError = true;
      this.errorMessage = this.translate.instant('Minimum length is', { value: this.minlength });
    } else if (this.maxlength && this.ngModel?.length > this.maxlength) {
      this.showError = true;
      this.errorMessage = this.translate.instant('Maximum length is', { value: this.maxlength }); 
    } else {
      this.showError = false;
    }
  }

  onSuffixClick() {
    this.ngZone.run(() => {
      this.suffixClick.emit();
    })
  }

  onFocus(ev) {
    this.focus.emit(ev);
  }

}
