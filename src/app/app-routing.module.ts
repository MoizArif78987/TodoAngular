import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './Components/users/users.component';
import { TestComponent } from './Components/test/test.component';

const routes: Routes = [
  {
    path: '',
    component:UsersComponent
  },
  {
    path:'test',
    component:TestComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
