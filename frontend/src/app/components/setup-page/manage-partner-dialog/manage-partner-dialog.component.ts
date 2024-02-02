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

import * as _ from 'lodash';

// Services
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-manage-partner-dialog',
  templateUrl: './manage-partner-dialog.component.html',
  styleUrls: ['./manage-partner-dialog.component.css'],
})
export class ManagePartnerDialogComponent {
  // Required
  registerForm: FormGroup;
  company_data: any = {};
  loaded: boolean = false;
  isAdd: boolean = false;
  client_type: string = 'companies'; // people / companies

  current_client: any = {};

  // By me
  hide = true;
  error: string;
  success: string;

  constructor(
    public dialogRef: MatDialogRef<ManagePartnerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private companyService: CompanyService
  ) {
    this.company_data = this.data.user_company;
    this.isAdd = this.data.isAdd;
    if (this.isAdd) {
      this.client_type = this.data.type;
    } else {
      this.current_client = _.cloneDeep(this.data.client);
      this.client_type = this.data.type;
    }
  }

  async ngOnInit() {
    // await this.prefillFields();
    this.loaded = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onInputChange(type, event) {
    switch (type) {
      case '':
        break;
    }
  }

  async onAdd() {
    if (!this.checkFields()) return;

    if (this.client_type == 'companies') {
      this.companyService
        .createPartnerCompany(this.current_client, this.company_data.id)
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
    } else if (this.client_type == 'people') {
      this.companyService
        .createPartnerPerson(this.current_client, this.company_data.id)
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
  }

  async onEdit() {
    if (!this.checkFields()) return;

    if (this.client_type == 'companies') {
      this.companyService
        .updatePartnerCompany(this.current_client, this.company_data.id)
        .then((res) => {
          if (res && res.partner && res.partner.id) {
            this.dialogRef.close(res.partner);
          }
        })
        .catch((err) => {
          this.snackBar.open(err, 'Cancel', {
            duration: 3000,
            panelClass: 'center',
          });
        });
    } else if (this.client_type == 'people') {
      this.companyService
        .updatePartnerPerson(this.current_client, this.company_data.id)
        .then((res) => {
          if (res && res.partner && res.partner.id) {
            this.dialogRef.close(res.partner);
          }
        })
        .catch((err) => {
          this.snackBar.open(err, 'Cancel', {
            duration: 3000,
            panelClass: 'center',
          });
        });
    }
  }

  checkFields(): boolean {
    switch (this.client_type) {
      case 'companies':
        if (
          this.current_client.name &&
          this.current_client.cui &&
          this.current_client.rc &&
          this.current_client.address
          // this.current_client.iban
        )
          return true;
        else return false;
      case 'people':
        if (
          this.current_client.name &&
          this.current_client.cnp &&
          this.current_client.address &&
          this.current_client.id_series &&
          this.current_client.id_number
        )
          return true;
        else return false;
      default:
        return false;
    }
  }
}
