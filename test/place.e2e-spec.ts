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
  it.todo('createPlace');
  it.todo('toggleIsAvailable');
  it.todo('editPlace');
  it.todo('deletePlace');
  it.todo('placeDetail');
});
