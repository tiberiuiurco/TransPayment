import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PlatiComponent } from './components/plati/plati.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfilComponent } from './components/profil/profil.component';
import { SetupPageComponent } from './components/setup-page/setup-page.component';
import { OutputPaymentsComponent } from './components/outputPayments/outputPayments.component';
import { FlotaComponent } from './components/flota/flota.component';
import { InrolareComponent } from './components/inrolare/inrolare.component';

const routes: Routes = [
  {
    path: '',
    component: ProfilComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'intrari',
    component: PlatiComponent,
  },
  {
    path: 'iesiri',
    component: OutputPaymentsComponent,
  },
  {
    path: 'profil',
    component: ProfilComponent,
  },
  {
    path: 'setup',
    component: SetupPageComponent,
  },
  {
    path: 'flota',
    component: FlotaComponent,
  },
  {
    path: 'inrolare',
    component: InrolareComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
