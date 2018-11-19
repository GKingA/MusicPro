import {NgModule} from "@angular/core";
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule, MatGridListModule, MatDividerModule, MatListModule, MatSlideToggleModule
} from '@angular/material';
@NgModule({
  imports: [
  CommonModule, 
  MatToolbarModule,
  MatButtonModule, 
  MatCardModule,
  MatInputModule,
  MatDialogModule,
  MatTableModule,
  MatMenuModule,
  MatIconModule,
  MatGridListModule,
  MatProgressSpinnerModule,
  MatDividerModule,
  MatListModule,
  MatSlideToggleModule
  ],
  exports: [
  CommonModule,
   MatToolbarModule, 
   MatButtonModule, 
   MatCardModule, 
   MatInputModule, 
   MatDialogModule, 
   MatTableModule, 
   MatMenuModule,
   MatIconModule,
   MatGridListModule,
   MatProgressSpinnerModule,
   MatDividerModule,
   MatListModule,
   MatSlideToggleModule
   ],
})
export class CustomMaterialModule { }