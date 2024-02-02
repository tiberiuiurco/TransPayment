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
import { FlotaService } from 'src/app/services/flota.service';

@Component({
  selector: 'app-manage-flota-dialog',
  templateUrl: './manage-flota-dialog.component.html',
  styleUrls: ['./manage-flota-dialog.component.css'],
})
export class ManageFlotaDialogComponent {
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

  // types = [
  //     {id: 1, name: "Prelata"},
  //     {id: 2, name: "Carosat"},
  //     {id: 3, name: "TIR"},
 types = [
      "Prelata",
     "Carosat",
    "TIR",
    ];
 // ];

  search: string = "";


  constructor(
    public dialogRef: MatDialogRef<ManageFlotaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private companyService: CompanyService,
    private flotaService: FlotaService
  ) {
    this.company_data = this.data.user_company;
    this.isAdd = this.data.isAdd;
    if (!this.isAdd)
      this.current_client = _.cloneDeep(this.data.element);
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

      this.flotaService
        .addFlota(this.current_client, this.company_data.id)
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

  async onEdit() {
    if (!this.checkFields()) return;

      this.flotaService
        .updateFlota(this.current_client, this.company_data.id)
        .then((res) => {
          if (res) {
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

  checkFields(): boolean {
        if (
          this.current_client.car_plate &&
          this.current_client.tip
          // this.current_client.iban
        )
          return true;
        else return false;
  }

  onSearch(type:string, event:any){

  }
}
