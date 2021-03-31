import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthModule } from './auth/auth.module';
import { RentalModule } from './rental/rental.module';
import { UserModule } from './user/user.module';
import { ContactFormModule } from './contact-form/contact-form.module';
import { StaticModule } from './static/static.module';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    AuthModule,
    RentalModule,
    UserModule,
    ContactFormModule,
    StaticModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
