import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

//Services
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-register-account-dialog',
  templateUrl: './register-account-dialog.component.html',
  styleUrls: ['./register-account-dialog.component.css'],
})
export class RegisterAccountDialogComponent implements OnInit {
  // Required
  registerForm: FormGroup;
  company_data: any = {};
  loaded: boolean = false;
  isAdd: boolean = false;

  // By me
  hide = true;
  error: string;
  success: string;

  constructor(
    public dialogRef: MatDialogRef<RegisterAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private companyService: CompanyService,
    private snackBar: MatSnackBar
  ) {
    if (!this.data.user_company || !this.data.user_company.id) {
      this.isAdd = true;
    }
  }

  async ngOnInit() {
    if (this.isAdd) {
      this.registerForm = this.formBuilder.group({
        name: ['', [Validators.required]],
        cui: ['', [Validators.required]],
        rc: ['', Validators.required],
        address: ['', Validators.required],
        email: ['', Validators.required],
        phone: ['', Validators.required],
        iban: ['', Validators.required],
        serie_factura: ['', Validators.required],
        nr_factura: [''],
        serie_chitanta: ['', Validators.required],
        nr_chitanta: [''],
      });
      this.loaded = true;
    } else this.company_data = await this.getCurrentCompany();
  }

  async getCurrentCompany() {
    await this.companyService
      .getCompanyById(this.data.user_company.id)
      .then((res: any) => {
        if (res && res.id) {
          if (res && Object.keys(res).length !== 0) {
            this.registerForm = this.formBuilder.group({
              name: [res.name, [Validators.required]],
              cui: [res.cui, [Validators.required]],
              rc: [res.rc, Validators.required],
              address: [res.address, Validators.required],
              email: [res.email, Validators.required],
              phone: [res.phone, Validators.required],
              iban: [res.iban, Validators.required],
              serie_factura: [res.serie_factura, Validators.required],
              nr_factura: [res.nr_factura],
              serie_chitanta: [res.serie_chitanta, Validators.required],
              nr_chitanta: [res.nr_chitanta],
            });
            this.loaded = true;
          }
        }
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  registerCompany() {
    this.error = '';
    this.success = '';

    if (!this.registerForm.valid) {
      this.error = 'Please complete all fields !';
      return;
    }

    // Implicit values
    if (this.registerForm.value.nr_factura == '')
      this.registerForm.value.nr_factura = 1;
    else {
      this.registerForm.value.nr_factura = parseInt(
        this.registerForm.value.nr_factura
      );
      if (!this.registerForm.value.nr_factura) {
        this.snackBar.open('Numarul facturii este invalid!', 'Cancel', {
          duration: 3000,
          panelClass: 'center',
        });
        return;
      }
    }
    if (this.registerForm.value.nr_chitanta == '')
      this.registerForm.value.nr_chitanta = 1;
    else {
      this.registerForm.value.nr_chitanta = parseInt(
        this.registerForm.value.nr_chitanta
      );
      if (!this.registerForm.value.nr_chitanta) {
        this.snackBar.open('Numarul chitantei este invalid!', 'Cancel', {
          duration: 3000,
          panelClass: 'center',
        });
        return;
      }
    }

    this.companyService
      .addCompany(this.registerForm.value, this.data.user_id)
      .then((res: any) => {
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

  editCompany() {
    this.error = '';
    this.success = '';

    if (!this.registerForm.valid) {
      this.error = 'Please complete all fields !';
      return;
    }

    // Implicit values
    if (this.registerForm.value.nr_factura == '')
      this.registerForm.value.nr_factura = 1;
    else {
      this.registerForm.value.nr_factura = parseInt(
        this.registerForm.value.nr_factura
      );
      if (!this.registerForm.value.nr_factura) {
        this.snackBar.open('Numarul facturii este invalid!', 'Cancel', {
          duration: 3000,
          panelClass: 'center',
        });
        return;
      }
    }
    if (this.registerForm.value.nr_chitanta == '')
      this.registerForm.value.nr_chitanta = 1;
    else {
      this.registerForm.value.nr_chitanta = parseInt(
        this.registerForm.value.nr_chitanta
      );
      if (!this.registerForm.value.nr_chitanta) {
        this.snackBar.open('Numarul chitantei este invalid!', 'Cancel', {
          duration: 3000,
          panelClass: 'center',
        });
        return;
      }
    }

    let updateCompany = {
      ...this.registerForm.value,
      id: this.data.user_company.id,
    };
    this.companyService
      .updateCompany(updateCompany)
      .then((res: any) => {
        if (res && res.status) {
          this.dialogRef.close(res.company);
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
