import { Component, ViewEncapsulation } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types';

@Component({
  selector: 'eco-settings-sidebar',
  template: `
    <div class="py-10">
      <!-- Add any extra content that might be supplied with the component -->
      <div class="extra-content">
        <ng-content></ng-content>
      </div>

      <!-- Fixed demo sidebar -->
      <div class="mx-6 text-3xl font-bold tracking-tighter">Settings</div>
      <fuse-vertical-navigation
        [appearance]="'default'"
        [navigation]="menuData"
        [inner]="true"
        [mode]="'side'"
        [name]="'eco-settings-sidebar-navigation'"
        [opened]="true"></fuse-vertical-navigation>

      <!-- Storage -->
      <div class="mx-6 mt-2">
        <div class="flex items-center">
          <mat-icon
            class="mr-2 icon-size-5"
            [svgIcon]="'heroicons_solid:database'"></mat-icon>
          <div class="text-lg font-semibold">SKUs</div>
        </div>
        <div class="flex flex-col flex-auto mt-4">
          <span class="text-sm leading-none mb-3">12,000 of 20,000 used</span>
          <mat-progress-bar
            [mode]="'determinate'"
            [color]="'primary'"
            [value]="19.9"></mat-progress-bar>
        </div>
      </div>

      <!-- Users -->
      <div class="mx-6 mt-10">
        <div class="flex items-center">
          <mat-icon
            class="mr-2 icon-size-5"
            [svgIcon]="'heroicons_solid:users'"></mat-icon>
          <div class="text-lg font-semibold">Integrations</div>
        </div>
        <div class="flex flex-col flex-auto mt-4">
          <span class="text-sm leading-none mb-3"
            >2 of 3 integrations used</span
          >
          <mat-progress-bar
            [mode]="'determinate'"
            [color]="'accent'"
            [value]="40"></mat-progress-bar>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      demo-sidebar fuse-vertical-navigation .fuse-vertical-navigation-wrapper {
        box-shadow: none !important;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsSidebarComponent {
  menuData: FuseNavigationItem[];

  /**
   * Constructor
   */
  constructor() {
    this.menuData = [
      {
        title: 'General Settings',
        subtitle: 'Task, project & team',
        type: 'group',
        children: [
          {
            title: 'Your Details',
            type: 'basic',
            icon: 'heroicons_outline:plus-circle',
            link: 'account',
          },
          {
            title: 'Users',
            type: 'basic',
            icon: 'heroicons_outline:user-add',
            link: 'users',
          },
        ],
      },
      {
        title: 'Integrations',
        type: 'group',
        children: [
          {
            title: 'All Integrations',
            type: 'basic',
            icon: 'heroicons_outline:clipboard-list',
            link: 'integrations',
          },
          {
            title: 'Source channel',
            type: 'basic',
            icon: 'heroicons_outline:clipboard-copy',
            link: 'source-channel',
          },
          {
            title: 'Custom integration request',
            type: 'basic',
            icon: 'heroicons_outline:clipboard-check',
            link: 'custom-integration-request',
          },
        ],
      },
      {
        title: 'PIM Settings',
        type: 'group',
        children: [
          {
            title: 'Categories',
            type: 'collapsable',
            icon: 'heroicons_outline:cog',
            children: [
              {
                title: 'Tasks',
                type: 'basic',
              },
              {
                title: 'Users',
                type: 'basic',
              },
              {
                title: 'Teams',
                type: 'basic',
              },
            ],
          },
          {
            title: 'Custom fields',
            type: 'collapsable',
            icon: 'heroicons_outline:user-circle',
            children: [
              {
                title: 'Personal',
                type: 'basic',
              },
              {
                title: 'Payment',
                type: 'basic',
              },
              {
                title: 'Security',
                type: 'basic',
              },
            ],
          },
          {
            title: 'Source mapping',
            type: 'collapsable',
            icon: 'heroicons_outline:user-circle',
            children: [
              {
                title: 'Personal',
                type: 'basic',
              },
              {
                title: 'Payment',
                type: 'basic',
              },
              {
                title: 'Security',
                type: 'basic',
              },
            ],
          },
        ],
      },
      {
        type: 'divider',
      },
    ];
  }
}
