import { Component, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CompanyService } from 'src/app/services/company.service';
import { Router } from '@angular/router';

// import { ManagePaymentDialogComponent } from './manage-payment-dialog/manage-payment-dialog.component';
import { ManageOutputPaymentDialogComponent } from './manage-output-payment-dialog/manage-output-payment-dialog.component';

import { PaymentService } from 'src/app/services/payment.service';

import * as _ from 'lodash';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-outputPayments',
  templateUrl: './outputPayments.component.html',
  styleUrls: ['./outputPayments.component.css'],
  encapsulation: ViewEncapsulation.None,
})
// make a Person
export class OutputPaymentsComponent {
  user_company: any = {};
  user_information: any = null;

  // Table Properties
  current_payment_date_sort: string = 'desc';
  current_value_sort: string = 'desc';

  isLoading: boolean = true;
  canBeDone: boolean = false;

  selected_interval: number = 1;
  paginator = {
    page: 0,
    offset: 0,
    limit: 20,
    count: 0,
    pageIndex: 0,
  };

  constructor(
    private userService: UserService,
    private paymentService: PaymentService,
    private companyService: CompanyService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  outputPayments: any = [];
  async ngOnInit() {
    await this.getUserInformation();
    await this.getUserCompany();
    // await this.getAllOutputPaymentsByCompanyId();
    if (this.user_company) {
      await this.getMonthIntervalOutputPaymentsPagination(1);
      if (this.outputPayments.length > 0) {
        this.canBeDone = true;
      }
    }
    this.isLoading = false;
    try {
      var myAnchor = document.getElementById('mat-paginator-page-size-label-0');
      myAnchor.textContent = 'Linii maxime pe pagina';
    } catch (err) { }
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
    const dialogRef = this.dialog.open(ManageOutputPaymentDialogComponent, {
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
        result.payment_date = this.formatDate(result.payment_date);
        if (isAdd) this.outputPayments.push(result);
        else {
          // Change the existing payments
          let index = this.outputPayments.findIndex(
            (payment) => payment.id == result.id
          );
          this.outputPayments[index] = result;
        }
      }
    });
  }

  // async getAllOutputPaymentsByCompanyId() {
  //   await this.paymentService
  //     .getAllOutputPaymentsByCompanyId(this.user_company.id)
  //     .then((res) => {
  //       if (res && res.length > 0) {
  //         res.forEach((payment) => {
  //           payment.payment_date = this.formatDate(payment.payment_date);
  //           payment.payment_date = this.formatDate(payment.payment_date);
  //         });
  //         this.outputPayments = _.cloneDeep(res);
  //         this.sortPaymentsByReceiptDate('desc', this.outputPayments);
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

  sortPaymentsByReceiptDate(type: string, payments: any) {
    switch (type) {
      case 'asc':
        payments.sort((a, b) => {
          return (
            new Date(this.dotStringFormatToDate(a.payment_date)).getTime() -
            new Date(this.dotStringFormatToDate(b.payment_date)).getTime()
          );
        });
        this.current_payment_date_sort = 'asc';
        break;
      case 'desc':
        payments.sort((a, b) => {
          return (
            new Date(this.dotStringFormatToDate(b.payment_date)).getTime() -
            new Date(this.dotStringFormatToDate(a.payment_date)).getTime()
          );
        });
        this.current_payment_date_sort = 'desc';
        break;
    }
  }

  changeReceiptDateSort() {
    if (this.current_payment_date_sort == 'asc')
      this.sortPaymentsByReceiptDate('desc', this.outputPayments);
    else this.sortPaymentsByReceiptDate('asc', this.outputPayments);
  }

  sortPaymentsByValue(type: string, payments: any) {
    switch (type) {
      case 'asc':
        payments.sort((a, b) => {
          return a.total - b.total;
        });
        this.current_value_sort = 'asc';
        break;
      case 'desc':
        payments.sort((a, b) => {
          return b.total - a.total;
        });
        this.current_value_sort = 'desc';
        break;
    }
  }

  changeValueSort() {
    if (this.current_value_sort == 'asc')
      this.sortPaymentsByValue('desc', this.outputPayments);
    else this.sortPaymentsByValue('asc', this.outputPayments);
  }

  async getMonthIntervalOutputPayments(nr_months: number) {
    // this.isLoading = true;
    await this.paymentService
      .getMonthIntervalOutputPayments(this.user_company.id, nr_months)
      .then((res) => {
        if (res && res.length > 0) {
          res.forEach((payment) => {
            payment.payment_date = this.formatDate(payment.payment_date);
          });
          this.outputPayments = _.cloneDeep(res);
          this.sortPaymentsByReceiptDate('desc', this.outputPayments);
          this.selected_interval = nr_months;
          this.isLoading = false;
        }
      });
  }
  async getMonthIntervalOutputPaymentsPagination(nr_months: number) {
    // this.isLoading = true;
    if (nr_months != this.selected_interval) {
      this.paginator = {
        page: 0,
        offset: 0,
        limit: 20,
        count: 0,
        pageIndex: 0,
      };
    }
    await this.paymentService
      .getMonthIntervalOutputPaymentsPagination(
        this.paginator.offset,
        this.paginator.limit,
        this.user_company.id,
        nr_months
      )
      .then((res) => {
        if (res && res.rows && res.rows.length > 0) {
          res.rows.forEach((payment) => {
            payment.payment_date = this.formatDate(payment.payment_date);
          });
          this.outputPayments = _.cloneDeep(res.rows);
          this.paginator.count = res.count;
          this.sortPaymentsByReceiptDate('desc', this.outputPayments);
          this.selected_interval = nr_months;
          this.isLoading = false;
        } else {
          this.outputPayments = _.cloneDeep([]);
          this.isLoading = false;
        }
      });
  }

  async receivePage(eventArg) {
    this.paginator.offset = eventArg.pageIndex * this.paginator.limit;
    await this.getMonthIntervalOutputPaymentsPagination(this.selected_interval);
  }
}
