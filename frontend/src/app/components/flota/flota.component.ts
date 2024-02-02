import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import * as _ from 'lodash';

// Components

// Services
import { UserService } from 'src/app/services/user.service';
import { ResourceService } from 'src/app/services/resource.service';
import { FlotaService } from 'src/app/services/flota.service';
import { CompanyService } from 'src/app/services/company.service';
import { ManageFlotaDialogComponent } from './manage-flota-dialog/manage-flota-dialog.component';

@Component({
  selector: 'app-flota',
  templateUrl: './flota.component.html',
  styleUrls: ['./flota.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class FlotaComponent {
  constructor(
    private userService: UserService,
    private resourceService: ResourceService,
    private companyService: CompanyService,
    private router: Router,
    private dialog: MatDialog,
    private flotaService: FlotaService
  ) { }

  user_company: any = {};
  user_information: any = null;
  paginator = {
    page: 0,
    offset: 0,
    limit: 17,
    count: 0,
    pageIndex: 0,
  };
  isLoading: boolean = true;
  canBeDone: boolean = false;

  // Page Variables
  viewTypes = ['Clients', 'Employees'];
  viewType: string = 'Employees';
  clientsType: string = 'companies';

  clients: any = [];
  employees: any = [];
  flota: any = [];

  async ngOnInit() {
    await this.getUserInformation();
    // Default table
    if (this.user_company) {
      // await this.switchClients('people');
      await this.switchEmployees();
      await this.getFlota();
      this.canBeDone = true;
    } else {
    }
    this.isLoading = false;
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

  async switchEmployees() {
    this.viewType = 'Employees';
    this.resourceService
      .getAllResourcesByCompanyIdPagination(
        this.paginator.offset,
        this.paginator.limit,
        this.user_company.id
      )
      .then((res) => {
        if (res && res.rows && res.rows.length > 0) {
          res.rows.sort((a, b) => (a === b ? 0 : a ? 1 : -1));
          this.paginator.count = res.count;
          this.employees = res.rows;
        }
      });
  }

  async getFlota() {
    this.flotaService.getAllFlotaByCompanyId(this.user_company.id)
      .then((res) => {
        if(res && res.length > 0){
          this.flota = _.cloneDeep(res);
        }
      })
  }


  async onAdd() {
        await this.manage_flota(true);
  }

  async onEdit(element: any) {
        await this.manage_flota(false, element);
  }

  async manage_flota(isAdd: boolean, element: any = null) {
    const dialogRef = this.dialog.open(ManageFlotaDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        isAdd: isAdd,
        user_company: this.user_company,
        element: element,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (isAdd) {
          // Push the result on the resources[0] and shift all the elements to the end with 1 position
          result.payments_number = 0;
          this.flota.splice(0, 0, result);
        } else if(!isAdd && result.vehicle) {
          let index = _.findIndex(this.flota, {
            id: result.vehicle.id,
          });
          this.flota[index] = result.vehicle;
        }
      }
    });
  }
}
