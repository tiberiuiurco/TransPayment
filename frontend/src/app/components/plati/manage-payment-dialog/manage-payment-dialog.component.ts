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
import {FlotaService} from 'src/app/services/flota.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-manage-payment-dialog',
  templateUrl: './manage-payment-dialog.component.html',
  styleUrls: ['./manage-payment-dialog.component.css'],
})
export class ManagePaymentDialogComponent {
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

  flota: any = {};

  receipt_date = new FormControl();
  payment_date = new FormControl();

  // Backend Data

  constructor(
    public dialogRef: MatDialogRef<ManagePaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private resourceService: ResourceService,
    private companyService: CompanyService,
    private paymentService: PaymentService,
    private flotaService: FlotaService,
    private snackBar: MatSnackBar
  ) {
    this.isAdd = this.data.isAdd;
    this.company_data = this.data.user_company;
    if (this.isAdd) {
      // Default Values
      this.receipt_date.setValue(new Date());
      this.payment_date.setValue(new Date());
      this.current_payment['amount'] = 1;
      this.current_payment['isVat'] = true;
    } else {
      this.current_payment = _.cloneDeep(this.data.payment);
      this.receipt_date.setValue(
        this.stringToDate(this.current_payment['receipt_date'])
      );
      this.payment_date.setValue(
        this.stringToDate(this.current_payment['payment_date'])
      );
    }

    // this.partners = this.data.partners;
    // this.partnersCopy = _.cloneDeep(this.data.partners);
  }

  async ngOnInit() {
    await this.getAllPartners();
    await this.getAllDelegates();
    await this.getAllEmitors();
    await this.getAllPaymentTypes();
    await this.getFlota();

    if (this.isAdd)
      this.current_payment['payment_type'] = this.payment_types.find(
        (payment) => payment.id == 1
      );
    else {
      await this.prefillFields();
    }

    this.loaded = true;
    // await this.prefillFields();
  }

