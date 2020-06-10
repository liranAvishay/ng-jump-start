import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { NewOrderRoutingModule } from './new-order-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [SharedModule, NewOrderRoutingModule,ReactiveFormsModule],
  declarations: [NewOrderRoutingModule.components]
})
export class NewOrderModule { }
