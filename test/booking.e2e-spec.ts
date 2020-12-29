import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { getConnection } from 'typeorm';
import * as request from 'supertest';

const user = {
  username: 'username',
  password: 'password',
};

const otherUser = {
  username: 'otherUsername',
  password: 'otherPassword',
};

const admin = {
  username: 'admin',
  password: 'adminPassword',
};

// inUse 1
// Place Id : 1
// Booking Id : 2
// Creator : private
// isFinished : true

// inUse 2
// Place Id : 1
// Booking Id : 3
// Creator : private
// isFinished : false

// Place Id : 2
// Booking Id : 4
// Creator : otherPrivate
// startAt: 2020-12-24T10:00
// endAt: 2020-12-24T13:00

// Place Id : 1
// Booking Id : 1
// Creator : private
const christmasBooking = {
  startAt: '2021-12-25T13:00',
  endAt: '2021-12-25T15:00',
};

// Place Id : 2
// Booking Id : 1
const newBooking = {
  startAt: '2021-12-24T13:00',
  endAt: '2021-12-24T15:00',
};

const TEAM_NAME = 'teamName';
const LOCATION = 'location';
const PLACE = 'place';
const OTHER_PLACE = 'otherPlace';

describe('BookingModule (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let otherJwtToken: string;
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
  const otherPrivateTest = (query: string) =>
    request(app.getHttpServer())
      .post('/graphql')
      .set('x-jwt', otherJwtToken)
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

    it('Create other user', () => {
      return publicTest(`
        mutation {
            createUser(input: {
              username: "${otherUser.username}"
              password: "${otherUser.password}"
            }) {
              ok
              error
            }
          }
        `).expect(200);
    });

    it('Login & save other user token', () => {
      return publicTest(`
        mutation {
            login(input: {
              username: "${otherUser.username}"
              password: "${otherUser.password}"
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
          otherJwtToken = token;
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

    it('Create other place', () => {
      return adminPrivateTest(`
          mutation {
            createPlace(input: {
              locationId: 1
              placeName: "${OTHER_PLACE}"
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

    it('Error: Team not found', () => {
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
          expect(error).toEqual('Team not found');
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
                creator {
                  id
                }
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
                creator {
                  id
                }
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
                    creator: { id },
                    place: { placeName },
                  },
                },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          expect(id).toEqual(1);
          expect(placeName).toEqual(PLACE);
        });
    });
  });

  describe('createInUse', () => {
    it('Error: Place not found', () => {
      return privateTest(`
          mutation {
            createInUse(input: {
              placeId: 999
              withTeam: true	
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
                createInUse: { ok, error },
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
            createInUse(input: {
              placeId: 2
              withTeam: true	
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
                createInUse: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Place not available');
        });
    });

    it('Error: Team not found', () => {
      return otherPrivateTest(`
          mutation {
            createInUse(input: {
              placeId: 1
              withTeam: true	
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
                createInUse: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Team not found');
        });
    });

    it('Create inUse', () => {
      return privateTest(`
          mutation {
            createInUse(input: {
              placeId: 1
              withTeam: true	
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
                createInUse: { ok, error },
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
            createInUse(input: {
              placeId: 1
              withTeam: true	
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
                createInUse: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already booking exist');
        });
    });
  });

  describe('extendInUse', () => {
    it('Error: Booking not found', () => {
      return otherPrivateTest(`
          mutation {
            extendInUse(input: {
              bookingId: 999
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
                extendInUse: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Booking not found');
        });
    });

    it("Error: You can't do this", () => {
      return otherPrivateTest(`
          mutation {
            extendInUse(input: {
              bookingId: 2
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
                extendInUse: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual("You can't do this");
        });
    });

    it('Error: Not in use', () => {
      return privateTest(`
          mutation {
            extendInUse(input: {
              bookingId: 1
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
                extendInUse: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Not in use');
        });
    });

    it("Error: Can't extend now", () => {
      return privateTest(`
          mutation {
            extendInUse(input: {
              bookingId: 2
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
                extendInUse: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual("Can't extend now");
        });
    });

    it('Edit booking for test', () => {
      return adminPrivateTest(`
      mutation {
        editBookingForTest(bookingId: 2) {
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
                editBookingForTest: { ok },
              },
            },
          } = res;
          expect(ok).toEqual(true);
        });
    });

    it('Extend inUse', () => {
      return privateTest(`
          mutation {
            extendInUse(input: {
              bookingId: 2
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
                extendInUse: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });
  });

  describe('finishInUse', () => {
    it('Error: Booking not found', () => {
      return otherPrivateTest(`
          mutation {
            finishInUse(input: {
              bookingId: 999
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
                finishInUse: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Booking not found');
        });
    });

    it("Error: You can't do this", () => {
      return otherPrivateTest(`
          mutation {
            finishInUse(input: {
              bookingId: 2
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
                finishInUse: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual("You can't do this");
        });
    });

    it('Error: Not in use', () => {
      return privateTest(`
          mutation {
            finishInUse(input: {
              bookingId: 1
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
                finishInUse: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Not in use');
        });
    });

    it('Finish inUse ID : 2', () => {
      return privateTest(`
          mutation {
            finishInUse(input: {
              bookingId: 2
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
                finishInUse: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });

    it('Error: Already finished', () => {
      return privateTest(`
          mutation {
            finishInUse(input: {
              bookingId: 2
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
                finishInUse: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already finished');
        });
    });

    it('Error in extendInUse: Already finished', () => {
      return privateTest(`
          mutation {
            extendInUse(input: {
              bookingId: 2
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
                extendInUse: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already finished');
        });
    });
  });

  describe('editBooking', () => {
    // Defence
    it('Error: Booking not found', () => {
      return privateTest(`
          mutation {
            editBooking(input: {
              placeId: 2
              bookingId: 999
              startAt: "${newBooking.startAt}"
              endAt: "${newBooking.endAt}"
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
                editBooking: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Booking not found');
        });
    });

    it("Error: You can't do this", () => {
      return otherPrivateTest(`
          mutation {
            editBooking(input: {
              placeId: 2
              bookingId: 1
              startAt: "${newBooking.startAt}"
              endAt: "${newBooking.endAt}"
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
                editBooking: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual("You can't do this");
        });
    });

    it('Create inUse in place id : 1', () => {
      return privateTest(`
        mutation {
          createInUse(input: {
            placeId: 1
            withTeam: true
          }) {
            ok
            error
          }
        }
      `).expect(200);
    });

    it("Error: You can't do this in use", () => {
      return privateTest(`
          mutation {
            editBooking(input: {
              placeId: 2
              bookingId: 3
              startAt: "${newBooking.startAt}"
              endAt: "${newBooking.endAt}"
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
                editBooking: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual("You can't do this in use");
        });
    });

    // Change Place
    it('Error: Place not found', () => {
      return privateTest(`
          mutation {
            editBooking(input: {
              placeId: 999
              bookingId: 1
              startAt: "${newBooking.startAt}"
              endAt: "${newBooking.endAt}"
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
                editBooking: { ok, error },
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
            editBooking(input: {
              placeId: 2
              bookingId: 1
              startAt: "${newBooking.startAt}"
              endAt: "${newBooking.endAt}"
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
                editBooking: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Place not available');
        });
    });

    it('Change place(ID : 2) isAvailable : true', () => {
      return adminPrivateTest(`
          mutation {
            toggleIsAvailable(input: {
              id: 2
            }) {
              ok
            }
          }
        `)
        .expect(200)
        .expect((res) =>
          expect(res.body.data.toggleIsAvailable.ok).toEqual(true),
        );
    });

    it('Create other booking', () => {
      return otherPrivateTest(`
          mutation {
            createBooking(input: {
              placeId: 2
              withTeam: false
              startAt: "2020-12-24T10:00"
              endAt: "2020-12-24T13:00"
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
        });
    });

    it('Error: Already booking exist', () => {
      return privateTest(`
          mutation {
            editBooking(input: {
              placeId: 2
              bookingId: 1
              startAt: "2020-12-24T12:00"
              endAt: "2020-12-24T14:00"
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
                editBooking: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already booking exist');
        });
    });

    it('Edit booking', () => {
      return privateTest(`
          mutation {
            editBooking(input: {
              placeId: 2
              bookingId: 1
              startAt: "${newBooking.startAt}"
              endAt: "${newBooking.endAt}"
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
                editBooking: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });
  });

  // ToDo :
  // describe('getMyBookings', () => {
  //   it('Find bookings creator ID : 1', () => {
  //     return privateTest(`
  //         query {
  //           getMyBookings {
  //             ok
  //             error
  //             bookings {
  //               id
  //               startAt
  //               endAt
  //               isFinished
  //             }
  //           }
  //         }
  //       `)
  //       .expect(200)
  //       .expect((res) => {
  //         const {
  //           body: {
  //             data: {
  //               getMyBookings: { ok, error, bookings },
  //             },
  //           },
  //         } = res;
  //         expect(ok).toEqual(true);
  //         expect(error).toEqual(null);
  //         expect(bookings.length).toEqual(3);
  //         expect(bookings[0].id).toEqual(2);
  //         expect(bookings[0].isFinished).toEqual(true);
  //       });
  //   });

  //   it('Find bookings creator ID : 2', () => {
  //     return otherPrivateTest(`
  //         query {
  //           getMyBookings {
  //             ok
  //             error
  //             bookings {
  //               startAt
  //               endAt
  //               isFinished
  //             }
  //           }
  //         }
  //       `)
  //       .expect(200)
  //       .expect((res) => {
  //         const {
  //           body: {
  //             data: {
  //               getMyBookings: { ok, error, bookings },
  //             },
  //           },
  //         } = res;
  //         expect(ok).toEqual(true);
  //         expect(error).toEqual(null);
  //         expect(bookings.length).toEqual(1);
  //       });
  //   });
  // });

  describe('deleteBooking', () => {
    it('Error: Booking not found', () => {
      return otherPrivateTest(`
          mutation {
            deleteBooking(input: {
              bookingId: 999
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
                deleteBooking: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Booking not found');
        });
    });

    it("Error: You can't do this", () => {
      return otherPrivateTest(`
          mutation {
            deleteBooking(input: {
              bookingId: 1
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
                deleteBooking: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual("You can't do this");
        });
    });

    it('Delete booking ID : 1', () => {
      return privateTest(`
          mutation {
            deleteBooking(input: {
              bookingId: 1
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
                deleteBooking: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });
  });
});
