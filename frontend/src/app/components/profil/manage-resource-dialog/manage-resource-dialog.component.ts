import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

//Services
import { ResourceService } from '../../../services/resource.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-manage-resource-dialog',
  templateUrl: './manage-resource-dialog.component.html',
  styleUrls: ['./manage-resource-dialog.component.css'],
})
export class ManageResourceDialogComponent {
  // Required
  registerForm: FormGroup;
  company_data: any = {};
  loaded: boolean = false;
  isAdd: boolean = false;
  checked: boolean = false;

  current_resource: any = {};

  // By me
  hide = true;
  error: string;
  success: string;

  constructor(
    public dialogRef: MatDialogRef<ManageResourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private resourceService: ResourceService,
    private snackBar: MatSnackBar
  ) {
    this.isAdd = this.data.isAdd;
    this.current_resource = _.cloneDeep(this.data.resource);
  }

  async ngOnInit() {
    await this.prefillFields();
  }

  async prefillFields() {
    if (this.isAdd) {
      this.registerForm = this.formBuilder.group({
        cnp: ['', [Validators.required]],
        name: ['', [Validators.required]],
        address: ['', Validators.required],
        phone: ['', Validators.required],
        id_series: ['', Validators.required],
        id_number: ['', Validators.required],
        employment_date: [new Date(), Validators.required],
        contract_number: ['', Validators.required],
        isDriver: [false, Validators.required],
      });
      this.loaded = true;
    } else if (this.current_resource) {
      this.registerForm = this.formBuilder.group({
        cnp: [this.current_resource.cnp, [Validators.required]],
        name: [this.current_resource.name, [Validators.required]],
        address: [this.current_resource.address, Validators.required],
        phone: [this.current_resource.phone, Validators.required],
        id_series: [this.current_resource.id_series, Validators.required],
        id_number: [this.current_resource.id_number, Validators.required],
        employment_date: [
          this.current_resource.employment_date,
          Validators.required,
        ],
        contract_number: [
          this.current_resource.contract_number,
          Validators.required,
        ],
        isDriver: [this.current_resource.isDriver, Validators.required],
      });
      this.loaded = true;
    }

    // } else
    //   this.companyService
    //     .getCompanyById(this.data.user_company.id)
    //     .then((res: any) => {
    //       if (res && res.id) {
    //         if (res && Object.keys(res).length !== 0) {
    //           this.registerForm = this.formBuilder.group({
    //             name: [res.name, [Validators.required]],
    //             id: [res.id, [Validators.required]],
    //             rc: [res.rc, Validators.required],
    //             address: [res.address, Validators.required],
    //             email: [res.email, Validators.required],
    //             phone: [res.phone, Validators.required],
    //             iban: [res.iban, Validators.required],
    //             serie_factura: [res.serie_factura, Validators.required],
    //             nr_factura: [res.nr_factura],
    //             serie_chitanta: [res.serie_chitanta, Validators.required],
    //             nr_chitanta: [res.nr_chitanta],
    //           });
    //           this.loaded = true;
    //         }
    //       }
    //     });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  registerResource() {
    this.error = '';
    this.success = '';

    if (!this.registerForm.valid) {
      this.error = 'Please complete all fields !';
      return;
    }

    this.resourceService
      .addResource(this.registerForm.value, this.data.user_company.id)
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

  editResource() {
    this.error = '';
    this.success = '';

    if (!this.registerForm.valid) {
      this.error = 'Please complete all fields !';
      return;
    }

    this.resourceService
      .updateResource(this.registerForm.value, this.data.user_company.id)
      .then((res: any) => {
        if (res && res.status) {
          this.dialogRef.close(res.resource);
        }
      })
      .catch((err) => {
        this.snackBar.open(err, 'Cancel', {
          duration: 3000,
          panelClass: 'center',
        });
      });
  }

  addDateEvent(event: MatDatepickerInputEvent<Date>) {
    this.registerForm.value.employment_date = new Date(event.value);
  }
}
