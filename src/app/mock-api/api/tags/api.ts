import { Injectable } from '@angular/core';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { sourceTags, integrationTags, restrictedToCompanyTags } from './data';
import { integrations } from '../integrations/data';
import { sources } from '../sources/data';
import { Tag } from 'app/layout/common/grid/grid.types';

@Injectable({
  providedIn: 'root',
})
export class TagMockApi {
  private _sourceTags: Tag[] = sourceTags;
  private _integrationTags: Tag[] = sourceTags;
  private _restrictedToCompanyTags: Tag[] = restrictedToCompanyTags;
  private _integrations: any[] = integrations?.integrations;
  private _sources: any[] = sources?.sources;

  /**
   * Constructor
   */
  constructor(private _fuseMockApiService: FuseMockApiService) {
    // Register Mock API handlers
    this.registerHandlers();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register Mock API handlers
   */
  registerHandlers(): void {
    // -----------------------------------------------------------------------------------------------------
    // @ Tags - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/tags/sources')
      .reply(() => [200, cloneDeep(this._sourceTags)]);

    // -----------------------------------------------------------------------------------------------------
    // @ Tags - POST
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService.onPost('api/tags/sources').reply(({ request }) => {
      // Get the tag
      const newTag = cloneDeep(request.body.tag);

      // Generate a new GUID
      newTag.id = FuseMockApiUtils.guid();

      // Unshift the new tag
      this._sourceTags.unshift(newTag);

      // Return the response
      return [200, newTag];
    });

    // -----------------------------------------------------------------------------------------------------
    // @ Tags - PATCH
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onPatch('api/tags/sources')
      .reply(({ request }) => {
        // Get the id and tag
        const id = request.body.id;
        const tag = cloneDeep(request.body.tag);

        // Prepare the updated tag
        let updatedTag = null;

        // Find the tag and update it
        this._sourceTags.forEach((item, index, tags) => {
          if (item.id === id) {
            // Update the tag
            tags[index] = assign({}, tags[index], tag);

            // Store the updated tag
            updatedTag = tags[index];
          }
        });

        // Return the response
        return [200, updatedTag];
      });

    // -----------------------------------------------------------------------------------------------------
    // @ Tag - DELETE
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onDelete('api/tags/sources')
      .reply(({ request }) => {
        // Get the id
        const id = request.params.get('id');

        // Find the tag and delete it
        this._sourceTags.forEach((item, index) => {
          if (item.id === id) {
            this._sourceTags.splice(index, 1);
          }
        });

        // Get the products that have the tag
        const integrationsWithTag = this._integrations.filter(
          integration => integration.sourceId.indexOf(id) > -1
        );

        // Iterate through them and delete the tag
        integrationsWithTag.forEach(integration => {
          integration.sourceId.splice(integration.sourceId.indexOf(id), 1);
        });

        // Return the response
        return [200, true];
      });

    // -----------------------------------------------------------------------------------------------------
    // @ Tags - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/tags/restricted-companies')
      .reply(() => [200, cloneDeep(this._restrictedToCompanyTags)]);

    // -----------------------------------------------------------------------------------------------------
    // @ Tags - POST
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onPost('api/tags/restricted-companies')
      .reply(({ request }) => {
        // Get the tag
        const newTag = cloneDeep(request.body.tag);

        // Generate a new GUID
        newTag.id = FuseMockApiUtils.guid();

        // Unshift the new tag
        this._restrictedToCompanyTags.unshift(newTag);

        // Return the response
        return [200, newTag];
      });

    // -----------------------------------------------------------------------------------------------------
    // @ Tags - PATCH
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onPatch('api/tags/restricted-companies')
      .reply(({ request }) => {
        // Get the id and tag
        const id = request.body.id;
        const tag = cloneDeep(request.body.tag);

        // Prepare the updated tag
        let updatedTag = null;

        // Find the tag and update it
        this._restrictedToCompanyTags.forEach((item, index, tags) => {
          if (item.id === id) {
            // Update the tag
            tags[index] = assign({}, tags[index], tag);

            // Store the updated tag
            updatedTag = tags[index];
          }
        });

        // Return the response
        return [200, updatedTag];
      });

    // -----------------------------------------------------------------------------------------------------
    // @ Tag - DELETE
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onDelete('api/tags/restricted-companies')
      .reply(({ request }) => {
        // Get the id
        const id = request.params.get('id');

        // Find the tag and delete it
        this._restrictedToCompanyTags.forEach((item, index) => {
          if (item.id === id) {
            this._restrictedToCompanyTags.splice(index, 1);
          }
        });

        // Get the products that have the tag
        const integrationsWithTag = this._integrations.filter(
          integration => integration.restrictedToCompanies.indexOf(id) > -1
        );

        // Iterate through them and delete the tag
        integrationsWithTag.forEach(integration => {
          integration.restrictedToCompanies.splice(
            integration.restrictedToCompanies.indexOf(id),
            1
          );
        });

        // Return the response
        return [200, true];
      });

    // -----------------------------------------------------------------------------------------------------
    // @ Tags - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/tags/integrations')
      .reply(() => [200, cloneDeep(this._integrationTags)]);

    // -----------------------------------------------------------------------------------------------------
    // @ Tags - POST
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onPost('api/tags/integrations')
      .reply(({ request }) => {
        // Get the tag
        const newTag = cloneDeep(request.body.tag);

        // Generate a new GUID
        newTag.id = FuseMockApiUtils.guid();

        // Unshift the new tag
        this._integrationTags.unshift(newTag);

        // Return the response
        return [200, newTag];
      });

    // -----------------------------------------------------------------------------------------------------
    // @ Tags - PATCH
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onPatch('api/tags/integrations')
      .reply(({ request }) => {
        // Get the id and tag
        const id = request.body.id;
        const tag = cloneDeep(request.body.tag);

        // Prepare the updated tag
        let updatedTag = null;

        // Find the tag and update it
        this._integrationTags.forEach((item, index, tags) => {
          if (item.id === id) {
            // Update the tag
            tags[index] = assign({}, tags[index], tag);

            // Store the updated tag
            updatedTag = tags[index];
          }
        });

        // Return the response
        return [200, updatedTag];
      });

    // -----------------------------------------------------------------------------------------------------
    // @ Tag - DELETE
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onDelete('api/tags/integrations')
      .reply(({ request }) => {
        // Get the id
        const id = request.params.get('id');

        // Find the tag and delete it
        this._integrationTags.forEach((item, index) => {
          if (item.id === id) {
            this._sourceTags.splice(index, 1);
          }
        });

        // Get the products that have the tag
        const sourcessWithTag = this._sources.filter(
          source => source.integration.indexOf(id) > -1
        );

        // Iterate through them and delete the tag
        sourcessWithTag.forEach(source => {
          source.integration.splice(source.integration.indexOf(id), 1);
        });

        // Return the response
        return [200, true];
      });
  }
}
