import { NgModule } from '@angular/core';
import { MatCheckboxModule, MatRadioModule, MatSelectModule,
         MatDividerModule, MatInputModule, MatDatepickerModule,
         MatNativeDateModule, MatIconModule, MatButtonModule,
         MatChipsModule, MatProgressSpinnerModule, MatTooltipModule,
         MatTabsModule, MatDialogModule, MatListModule,
         MatGridListModule, MatTableModule, MatCardModule } from '@angular/material';

@NgModule({
  exports: [
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatDividerModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatTabsModule,
    MatDialogModule,
    MatListModule,
    MatGridListModule,
    MatTableModule,
    MatCardModule
  ]
})
export class MatComponentsModule { }
