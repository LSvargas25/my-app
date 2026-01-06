import { Routes } from '@angular/router';

export const warehouseRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/warehouse-list/warehouse-list.component').then(m => m.WarehouseListComponent)
  }
];
