import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { getConnection } from 'typeorm';
import * as request from 'supertest';

const user = {
  username: 'username',
  password: 'password',
};

const TEAM_NAME = 'teamName';

describe('BookingModule (e2e)', () => {
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
  });

  it.todo('createBooking');
  it.todo('bookingDetail');
  it.todo('getBookings');
  it.todo('deleteBooking');
  it.todo('editBooking');
  it.todo('createInUse');
  it.todo('extendInUse');
  it.todo('finishInUse');
});
