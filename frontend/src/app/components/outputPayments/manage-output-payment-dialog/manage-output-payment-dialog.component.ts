import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  NgModel,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

//Services
import { ResourceService } from '../../../services/resource.service';
import { CompanyService } from 'src/app/services/company.service';
import { PaymentService } from 'src/app/services/payment.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-manage-output-payment-dialog',
  templateUrl: './manage-output-payment-dialog.component.html',
  styleUrls: ['./manage-output-payment-dialog.component.css'],
})
export class ManageOutputPaymentDialogComponent {
  // Required
  registerForm: FormGroup;
  company_data: any = {};
  loaded: boolean = false;
  isAdd: boolean = false;
  checked: boolean = false;

  search = '';

  current_resource: any = {};
  current_payment: any = {};

  // By me
  hide = true;
  error: string;
  success: string;

  // Data for fields
  partners: any = [];
  partnersCopy: any = [];
  selected_partner: any = {};
  delegates: any = [];
  delegatesCopy: any = [];
  selected_delegate: any = {};
  emitors: any = [];
  emitorsCopy: any = [];
  selected_emitor: any = {};
  payment_types: any = [];
  payment_typesCopy: any = [];
  selected_payment_type: any = {};

  receipt_date = new FormControl();
  payment_date = new FormControl();

  // Backend Data

  constructor(
    public dialogRef: MatDialogRef<ManageOutputPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private resourceService: ResourceService,
    private companyService: CompanyService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {
    this.isAdd = this.data.isAdd;
    if (this.isAdd) {
      // Default Values
      this.receipt_date.setValue(new Date());
      this.payment_date.setValue(new Date());
      this.current_payment['amount'] = 1;
    } else {
      this.current_payment = _.cloneDeep(this.data.payment);
      this.payment_date.setValue(
        this.stringToDate(this.current_payment['payment_date'])
      );
    }

    // this.partners = this.data.partners;
    // this.partnersCopy = _.cloneDeep(this.data.partners);
  }

  async ngOnInit() {
    await this.prefillFields();

    this.loaded = true;
    // await this.prefillFields();
  }

  async prefillFields() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  addDateEvent(event: MatDatepickerInputEvent<Date>) {
    this.registerForm.value.employment_date = new Date(event.value);
  }

  onInputChange(type, event) {
    switch (type) {
      case 'payment_date':
        this.current_payment['payment_date'] = this.payment_date.value;
        break;
      case 'total':
        this.calculateTotals();
        break;
      case 'price_unit':
        this.calculateTotals();
        break;
    }
  }

  onSearch(key, value) {
    switch (key) {
      case 'partners':
        if (value.length === 0) {
          this.partners = this.partnersCopy;
        }

        if (value.length > 0) {
          this.partners = this.partnersCopy.filter((item: any) => {
            if (item.name.toLowerCase().includes(value.toLowerCase())) {
              return true;
            }
            return false;
          });
        }
        break;
    }
  }

  async getAllPartners() {
    await this.getAllPartnersCompany();
    this.partnersCopy = [...this.partners];
  }
  async getAllPartnersCompany() {
    await this.companyService
      .getAllCompanyPartnersByCompanyId(1)
      .then((res: any) => {
        this.partners = [...this.partners, ...res];
      })
      .catch((err) => {
        console.log('ERR: ', err);
      });
  }

  tickVat() {
    this.current_payment['isVat'] = !this.current_payment['isVat'];
    if (this.current_payment['amount'] && this.current_payment['price_unit'])
      this.calculateTotals();
  }

  calculateTotals() {
    this.current_payment['vat_value'] = 0.19 * this.current_payment['total'];
  }
  registerResource() {
    if (!this.checkFields()) return;
    this.error = '';
    this.success = '';

    let added_payment = {
      payment_date: this.payment_date.value,
      series_number: this.current_payment['series_number'],
      name: this.current_payment['name'],
      company_id: this.data.user_company.id,
      vat_value: this.current_payment['vat_value']
        ? this.current_payment['vat_value']
        : 0,
      total: this.current_payment['total'],
      removed: false,
    };
    this.paymentService
      .addOutputPayment(added_payment)
      .then((res) => {
        if (res && res.id) {
          this.dialogRef.close(res);
        }
      })
      .catch((err) => {
        this.snackBar.open(err, 'Cancel', {
          duration: 3000,
          panelClass: 'center',
        });
      });
  }

  updateInputPayment() {
    if (!this.checkFields()) return;
    this.error = '';
    this.success = '';

    let updated_payment = {
      id: this.current_payment['id'],
      payment_date: this.payment_date.value,
      series_number: this.current_payment['series_number'],
      name: this.current_payment['name'],
      company_id: this.data.user_company.id,
      vat_value: this.current_payment['vat_value']
        ? this.current_payment['vat_value']
        : 0,
      total: this.current_payment['total'],
      removed: false,
    };
    this.paymentService
      .updateOutputPayment(updated_payment)
      .then((res) => {
        if (res && res.outputPayment.id) {
          this.dialogRef.close(res.outputPayment);
        }
      })
      .catch((err) => {
        this.snackBar.open(err, 'Cancel', {
          duration: 3000,
          panelClass: 'center',
        });
      });
  }

  checkFields(): boolean {
    if (
      !this.current_payment['name'] ||
      !this.current_payment['total'] ||
      !this.current_payment['vat_value'] ||
      !this.current_payment['series_number']
    ) {
      return false;
    } else {
      return true;
    }
  }

  // Return a date from the string DD.MM.YYYY
  stringToDate(date: string): Date {
    return new Date(date.split('.').reverse().join('-'));
  }
}
