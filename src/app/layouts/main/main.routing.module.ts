import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MainContainerComponent } from './main-ct-component/main-ct.component';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: MainContainerComponent }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    declarations: []
})
export class MainRoutingModule { }
