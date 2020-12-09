import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrderIdFormComponent } from './components/order-id-form.component';

import { OrderIdService } from './services/service';

const ROUTES: Routes = [
  { path: '', component: OrderIdFormComponent},
  { path: 'order/total/orderId', component: OrderIdFormComponent},
  { path: '**', redirectTo: '/', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    OrderIdFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(ROUTES),
    FormsModule, ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [OrderIdService],
  bootstrap: [AppComponent]
})
export class AppModule { }
