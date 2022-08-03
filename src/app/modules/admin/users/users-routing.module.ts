import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersGridComponent } from './grid/users-grid.component';
import { UsersResolver, UserTagsResolver } from './users.resolvers';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
    },
    {
        path: 'list',
        component: UsersGridComponent,
        resolve: {
            users: UsersResolver,
            tags: UserTagsResolver,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TenantsRoutingModule {}
