import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {DeviceListingComponent} from "./device-listing/device-listing.component";
import {DeviceCreateComponent} from "./device-create/device-create.component";
import {ApplicationPaths} from "../../core/utils/constants";
import {DeviceEditComponent} from "./device-edit/device-edit.component";
import { DeviceCreateMultipleComponent } from './device-create-multiple/device-create-multiple.component';
import { MoveDeviceComponent } from './move-device/move-device.component';

const routes: Routes = [
  {
    path: '',
    component: DeviceListingComponent
  },
  {
    path: `${ApplicationPaths.DeviceCreate}`,
    component: DeviceCreateComponent
  },
  {
    path: `${ApplicationPaths.DeviceEdit}/:deviceId`,
    component: DeviceEditComponent
  },
  {
    path: `${ApplicationPaths.DeviceCreateMultiple}`,
    component: DeviceCreateMultipleComponent
  },
  { 
    path: `${ApplicationPaths.DeviceMove}/:deviceId`,
    component: MoveDeviceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class DeviceRoutingModule { }
