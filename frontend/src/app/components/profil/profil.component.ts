import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ResourceService } from 'src/app/services/resource.service';
import { PaymentService } from 'src/app/services/payment.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

// import lodash as _
import * as _ from 'lodash';

// Components
import { RegisterAccountDialogComponent } from './register-account-dialog/register-account-dialog.component';
import { ManageResourceDialogComponent } from './manage-resource-dialog/manage-resource-dialog.component';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfilComponent {
  // make function which quick sorts an array
  localStorage = localStorage;
  user_company: any = {};
  user_information: any = null;
  company_employees: any = [];
  annual_graph_data: any = {};
  selected_month: any = {};
  selected_year: any = new Date().getFullYear();
  years = [2023, 2022, 2021, 2020, 0];
  search: string = '';
  top10Clients: { name: String; sum: Number }[] = [];
  vatSectionData: any = null;
  constructor(
    private userService: UserService,
    private resourceService: ResourceService,
    private paymentService: PaymentService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  months = [
    { 0: 'Ianuarie', name: 'Ianuarie', id: '0' },
    { 1: 'Februarie', name: 'Februarie', id: '1' },
    { 2: 'Martie', name: 'Martie', id: '2' },
    { 3: 'Aprilie', name: 'Aprilie', id: '3' },
    { 4: 'Mai', name: 'Mai', id: '4' },
    { 5: 'Iunie', name: 'Iunie', id: '5' },
    { 6: 'Iulie', name: 'Iulie', id: '6' },
    { 7: 'August', name: 'August', id: '7' },
    { 8: 'Septembrie', name: 'Septembrie', id: '8' },
    { 9: 'Octombrie', name: 'Octombrie', id: '9' },
    { 10: 'Noiembrie', name: 'Noiembrie', id: '10' },
    { 11: 'Decembrie', name: 'Decembrie', id: '11' },
  ];

  async ngOnInit() {
    await this.getUserInformation();
    this.selectToday();
    this.selected_year = new Date().getFullYear();
    await this.getGraphData('annual', {});
    await this.getGraphData('monthly', {
      month: parseInt(this.selected_month.id),
      year: this.selected_year,
    });
    if (this.user_company && this.user_company.id)
      await this.resourceService
        .getAllResourcesByCompanyId(this.user_company.id)
        .then((res: any) => {
          if (res && res.length > 0) this.company_employees = res;
        });
    await this.getTop10Clients(2023);
    await this.getVatStatisticsData();
  }

  // ngAfterViewInit() {
  //   this.elementRef.nativeElement.ownerDocument.body.style.backg;
  // }

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

  async open_company() {
    const dialogRef = this.dialog.open(RegisterAccountDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        user_id: this.user_information.id,
        user_company: this.user_company,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.id) {
        this.user_company = result;
        // Make user_company be the result
      }
    });
  }

  async manage_resource(isAdd: boolean, resource: any = null) {
    const dialogRef = this.dialog.open(ManageResourceDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        isAdd: isAdd,
        user_company: this.user_company,
        resource: resource,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.id) {
        if (isAdd) {
          this.company_employees.push(result);
        } else {
          // replace the old employee with the new one on the same index
          let index = _.findIndex(this.company_employees, {
            cnp: result.cnp,
          });
          this.company_employees[index] = result;
        }
      }
    });
  }

  async getGraphData(graph_type: string, options: any) {
    await this.paymentService
      .getInputPaymentGraphData(this.user_company.id, graph_type, options)
      .then((res) => {
        // console.log(res);
        if (res && res.data) {
          const labels = {
            0: 'Ianuarie',
            1: 'Februarie',
            2: 'Martie',
            3: 'Aprilie',
            4: 'Mai',
            5: 'Iunie',
            6: 'Iulie',
            7: 'August',
            8: 'Septembrie',
            9: 'Octombrie',
            10: 'Noiembrie',
            11: 'Decembrie',
          };
          switch (graph_type) {
            case 'annual':
              this.lineChartData1 = {
                labels: Object.values(labels),
                datasets: [
                  {
                    data: Object.values(res.data['cur']),
                    label: 'Curent',
                    fill: false,
                    tension: 0.5,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0,255,0,0.7)',
                  },
                  {
                    data: Object.values(res.data['prev']),
                    label: 'Precendent',
                    fill: false,
                    tension: 0.5,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255,0,0,0.7)',
                  },
                ],
              };
              break;
            case 'monthly':
              this.lineChartData2 = {
                labels: [...Array(31).keys()],
                datasets: [
                  {
                    data: Object.values(res.data['graph1']),
                    label: 'L Curenta',
                    fill: false,
                    tension: 0.5,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0,255,0,0.7)',
                  },
                  {
                    data: Object.values(res.data['graph2']),
                    label: 'L Precedenta',
                    fill: false,
                    tension: 0.5,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255,0,0,0.7)',
                  },
                  {
                    data: Object.values(res.data['graph3']),
                    label: 'An Trecut',
                    fill: false,
                    tension: 0.5,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0,0,255,0.7)',
                  },
                ],
              };
              break;
          }
        }
      });
  }

  async getTop10Clients(year: number) {
    this.paymentService
      .getTop10Clients(this.user_company.id, year)
      .then((result) => {
        if (result && result.status) {
          this.top10Clients = result.data;
        } else {
          this.top10Clients = [];
        }
      });
  }

  async getVatStatisticsData() {
    let options = {
      year: this.selected_year,
      month: parseInt(this.selected_month.id) + 1,
    };
    this.paymentService
      .getVatStatisticsData(this.user_company.id, options)
      .then((result) => {
        if (result && result.data && result.data) {
          this.vatSectionData = result.data;
        } else {
          this.vatSectionData = {};
        }
      });
  }

  async onInputChange(type, value) {
    switch (type) {
      case 'month':
        this.selected_month = _.cloneDeep(this.months[value]);
        await this.getGraphData('monthly', {
          month: parseInt(this.selected_month.id),
          year: this.selected_year,
        });
        await this.getVatStatisticsData();
        break;
      case 'year':
        this.selected_year = parseInt(value);
        await this.getGraphData('monthly', {
          month: parseInt(this.selected_month.id),
          year: this.selected_year,
        });
        await this.getTop10Clients(this.selected_year);
        await this.getGraphData('annual', { year: this.selected_year });
        await this.getVatStatisticsData();
    }
  }

  onSearch(type, event) {}

  selectToday() {
    const todaysMonth = new Date().getMonth();
    this.selected_month = _.cloneDeep(this.months[todaysMonth]);
  }

  title1 = 'ng2-charts-demo';

  public lineChartData1: ChartConfiguration<'line'>['data'];
  public lineChartOptions1: ChartOptions<'line'> = {
    responsive: false,
  };
  public lineChartLegend1 = true;

  // Second graph
  title2 = 'ng2-charts-demo';

  public lineChartData2: ChartConfiguration<'line'>['data'];
  public lineChartOptions2: ChartOptions<'line'> = {
    responsive: false,
  };
  public lineChartLegend2 = true;
}
