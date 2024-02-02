import { Component, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CompanyService } from 'src/app/services/company.service';
import { Router } from '@angular/router';


import { PaymentService } from 'src/app/services/payment.service';


import * as _ from 'lodash';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inrolare',
  templateUrl: './inrolare.component.html',
  styleUrls: ['./inrolare.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class InrolareComponent {
  localStorage = localStorage;
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

  enrolls: any = [];
  canEnroll: boolean = true;

  request: any = {};

  constructor(
    private userService: UserService,
    private paymentService: PaymentService,
    private companyService: CompanyService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  inputPayments: any = [];
  async ngOnInit() {
    await this.getUserInformation();
    await this.getUserCompany();
    // Calculare inrolare
    if(localStorage.getItem('role') == '2' && this.user_company){
      this.canEnroll = false;
      await this.getAllEnrolls();
    }
    else{
      this.canEnroll = true;
    }
    // await this.getAllInputPaymentsByCompanyId();
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
    if(!this.user_information.company) return;
    this.companyService
      .getCompanyById(this.user_information.company.id)
      .then((res) => {
        if (res) {
          this.user_company = res;
        }
      });
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

  async getAllEnrolls() {
    await this.userService
      .getAllEnrolls(
        this.user_company.id
      )
      .then((res) => {
        if(res && res.length > 0){
          this.enrolls = _.cloneDeep(res);
        }
      });
  }

  async receivePage(eventArg) {
    this.paginator.offset = eventArg.pageIndex * this.paginator.limit;
    // await this.getMonthIntervalInputPaymentsPagination(this.selected_interval);
  }

  async accept(enroll_id){
    await this.userService.acceptEnroll(enroll_id).then((res) => {
      if(res && res.success){
        let index = this.enrolls.findIndex(item => item.id == enroll_id);
        if(index !== -1) this.enrolls.splice(index, 1);
      }
    })

  }

  onInputChange(type, event) {
    switch (type) {
      case '':
        break;
    }
  }

  submit() {
    // event handler for button with id "but"
    let email = document.getElementById('em')['value'];
    let password = document.getElementById('pass')['value'];

    this.userService
      .setEnroll(this.user_information.id, email, password)
      .then((res: any) => {
        if(res && res.success)
          this.snackBar.open("A fost trimisa cerere catre " + res.what_company + ". Va rugam asteptati pana cererea va fi aprobata.", 'Cancel', {
            duration: 3000,
            panelClass: 'center',
          });
          this.router.navigate(['/profil']);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
