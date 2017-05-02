/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FbServiceService } from './fb-service.service';

describe('FbServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FbServiceService]
    });
  });

  it('should ...', inject([FbServiceService], (service: FbServiceService) => {
    expect(service).toBeTruthy();
  }));
});
