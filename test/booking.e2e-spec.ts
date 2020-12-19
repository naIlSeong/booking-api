import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { getConnection } from 'typeorm';
import * as request from 'supertest';

const user = {
  username: 'username',
  password: 'password',
};

const admin = {
  username: 'admin',
  password: 'adminPassword',
};

const christmasBooking = {
  startAt: '2020-12-25T13:00',
  endAt: '2020-12-25T15:00',
};

const TEAM_NAME = 'teamName';
const LOCATION = 'location';
const PLACE = 'place';

describe('BookingModule (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let adminToken: string;

  const publicTest = (query: string) =>
    request(app.getHttpServer()).post('/graphql').send({ query });
  const privateTest = (query: string) =>
    request(app.getHttpServer())
      .post('/graphql')
      .set('x-jwt', jwtToken)
      .send({ query });
  const adminPrivateTest = (query: string) =>
    request(app.getHttpServer())
      .post('/graphql')
      .set('x-jwt', adminToken)
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

  describe('Create user & team before test', () => {
    it('Create user', () => {
      return publicTest(`
        mutation {
            createUser(input: {
              username: "${user.username}"
              password: "${user.password}"
            }) {
              ok
              error
            }
          }
        `).expect(200);
    });

    it('Login & save token', () => {
      return publicTest(`
        mutation {
            login(input: {
              username: "${user.username}"
              password: "${user.password}"
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
                login: { token },
              },
            },
          } = res;
          jwtToken = token;
        });
    });

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
                login: { token },
              },
            },
          } = res;
          expect(token).toEqual(expect.any(String));
          adminToken = token;
        });
    });

    it('Create location', () => {
      return adminPrivateTest(`
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
                createLocation: { ok },
              },
            },
          } = res;
          expect(ok).toEqual(true);
        });
    });

    it('Create place', () => {
      return adminPrivateTest(`
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
                createPlace: { ok },
              },
            },
          } = res;
          expect(ok).toEqual(true);
        });
    });
  });

  describe('createBooking', () => {
    it('Error: Place not found', () => {
      return privateTest(`
        mutation {
            createBooking(input: {
              placeId: 999
              withTeam: true
              startAt: "${christmasBooking.startAt}"
              endAt: "${christmasBooking.endAt}"
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
                createBooking: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Place not found');
        });
    });

    it('Error: Place not available', () => {
      return privateTest(`
        mutation {
            createBooking(input: {
              placeId: 1
              withTeam: true
              startAt: "${christmasBooking.startAt}"
              endAt: "${christmasBooking.endAt}"
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
                createBooking: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Place not available');
        });
    });

    it('Change place isAvailable "true"', () => {
      return adminPrivateTest(`
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
                toggleIsAvailable: { ok },
              },
            },
          } = res;
          expect(ok).toEqual(true);
        });
    });

    it('Create team', () => {
      return privateTest(`
          mutation {
              createTeam(input: {
                teamName: "${TEAM_NAME}"
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
                createTeam: { ok },
              },
            },
          } = res;
          expect(ok).toEqual(true);
        });
    });

    it('Create new booking', () => {
      return privateTest(`
        mutation {
            createBooking(input: {
              placeId: 1
              withTeam: true
              startAt: "${christmasBooking.startAt}"
              endAt: "${christmasBooking.endAt}"
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
                createBooking: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });

    it('Error: Already booking exist', () => {
      return privateTest(`
        mutation {
            createBooking(input: {
              placeId: 1
              withTeam: true
              startAt: "${christmasBooking.startAt}"
              endAt: "${christmasBooking.endAt}"
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
                createBooking: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already booking exist');
        });
    });
  });

  describe('bookingDetail', () => {
    it('Error: Booking not found', () => {
      return privateTest(`
          query {
            bookingDetail(input: {
              bookingId: 999
            }) {
              ok
              error
              booking {
                creatorId
                place {
                  placeName
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
                bookingDetail: { ok, error, booking },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Booking not found');
          expect(booking).toEqual(null);
        });
    });

    it('Find booking ID : 1', () => {
      return privateTest(`
          query {
            bookingDetail(input: {
              bookingId: 1
            }) {
              ok
              error
              booking {
                creatorId
                place {
                  placeName
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
                bookingDetail: {
                  ok,
                  error,
                  booking: {
                    creatorId,
                    place: { placeName },
                  },
                },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          expect(creatorId).toEqual(1);
          expect(placeName).toEqual(PLACE);
        });
    });
  });

  it.todo('createInUse');
  it.todo('extendInUse');
  it.todo('finishInUse');

  it.todo('editBooking');

  it.todo('getBookings');
  it.todo('deleteBooking');
});
