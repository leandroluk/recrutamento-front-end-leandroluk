import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';

import { sessionReducer } from './+core/session.store';

export interface IAppStore {
  session: any
}

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({ session: sessionReducer })
  ],
  declarations: [],
  exports: [
    StoreModule
  ]
})
export class AppStoreModule { }
