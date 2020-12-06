import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaceLocation } from './entity/location.entity';
import { Place } from './entity/place.entity';
import { PlaceService } from './place.service';

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PlaceService', () => {
  let service: PlaceService;
  let placeRepo: MockRepository<Place>;
  let locationRepo: MockRepository<PlaceLocation>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PlaceService,
        {
          provide: getRepositoryToken(Place),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(PlaceLocation),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PlaceService>(PlaceService);
    placeRepo = module.get(getRepositoryToken(Place));
    locationRepo = module.get(getRepositoryToken(PlaceLocation));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPlace', () => {
    const createPlaceArgs = {
      placeName: 'mockPlaceName',
      locationId: 1,
    };

    it('should fail if location not found', async () => {
      locationRepo.findOne.mockResolvedValue(null);

      const result = await service.createPlace(createPlaceArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Location not found',
      });
    });

    it('should fail if already place exist', async () => {
      locationRepo.findOne.mockResolvedValueOnce({
        id: createPlaceArgs.locationId,
      });
      placeRepo.findOne.mockResolvedValueOnce({
        placeName: createPlaceArgs.placeName,
        placeLocation: { id: createPlaceArgs.locationId },
      });

      const result = await service.createPlace(createPlaceArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Already place exist',
      });
    });

    it('should create a place', async () => {
      locationRepo.findOne.mockResolvedValueOnce({
        id: createPlaceArgs.locationId,
      });
      placeRepo.findOne.mockResolvedValueOnce(null);

      const result = await service.createPlace(createPlaceArgs);
      expect(result).toEqual({
        ok: true,
      });
      expect(placeRepo.create).toBeCalledWith({
        placeName: createPlaceArgs.placeName,
        placeLocation: { id: createPlaceArgs.locationId },
      });
    });

    it('should fail on exception', async () => {
      locationRepo.findOne.mockRejectedValue(new Error());

      const result = await service.createPlace(createPlaceArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('toggleIsAvailable', () => {
    const toggleIsAvailableArgs = {
      id: 1,
    };

    it('should fail if place not found', async () => {
      placeRepo.findOne.mockResolvedValue(null);

      const result = await service.toggleIsAvailable(toggleIsAvailableArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Place not found',
      });
    });

    it('should success to toggle isAvailable', async () => {
      placeRepo.findOne.mockResolvedValue({
        id: toggleIsAvailableArgs.id,
        isAvailable: false,
      });

      const result = await service.toggleIsAvailable(toggleIsAvailableArgs);
      expect(result).toEqual({
        ok: true,
        isAvailable: true,
      });
      expect(placeRepo.save).toBeCalledWith({
        id: toggleIsAvailableArgs.id,
        isAvailable: true,
      });
    });

    it('should fail on exception', async () => {
      placeRepo.findOne.mockRejectedValue(new Error());

      const result = await service.toggleIsAvailable(toggleIsAvailableArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('editPlace', () => {
    const editPlaceArgs = {
      placeName: 'mockPlaceName',
      inUse: true,
      locationId: 1,
      placeId: 1,
    };

    it('should fail if location not found', async () => {
      locationRepo.findOne.mockResolvedValue(null);

      const result = await service.editPlace(editPlaceArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Location not found',
      });
    });

    it('should fail if place not found', async () => {
      locationRepo.findOne.mockResolvedValueOnce({
        id: editPlaceArgs.locationId,
      });
      placeRepo.findOne.mockResolvedValueOnce(null);

      const result = await service.editPlace(editPlaceArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Place not found',
      });
    });

    it('should success to edit place', async () => {
      locationRepo.findOne.mockResolvedValueOnce({
        id: editPlaceArgs.locationId,
      });
      placeRepo.findOne.mockResolvedValueOnce({
        id: editPlaceArgs.placeId,
      });

      const result = await service.editPlace(editPlaceArgs);
      expect(result).toEqual({
        ok: true,
      });
      expect(placeRepo.save).toBeCalledWith(expect.any(Object));
    });

    it('should fail on exception', async () => {
      locationRepo.findOne.mockRejectedValue(new Error());

      const result = await service.editPlace(editPlaceArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('deletePlace', () => {
    it.todo('should fail if location not found');
    it.todo('should fail if place not found');
    it.todo('should fail place in use');
    it.todo('should fail place is available');
    it.todo('should success to delete a place');
    it.todo('should fail on exception');
  });

  describe('placeDetail', () => {
    it.todo('should fail if place not found');
    it.todo('should success to find a place');
    it.todo('should fail on exception');
  });

  describe('createLocation', () => {
    it.todo('should fail if already location exist');
    it.todo('should success to create a location');
    it.todo('should fail on exception');
  });

  describe('locationDetail', () => {
    it.todo('should fail if location not found');
    it.todo('should success to find a location');
    it.todo('should fail on exception');
  });
});
