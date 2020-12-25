import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { getConnection } from 'typeorm';
import * as request from 'supertest';

const admin = {
  username: 'admin',
  password: 'adminPassword',
};

const LOCATION = 'location';
const PLACE = 'place';
const OTHER_PLACE = 'otherPlace';
const NEW_PLACE = 'newPlace';

describe('PlaceModule (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  const publicTest = (query: string) =>
    request(app.getHttpServer()).post('/graphql').send({ query });
  const privateTest = (query: string) =>
    request(app.getHttpServer())
      .post('/graphql')
      .set('x-jwt', jwtToken)
      .send({ query });

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await app.close();
  });

  describe('Create admin before test', () => {
    it('Create admin account', () => {
      return publicTest(`
        mutation {
          createAdmin(input: {
            username: "${admin.username}"
            password: "${admin.password}"
          }) {
            ok
            error
          }
        }
      `).expect(200);
    });

    it('Login & save admin token', () => {
      return publicTest(`
          mutation {
            login(input: {
              username: "${admin.username}"
              password: "${admin.password}"
            }) {
              ok
              error
              token
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                login: { ok, error, token },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          expect(token).toEqual(expect.any(String));
          jwtToken = token;
        });
    });
  });

  // PlaceLocation
  describe('createLocation', () => {
    it('Create new location', () => {
      return privateTest(`
          mutation {
            createLocation(input: {
              locationName: "${LOCATION}"
            }) {
              ok
              error
            }
          }
       `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                createLocation: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });

    it('Error: Already location exist', () => {
      return privateTest(`
          mutation {
            createLocation(input: {
              locationName: "${LOCATION}"
            }) {
              ok
              error
            }
          }
       `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                createLocation: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already location exist');
        });
    });
  });

  describe('locationDetail', () => {
    it('Error: Location not found', () => {
      return privateTest(`
          query {
            locationDetail(input: {
              locationId: 999
            }) {
              ok
              error
              location {
                locationName
                isAvailable
              }
            }
          }
       `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                locationDetail: { ok, error, location },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Location not found');
          expect(location).toEqual(null);
        });
    });

    it('Find location ID: 1', () => {
      return privateTest(`
          query {
            locationDetail(input: {
              locationId: 1
            }) {
              ok
              error
              location {
                locationName
                isAvailable
              }
            }
          }
       `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                locationDetail: {
                  ok,
                  error,
                  location: { locationName, isAvailable },
                },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          expect(locationName).toEqual(LOCATION);
          expect(isAvailable).toEqual(true);
        });
    });
  });

  // Place
  describe('createPlace', () => {
    it('Error: Location not found', () => {
      return privateTest(`
          mutation {
            createPlace(input: {
              locationId: 999
              placeName: "${PLACE}"
            }) {
              ok
              error
            }
          }
       `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                createPlace: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Location not found');
        });
    });

    it('Create new place', () => {
      return privateTest(`
          mutation {
            createPlace(input: {
              locationId: 1
              placeName: "${PLACE}"
            }) {
              ok
              error
            }
          }
       `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                createPlace: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });

    it('Create other place', () => {
      return privateTest(`
          mutation {
            createPlace(input: {
              locationId: 1
              placeName: "${OTHER_PLACE}"
            }) {
              ok
              error
            }
          }
       `).expect(200);
    });

    it('Error: Already place exist', () => {
      return privateTest(`
          mutation {
            createPlace(input: {
              locationId: 1
              placeName: "${PLACE}"
            }) {
              ok
              error
            }
          }
       `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                createPlace: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already place exist');
        });
    });
  });

  describe('toggleIsAvailable', () => {
    it('Error: Place not found', () => {
      return privateTest(`
          mutation {
            toggleIsAvailable(input: {
              id: 999
            }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                toggleIsAvailable: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Place not found');
        });
    });

    it('Change isAvailable to "true"', () => {
      return privateTest(`
          mutation {
            toggleIsAvailable(input: {
              id: 1
            }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                toggleIsAvailable: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });
  });

  describe('getLocation', () => {
    it('Find available & has place location', () => {
      return privateTest(`
          query {
            getLocation {
              ok
              error
              locations {
                id
                isAvailable
              }
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                getLocation: { ok, error, locations },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          expect(locations).toEqual([{ id: 1, isAvailable: true }]);
        });
    });
  });

  describe('editPlace', () => {
    it('Error: Location not found', () => {
      return privateTest(`
          mutation {
            editPlace(input: {
              locationId: 999
              placeId: 999
              placeName: "${PLACE}"
              inUse: false
            }) {
              ok
              error
            }
         }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                editPlace: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Location not found');
        });
    });

    it('Error: Place not found', () => {
      return privateTest(`
          mutation {
            editPlace(input: {
              locationId: 1
              placeId: 999
              placeName: "${PLACE}"
              inUse: false
            }) {
              ok
              error
            }
         }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                editPlace: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Place not found');
        });
    });

    it('Error: Same place name', () => {
      return privateTest(`
          mutation {
            editPlace(input: {
              locationId: 1
              placeId: 1
              placeName: "${PLACE}"
              inUse: false
            }) {
              ok
              error
            }
         }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                editPlace: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Same place name');
        });
    });

    it('Error: Already exist place name', () => {
      return privateTest(`
          mutation {
            editPlace(input: {
              locationId: 1
              placeId: 1
              placeName: "${OTHER_PLACE}"
              inUse: false
            }) {
              ok
              error
            }
         }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                editPlace: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already exist place name');
        });
    });

    it('Change place name & inUse: false', () => {
      return privateTest(`
          mutation {
            editPlace(input: {
              locationId: 1
              placeId: 1
              placeName: "${NEW_PLACE}"
              inUse: false
            }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                editPlace: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });
  });

  describe('placeDetail', () => {
    it('Error: Place not found', () => {
      return privateTest(`
          query {
            placeDetail(input: {
              placeId : 999
            }) {
              ok
              error
              place {
                placeName
                inUse
                isAvailable
                placeLocation {
                  locationName
                }
              }
            }
          }
       `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                placeDetail: { ok, error, place },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Place not found');
          expect(place).toEqual(null);
        });
    });

    it('Find place ID: 1', () => {
      return privateTest(`
          query {
            placeDetail(input: {
              placeId : 1
            }) {
              ok
              error
              place {
                placeName
                inUse
                isAvailable
                placeLocation {
                  locationName
                }
              }
            }
          }
       `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                placeDetail: {
                  ok,
                  error,
                  place: {
                    placeName,
                    inUse,
                    isAvailable,
                    placeLocation: { locationName },
                  },
                },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          expect(placeName).toEqual(NEW_PLACE);
          expect(inUse).toEqual(false);
          expect(isAvailable).toEqual(true);
          expect(locationName).toEqual(LOCATION);
        });
    });
  });

  describe('getAvailablePlace', () => {
    it('Find available place by locationId', () => {
      return privateTest(`
      query {
        getAvailablePlace(input: {
          locationId: 1
        }) {
          ok
          error
          places {
            id
            isAvailable
          }
        }
      }
      `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                getAvailablePlace: { ok, error, places },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          expect(places).toEqual([{ id: 1, isAvailable: true }]);
        });
    });
  });

  describe('deletePlace', () => {
    it('Error: Location not found', () => {
      return privateTest(`
          mutation {
            deletePlace(input: {
              locationId: 999
              placeId: 999
            }) {
              ok
              error
            }
          }
       `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                deletePlace: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Location not found');
        });
    });

    it('Error: Place not found', () => {
      return privateTest(`
          mutation {
            deletePlace(input: {
              locationId: 1
              placeId: 999
            }) {
              ok
              error
            }
          }
       `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                deletePlace: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Place not found');
        });
    });

    it("Error: Check 'inUse' and 'isAvailable' is false", () => {
      return privateTest(`
          mutation {
            deletePlace(input: {
              locationId: 1
              placeId: 1
            }) {
              ok
              error
            }
          }
       `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                deletePlace: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual("Check 'inUse' and 'isAvailable' is false");
        });
    });

    it('Delete place', () => {
      return privateTest(`
          mutation {
            deletePlace(input: {
              locationId: 1
              placeId: 2
            }) {
              ok
              error
            }
          }
       `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                deletePlace: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });
  });
});
