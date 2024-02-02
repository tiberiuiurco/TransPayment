import { Component, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CompanyService } from 'src/app/services/company.service';
import { Router } from '@angular/router';

import { ManagePaymentDialogComponent } from './manage-payment-dialog/manage-payment-dialog.component';

import { PaymentService } from 'src/app/services/payment.service';

import { generateOneInvoice } from './invoice-generator';

import * as _ from 'lodash';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-plati',
  templateUrl: './plati.component.html',
  styleUrls: ['./plati.component.css'],
  encapsulation: ViewEncapsulation.None,
})
// make a Person
export class PlatiComponent {
  user_company: any = {};
  user_information: any = null;

  // Table Properties
  current_receipt_date_sort: string = 'desc';
  current_value_sort: string = 'desc';

  isLoading: boolean = true;
  canBeDone: boolean = false;

  selected_interval: number = 1;
  paginator = {
    page: 0,
    offset: 0,
    limit: 18,
    count: 0,
    pageIndex: 0,
  };

  constructor(
    private userService: UserService,
    private paymentService: PaymentService,
    private companyService: CompanyService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  inputPayments: any = [];
  async ngOnInit() {
    await this.getUserInformation();
    await this.getUserCompany();
    // await this.getAllInputPaymentsByCompanyId();
    if (this.user_company) {
      await this.getMonthIntervalInputPaymentsPagination(1);
      if (this.inputPayments.length > 0) {
        this.canBeDone = true;
      }
    }
    this.isLoading = false;
    try {
      var myAnchor = document.getElementById('mat-paginator-page-size-label-0');
      myAnchor.textContent = 'Linii maxime pe pagina';
    } catch (err) {}
  }

  async getUserInformation() {
    let usr_id = localStorage.getItem('id');
    if (!usr_id) {
      this.router.navigate(['/login']);
      return;
    }
    await this.userService
      .getUserById(usr_id)
      .then((res: any) => {
        this.user_information = res;
        this.user_company = res?.company;
      })
      .catch((err) => {
        console.log('ERR: ', err);
      });
  }

  async getUserCompany() {
    this.companyService
      .getCompanyById(this.user_information.company.id)
      .then((res) => {
        if (res) {
          this.user_company = res;
        }
      });
  }

  async manage_payment(isAdd: boolean, payment: any = null) {
    const dialogRef = this.dialog.open(ManagePaymentDialogComponent, {
      width: '850px',
      disableClose: true,
      data: {
        isAdd: isAdd,
        user_company: this.user_company,
        payment: payment,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.id) {
        result.receipt_date = this.formatDate(result.receipt_date);
        result.payment_date = this.formatDate(result.payment_date);
        if (isAdd) this.inputPayments.push(result);
        else {
          // Change the existing payments
          let index = this.inputPayments.findIndex(
            (payment) => payment.id == result.id
          );
          this.inputPayments[index] = result;
        }
      }
    });
  }

  // async getAllInputPaymentsByCompanyId() {
  //   await this.paymentService
  //     .getAllInputPaymentsByCompanyId(this.user_company.id)
  //     .then((res) => {
  //       if (res && res.length > 0) {
  //         res.forEach((payment) => {
  //           payment.receipt_date = this.formatDate(payment.receipt_date);
  //           payment.payment_date = this.formatDate(payment.payment_date);
  //         });
  //         this.inputPayments = _.cloneDeep(res);
  //         this.sortPaymentsByReceiptDate('desc', this.inputPayments);
  //         this.isLoading = false;
  //       }
  //     });
  // }
  // Format date from "2023-03-29T15:36:11.000Z" to "29-03-2023"
  formatDate(date: string) {
    if (!date) return 'N/A';
    let d = new Date(date);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  }
  // Format from "DD.MM.YYYY" to Date
  dotStringFormatToDate(date: string) {
    date = date.split('.').reverse().join('-');
    return new Date(date);
  }

  mark_paid(payment) {
    this.paymentService.markInputPaymentPaid(payment.id).then((res) => {
      payment.paid = true;
    });
  }

  sortPaymentsByReceiptDate(type: string, payments: any) {
    switch (type) {
      case 'asc':
        payments.sort((a, b) => {
          return (
            new Date(this.dotStringFormatToDate(a.receipt_date)).getTime() -
            new Date(this.dotStringFormatToDate(b.receipt_date)).getTime()
          );
        });
        this.current_receipt_date_sort = 'asc';
        break;
      case 'desc':
        payments.sort((a, b) => {
          return (
            new Date(this.dotStringFormatToDate(b.receipt_date)).getTime() -
            new Date(this.dotStringFormatToDate(a.receipt_date)).getTime()
          );
        });
        this.current_receipt_date_sort = 'desc';
        break;
    }
  }

  changeReceiptDateSort() {
    if (this.current_receipt_date_sort == 'asc')
      this.sortPaymentsByReceiptDate('desc', this.inputPayments);
    else this.sortPaymentsByReceiptDate('asc', this.inputPayments);
  }

  sortPaymentsByValue(type: string, payments: any) {
    switch (type) {
      case 'asc':
        payments.sort((a, b) => {
          return a.price_for_amount - b.price_for_amount;
        });
        this.current_value_sort = 'asc';
        break;
      case 'desc':
        payments.sort((a, b) => {
          return b.price_for_amount - a.price_for_amount;
        });
        this.current_value_sort = 'desc';
        break;
    }
  }

  changeValueSort() {
    if (this.current_value_sort == 'asc')
      this.sortPaymentsByValue('desc', this.inputPayments);
    else this.sortPaymentsByValue('asc', this.inputPayments);
  }

  async getMonthIntervalInputPayments(nr_months: number) {
    // this.isLoading = true;
    await this.paymentService
      .getMonthIntervalInputPayments(this.user_company.id, nr_months)
      .then((res) => {
        if (res && res.length > 0) {
          res.forEach((payment) => {
            payment.receipt_date = this.formatDate(payment.receipt_date);
            payment.payment_date = this.formatDate(payment.payment_date);
          });
          this.inputPayments = _.cloneDeep(res);
          this.sortPaymentsByReceiptDate('desc', this.inputPayments);
          this.selected_interval = nr_months;
          this.isLoading = false;
        }
      });
  }
  async getMonthIntervalInputPaymentsPagination(nr_months: number) {
    // this.isLoading = true;
    if (nr_months != this.selected_interval) {
      this.paginator = {
        page: 0,
        offset: 0,
        limit: 18,
        count: 0,
        pageIndex: 0,
      };
    }
    await this.paymentService
      .getMonthIntervalInputPaymentsPagination(
        this.paginator.offset,
        this.paginator.limit,
        this.user_company.id,
        nr_months
      )
      .then((res) => {
        if (res && res.rows && res.rows.length > 0) {
          res.rows.forEach((payment) => {
            payment.receipt_date = this.formatDate(payment.receipt_date);
            payment.payment_date = this.formatDate(payment.payment_date);
          });
          this.inputPayments = _.cloneDeep(res.rows);
          this.paginator.count = res.count;
          this.sortPaymentsByReceiptDate('desc', this.inputPayments);
          this.selected_interval = nr_months;
          this.isLoading = false;
        } else {
          this.inputPayments = _.cloneDeep([]);
          this.isLoading = false;
        }
      });
  }

  async receivePage(eventArg) {
    this.paginator.offset = eventArg.pageIndex * this.paginator.limit;
    await this.getMonthIntervalInputPaymentsPagination(this.selected_interval);
  }

  async generateInvoicePerPayment(payment: any, type: string) {
    let paymentComplete = _.cloneDeep({
      ...payment,
      company: this.user_company,
    });
    generateOneInvoice(paymentComplete, type);
  }
}
