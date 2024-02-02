import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import * as _ from 'lodash';

// Components
import { ManageResourceDialogComponent } from '../profil/manage-resource-dialog/manage-resource-dialog.component';

// Services
import { UserService } from 'src/app/services/user.service';
import { ResourceService } from 'src/app/services/resource.service';
import { CompanyService } from 'src/app/services/company.service';
import { ManagePartnerDialogComponent } from './manage-partner-dialog/manage-partner-dialog.component';

@Component({
  selector: 'app-setup-page',
  templateUrl: './setup-page.component.html',
  styleUrls: ['./setup-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SetupPageComponent {
  constructor(
    private userService: UserService,
    private resourceService: ResourceService,
    private companyService: CompanyService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  localStorage = localStorage;
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
  viewType: string = 'Clients';
  clientsType: string = 'companies';

  clients: any = [];
  employees: any = [];

  async ngOnInit() {
    await this.getUserInformation();
    // Default table
    if (this.user_company) {
      await this.switchClients('companies');
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

  async switchClients(type: string) {
    this.viewType = 'Clients';

    switch (type) {
      case 'companies':
        this.clientsType = 'companies';
        this.resetPaginator();
        this.companyService
          .getAllCompanyPartnersByCompanyIdPagination(
            this.paginator.offset,
            this.paginator.limit,
            this.user_company.id
          )
          .then((res) => {
            this.paginator.count = res.count;
            this.clients = res.rows;
          });
        break;
      case 'people':
        this.clientsType = 'people';
        this.resetPaginator();
        this.companyService
          .getAllPersonPartnersByCompanyIdPagination(
            this.paginator.offset,
            this.paginator.limit,
            this.user_company.id
          )
          .then((res) => {
            this.paginator.count = res.count;
            this.clients = res.rows;
          });
        break;
    }
  }
  async switchEmployees() {
    this.viewType = 'Employees';
    this.resetPaginator();
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

  async receivePage(eventArg, type:string) {
    this.paginator.offset = eventArg.pageIndex * this.paginator.limit;
    switch(type){
      case 'companies':
        this.companyService
          .getAllCompanyPartnersByCompanyIdPagination(
            this.paginator.offset,
            this.paginator.limit,
            this.user_company.id
          )
          .then((res) => {
            this.paginator.count = res.count;
            this.clients = res.rows;
          });
        break;
      case 'people':
        this.companyService
          .getAllPersonPartnersByCompanyIdPagination(
            this.paginator.offset,
            this.paginator.limit,
            this.user_company.id
          )
          .then((res) => {
            this.paginator.count = res.count;
            this.clients = res.rows;
          });
        break;
    }
  }

  resetPaginator() {
    this.paginator = {
      page: 0,
      offset: 0,
      limit: 17,
      count: 0,
      pageIndex: 0,
    };
  }

  async onAdd() {
    switch (this.viewType) {
      case 'Clients':
        await this.manage_client(true, this.clientsType);
        break;
      case 'Employees':
        await this.manage_resource(true);
        break;
    }
  }

  async onEdit(element: any) {
    switch (this.viewType) {
      case 'Clients':
        await this.manage_client(false, this.clientsType, element);
        break;
      case 'Employees':
        await this.manage_resource(false, element);
        break;
    }
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
          // Push the result on the resources[0] and shift all the elements to the end with 1 position
          this.employees.splice(0, 0, result);
        } else {
          let index = _.findIndex(this.employees, {
            cnp: result.cnp,
          });
          this.employees[index] = result;
        }
      }
    });
  }
  async manage_client(isAdd: boolean, type: string, partner: any = null) {
    const dialogRef = this.dialog.open(ManagePartnerDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        isAdd: isAdd,
        user_company: this.user_company,
        client: partner,
        type: type,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.id) {
        if (isAdd) {
          this.clients.splice(0, 0, result);
        } else {
          if (type == 'companies') {
            let index = _.findIndex(this.clients, {
              cui: result.cui,
            });
            this.clients[index] = result;
          } else if (type == 'people') {
            let index = _.findIndex(this.clients, {
              cnp: result.cnp,
            });
            this.clients[index] = result;
          }
        }
      }
      // if (result && result.id) {
      // if (isAdd) {
      //   // Push the result on the resources[0] and shift all the elements to the end with 1 position
      //   this.employees.splice(0, 0, result);
      // } else {
      //   let index = _.findIndex(this.employees, {
      //     cnp: result.cnp,
      //   });
      //   this.employees[index] = result;
      // }
      // }
    });
  }
}
