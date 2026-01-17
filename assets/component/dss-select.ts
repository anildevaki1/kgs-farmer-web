import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, forwardRef, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
  FormsModule
} from '@angular/forms';

@Component({
  selector: 'dss-select',
  template: `
    <div class="custom-select-group relative w-full mb-4">
      <!-- Optional label -->
      <label *ngIf="label" [for]="id" class="block mb-2 text-gray-700 font-medium">
        {{ label }} <span *ngIf="required" class="text-red-500" [ngClass]="ngModel  ? 'text-blue-500' : 'text-red-500'">*</span>
      </label>

      <div class="relative w-full flex items-center">
        <!-- Prefix icon -->
        <ng-container *ngIf="prefixIcon || prefixIonIcon">
          <i *ngIf="prefixIcon" [class]="prefixIcon" class="absolute left-3 text-lg text-gray-600"></i>
          <ion-icon *ngIf="prefixIonIcon" [name]="prefixIonIcon" class="absolute left-3 text-lg text-gray-600"></ion-icon>
        </ng-container>

        <!-- Select field -->
        <select
          [id]="id"
          [name]="name"
          [disabled]="disabled"
          [required]="required"
          [(ngModel)]="ngModel"
          (ngModelChange)="onChangeValue($event)"
          (blur)="onTouched()"
          class="w-full border bg-transparent rounded-md py-2 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled selected hidden>{{ placeholder }}</option>
          <option *ngFor="let opt of options" [value]="opt[bindValue]">
            {{ opt[bindLabel] }}
          </option>
        </select>

        <!-- Suffix icon -->
        <ng-container *ngIf="suffixIcon || suffixIonIcon">
          <button
            *ngIf="suffixIcon"
            type="button"
            class="absolute right-3 top-[33%]"
            (click)="onSuffixClick()"
          >
            <i [class]="suffixIcon" class="text-lg"></i>
          </button>

          <ion-icon
            *ngIf="suffixIonIcon"
            [name]="suffixIonIcon"
            class="absolute right-3 text-lg text-gray-600"
          ></ion-icon>
        </ng-container>
      </div>

      <!-- Validation error -->
      <div *ngIf="showError" class="mt-1 text-sm text-red-600">
        {{ errorMessage }}
      </div>
    </div>
  `,
  imports: [FormsModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DssSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DssSelectComponent),
      multi: true
    }
  ],
  schemas: [NO_ERRORS_SCHEMA],
  styles: [`
    .custom-select-group select:focus {
      outline: none;
    }
  `]
})
export class DssSelectComponent implements ControlValueAccessor, Validator {
  @Input() label?: string;
  @Input() id = '';
  @Input() name = '';
  @Input() placeholder = 'Select an option';
  @Input() required = false;
  @Input() disabled = false;
  @Input() errorMessage = 'This field is required';
  @Input() options: { label: string; value: any }[] = [];

  // ✅ Prefix + Suffix support
  @Input() prefixIcon?: string;
  @Input() prefixIonIcon?: string;
  @Input() suffixIcon?: string;
  @Input() suffixIonIcon?: string;

  @Output() suffixClick = new EventEmitter<void>();
  @Output() valueChange = new EventEmitter<any>();
  @Input() bindLabel: string = 'label';
  @Input() bindValue: string = 'value';

  ngModel: any;
  showError = false;

  private onChange: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  writeValue(value: any): void {
    this.ngModel = value;
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

  onChangeValue(value: any) {
    this.ngModel = value;
    this.onChange(value);
    this.valueChange.emit(value);
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
    this.showError = false;
    return null;
  }

  private validateValue() {
    if (this.required && !this.ngModel) {
      this.showError = true;
      this.errorMessage = 'This field is required';
    } else {
      this.showError = false;
    }
  }

  onSuffixClick() {
    this.suffixClick.emit();
  }
}
