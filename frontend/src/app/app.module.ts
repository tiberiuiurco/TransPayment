import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PlatiComponent } from './components/plati/plati.component';
import { ProfilComponent } from './components/profil/profil.component';
import { RegisterAccountDialogComponent } from './components/profil/register-account-dialog/register-account-dialog.component';
import { ManageResourceDialogComponent } from './components/profil/manage-resource-dialog/manage-resource-dialog.component';
import { ManagePaymentDialogComponent } from './components/plati/manage-payment-dialog/manage-payment-dialog.component';
import { OutputPaymentsComponent } from './components/outputPayments/outputPayments.component';
import { ManageOutputPaymentDialogComponent } from './components/outputPayments/manage-output-payment-dialog/manage-output-payment-dialog.component';

import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SetupPageComponent } from './components/setup-page/setup-page.component';
import { ManagePartnerDialogComponent } from './components/setup-page/manage-partner-dialog/manage-partner-dialog.component';
import { FlotaComponent } from './components/flota/flota.component';
import { ManageFlotaDialogComponent } from './components/flota/manage-flota-dialog/manage-flota-dialog.component';
import { InrolareComponent } from './components/inrolare/inrolare.component';
import { NgChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PlatiComponent,
    ProfilComponent,
    RegisterAccountDialogComponent,
    ManageResourceDialogComponent,
    ManagePaymentDialogComponent,
    SetupPageComponent,
    ManagePartnerDialogComponent,
    OutputPaymentsComponent,
    ManageOutputPaymentDialogComponent,
    FlotaComponent,
    ManageFlotaDialogComponent,
    InrolareComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule,
    NgxMatSelectSearchModule,
    MatGridListModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    NgChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