  async prefillFields() {
    if (this.current_payment['isPartnerCompany'])
      this.current_payment['partner'] = this.partners.find(
        (partner) => partner.id == this.current_payment['partner_company'].id
      );
    else
      this.current_payment['partner'] = this.partners.find(
        (partner) => partner.id == this.current_payment['partner_person'].id
      );
    this.current_payment['delegate'] = this.delegates.find(
      (delegate) => delegate.id == this.current_payment['delegate'].id
    );
    this.current_payment['emitor'] = this.emitors.find(
      (emitor) => emitor.id == this.current_payment['emission_resource'].id
    );
    this.current_payment['payment_type'] = this.payment_types.find(
      (payment_type) =>
        payment_type.id == this.current_payment['payment_type'].id
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addDateEvent(event: MatDatepickerInputEvent<Date>) {
    this.registerForm.value.employment_date = new Date(event.value);
  }

  onInputChange(type, event) {
    switch (type) {
      case 'receipt_date':
        this.current_payment['receipt_date'] = this.receipt_date.value;
        break;
      case 'payment_date':
        this.current_payment['payment_date'] = this.payment_date.value;
        break;
      case 'amount':
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
    await this.getAllPartnersPerson();
    this.partnersCopy = [...this.partners];
  }
  async getAllPartnersCompany() {
    await this.companyService
      .getAllCompanyPartnersByCompanyId(this.company_data.id)
      .then((res: any) => {
        this.partners = [...this.partners, ...res];
      })
      .catch((err) => {
        console.log('ERR: ', err);
      });
  }

  async getAllPartnersPerson() {
    await this.companyService
      .getAllPersonPartnersByCompanyId(this.company_data.id)
      .then((res: any) => {
        this.partners = [...this.partners, ...res];
      })
      .catch((err) => {
        console.log('ERR: ', err);
      });
  }

  async getAllDelegates() {
    await this.resourceService
      .getAllDelegatesByCompanyId(this.company_data.id)
      .then((res: any) => {
        if (res && res.length > 0) {
          this.delegates = [...res];
        }
      });
  }
  async getAllEmitors() {
    await this.resourceService.getAllEmitorsByCompanyId(this.company_data.id).then((res: any) => {
      if (res && res.length > 0) {
        this.emitors = [...res];
      }
    });
  }

  async getAllPaymentTypes() {
    await this.paymentService.getAllPaymentTypes().then((res: any) => {
      if (res && res.length > 0) {
        this.payment_types = [...res];
      }
    });
  }

  async getFlota() {
    await this.flotaService.getAllFlotaByCompanyId(this.company_data.id).then((res: any) => {
      if(res && res.length > 0){
        this.flota = _.cloneDeep(res);
      }
    })
  }

  tickVat() {
    this.current_payment['isVat'] = !this.current_payment['isVat'];
    if (this.current_payment['amount'] && this.current_payment['price_unit'])
      this.calculateTotals();
  }

  calculateTotals() {
    this.current_payment['price_for_amount'] = (
      this.current_payment['amount'] * this.current_payment['price_unit']
    ).toFixed(2);
    if (this.current_payment['isVat']) {
      this.current_payment['vat_value'] = (
        this.current_payment['price_for_amount'] * 0.19
      ).toFixed(2);
      this.current_payment['total'] = (
        this.current_payment['price_for_amount'] * 1.19
      ).toFixed(2);
    } else {
      this.current_payment['total'] = this.current_payment['price_for_amount'];
      this.current_payment['vat_value'] = 0;
    }
  }
  registerResource() {
    if (!this.checkFields()) return;
    this.error = '';
    this.success = '';

    let added_payment = {
      receipt_date: this.receipt_date.value,
      payment_date: this.payment_date.value,
      payment_type_id: this.current_payment['payment_type'].id,
      company_id: this.data.user_company.id,
      isPartnerCompany: this.current_payment['partner'].cnp ? false : true,
      delegate_id: this.current_payment['delegate'].id,
      emission_resource_id: this.current_payment['emitor'].id,
      amount: this.current_payment['amount'],
      price_unit: this.current_payment['price_unit'],
      price_for_amount: this.current_payment['price_for_amount'],
      isVat: this.current_payment['isVat'],
      vat_value: this.current_payment['isVat']
        ? this.current_payment['vat_value']
        : 0,
      // vat_percent: this.current_payment['isVat'] ? 19 : 0,
      vat_percent: this.current_payment['isVat'] ? 19 : 0,
      total: this.current_payment['total'],
      paid: false,
      comment: this.current_payment['comment'],
      car_plate: this.current_payment['car_plate'],
      removed: false,
    };
    if (added_payment.isPartnerCompany)
      added_payment['partner_company_id'] = this.current_payment['partner'].id;
    else
      added_payment['partner_person_id'] = this.current_payment['partner'].id;
    this.paymentService
      .addInputPayment(added_payment)
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
      receipt_date: this.receipt_date.value,
      payment_date: this.payment_date.value,
      payment_type_id: this.current_payment['payment_type'].id,
      company_id: this.data.user_company.id,
      isPartnerCompany: this.current_payment['partner'].cnp ? false : true,
      delegate_id: this.current_payment['delegate'].id,
      emission_resource_id: this.current_payment['emitor'].id,
      amount: this.current_payment['amount'],
      price_unit: this.current_payment['price_unit'],
      price_for_amount: this.current_payment['price_for_amount'],
      isVat: this.current_payment['isVat'],
      vat_value: this.current_payment['isVat']
        ? this.current_payment['vat_value']
        : 0,
      // vat_percent: this.current_payment['isVat'] ? 19 : 0,
      vat_percent: this.current_payment['isVat'] ? 19 : 0,
      total: this.current_payment['total'],
      paid: this.current_payment['paid'],
      comment: this.current_payment['comment'],
      car_plate: this.current_payment['car_plate'],
      removed: false,
    };
    if (updated_payment.isPartnerCompany)
      updated_payment['partner_company_id'] =
        this.current_payment['partner'].id;
    else
      updated_payment['partner_person_id'] = this.current_payment['partner'].id;
    this.paymentService
      .updateInputPayment(updated_payment)
      .then((res) => {
        if (res && res.inputPayment.id) {
          this.dialogRef.close(res.inputPayment);
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
    // if(!this.current_payment['receipt_data'] || !this.){
    //     return false;
    // }
    if (
      // !this.current_payment['receipt_date'] ||
      // !this.current_payment['payment_date'] ||
      !this.current_payment['partner'] ||
      !this.current_payment['payment_type'] ||
      !this.current_payment['emitor'] ||
      !this.current_payment['delegate'] ||
      !this.current_payment['amount'] ||
      !this.current_payment['price_unit']
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
