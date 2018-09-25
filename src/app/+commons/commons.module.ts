import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { GraphComponent } from './graph/graph.component';
import { TableComponent } from './table/table.component';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule
  ],
  declarations: [GraphComponent, TableComponent],
  exports: [
    ChartsModule,
    GraphComponent,
    TableComponent
  ]
})
export class CommonsModule { }
