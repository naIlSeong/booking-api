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
  find: jest.fn(),
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

    const existPlaceArgs = {
      id: 2,
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

    it('should fail if same place name', async () => {
      locationRepo.findOne.mockResolvedValueOnce({
        id: editPlaceArgs.locationId,
      });
      placeRepo.findOne.mockResolvedValueOnce({
        id: editPlaceArgs.placeId,
      });
      placeRepo.findOne.mockResolvedValueOnce({
        id: editPlaceArgs.placeId,
      });

      const result = await service.editPlace(editPlaceArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Same place name',
      });
    });

    it('should fail if already exist place name', async () => {
      locationRepo.findOne.mockResolvedValueOnce({
        id: editPlaceArgs.locationId,
      });
      placeRepo.findOne.mockResolvedValueOnce({
        id: editPlaceArgs.placeId,
      });
      placeRepo.findOne.mockResolvedValueOnce({
        id: existPlaceArgs.id,
      });

      const result = await service.editPlace(editPlaceArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Already exist place name',
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
    const deletePlaceArgs = {
      placeId: 1,
      locationId: 1,
    };

    it('should fail if location not found', async () => {
      locationRepo.findOne.mockResolvedValue(null);

      const result = await service.deletePlace(deletePlaceArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Location not found',
      });
    });

    it('should fail if place not found', async () => {
      locationRepo.findOne.mockResolvedValueOnce({
        id: deletePlaceArgs.locationId,
      });
      placeRepo.findOne.mockResolvedValueOnce(null);

      const result = await service.deletePlace(deletePlaceArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Place not found',
      });
    });

    it('should fail if place in use', async () => {
      locationRepo.findOne.mockResolvedValueOnce({
        id: deletePlaceArgs.locationId,
      });
      placeRepo.findOne.mockResolvedValueOnce({
        id: deletePlaceArgs.placeId,
        inUse: true,
        isAvailable: false,
      });

      const result = await service.deletePlace(deletePlaceArgs);
      expect(result).toEqual({
        ok: false,
        error: "Check 'inUse' and 'isAvailable' is false",
      });
    });

    it('should fail place is available', async () => {
      locationRepo.findOne.mockResolvedValueOnce({
        id: deletePlaceArgs.locationId,
      });
      placeRepo.findOne.mockResolvedValueOnce({
        id: deletePlaceArgs.placeId,
        inUse: false,
        isAvailable: true,
      });

      const result = await service.deletePlace(deletePlaceArgs);
      expect(result).toEqual({
        ok: false,
        error: "Check 'inUse' and 'isAvailable' is false",
      });
    });

    it('should success to delete a place', async () => {
      locationRepo.findOne.mockResolvedValueOnce({
        id: deletePlaceArgs.locationId,
      });
      placeRepo.findOne.mockResolvedValueOnce({
        id: deletePlaceArgs.placeId,
        inUse: false,
        isAvailable: false,
      });

      const result = await service.deletePlace(deletePlaceArgs);
      expect(result).toEqual({
        ok: true,
      });
      expect(placeRepo.delete).toBeCalled();
    });

    it('should fail on exception', async () => {
      locationRepo.findOne.mockRejectedValue(new Error());

      const result = await service.deletePlace(deletePlaceArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('placeDetail', () => {
    const placeDetailArgs = {
      placeId: 1,
    };

    it('should fail if place not found', async () => {
      placeRepo.findOne.mockResolvedValue(null);

      const result = await service.placeDetail(placeDetailArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Place not found',
      });
    });

    it('should success to find a place', async () => {
      placeRepo.findOne.mockResolvedValue({
        place: {
          id: placeDetailArgs.placeId,
        },
      });

      const result = await service.placeDetail(placeDetailArgs);
      expect(result).toEqual({
        ok: true,
        place: expect.any(Object),
      });
    });

    it('should fail on exception', async () => {
      placeRepo.findOne.mockRejectedValue(new Error());

      const result = await service.placeDetail(placeDetailArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('createLocation', () => {
    const createLocationArgs = {
      locationName: 'mockLocationName',
    };

    it('should fail if already location exist', async () => {
      locationRepo.findOne.mockResolvedValue({
        id: 1,
      });

      const result = await service.createLocation(createLocationArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Already location exist',
      });
    });

    it('should success to create a location', async () => {
      locationRepo.findOne.mockResolvedValue(null);

      const result = await service.createLocation(createLocationArgs);
      expect(result).toEqual({
        ok: true,
      });
      expect(locationRepo.create).toBeCalled();
      expect(locationRepo.save).toBeCalled();
    });

    it('should fail on exception', async () => {
      locationRepo.findOne.mockRejectedValue(new Error());

      const result = await service.createLocation(createLocationArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('locationDetail', () => {
    const locationDetailArgs = {
      locationId: 1,
    };

    it('should fail if location not found', async () => {
      locationRepo.findOne.mockResolvedValue(null);

      const result = await service.locationDetail(locationDetailArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Location not found',
      });
    });

    it('should success to find a location', async () => {
      locationRepo.findOne.mockResolvedValue({
        id: locationDetailArgs.locationId,
      });

      const result = await service.locationDetail(locationDetailArgs);
      expect(result).toEqual({
        ok: true,
        location: { id: locationDetailArgs.locationId },
      });
    });

    it('should fail on exception', async () => {
      locationRepo.findOne.mockRejectedValue(new Error());

      const result = await service.locationDetail(locationDetailArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('getLocation', () => {
    it('Find available location', async () => {
      locationRepo.find.mockResolvedValue([
        { id: 1, isAvailable: true, places: [] },
        { id: 2, isAvailable: true, places: [{ id: 1 }, { id: 2 }] },
      ]);

      const result = await service.getLocation();
      expect(result).toEqual({
        ok: true,
        locations: [
          { id: 2, isAvailable: true, places: [{ id: 1 }, { id: 2 }] },
        ],
      });
    });

    it('Error: Unexpected Error', async () => {
      locationRepo.find.mockRejectedValue(new Error());

      const result = await service.getLocation();
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });

  describe('getAvailablePlace', () => {
    const getAvailablePlaceArgs = {
      locationId: 1,
    };

    it('Error: Available place not found', async () => {
      placeRepo.find.mockResolvedValue([]);

      const result = await service.getAvailablePlace(getAvailablePlaceArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Available place not found',
      });
    });

    it('Find available place', async () => {
      placeRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]);

      const result = await service.getAvailablePlace(getAvailablePlaceArgs);
      expect(result).toEqual({
        ok: true,
        places: [{ id: 1 }, { id: 2 }, { id: 3 }],
      });
      expect(result.places.length).toEqual(3);
    });

    it('Error: Unexpected Error', async () => {
      placeRepo.find.mockRejectedValue(new Error());

      const result = await service.getAvailablePlace(getAvailablePlaceArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Unexpected Error',
      });
    });
  });
});
