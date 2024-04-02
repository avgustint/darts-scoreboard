import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { WorkspaceComponent } from "./workspace.component";
import { WorkspaceRoutingModule } from "./workspace-routing.module";

@NgModule({
  declarations: [
    WorkspaceComponent,
  ],
  imports: [
    CommonModule,
    WorkspaceRoutingModule
  ]
})
export class WorkspaceModule { }
