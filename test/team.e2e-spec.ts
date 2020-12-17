import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { getConnection } from 'typeorm';
import * as request from 'supertest';

const representative = {
  username: 'testUsername',
  password: 'testPassword',
};

const member = {
  username: 'memberUsername',
  password: 'memberPassword',
};

describe('TeamModule (e2e)', () => {
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
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await getConnection().dropDatabase();
    await app.close();
  });

  describe('Create user before test', () => {
    it('Create representative', () => {
      return publicTest(`
        mutation {
            createUser(input: {
            username: "${representative.username}"
            password: "${representative.password}"
            }) {
            ok
            error
            }
        }
      `).expect(200);
    });

    it('login representative & save token', () => {
      return publicTest(`
            mutation {
                login(input: {
                username: "${representative.username}"
                password: "${representative.password}"
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

    it('Create member', () => {
      return publicTest(`
        mutation {
            createUser(input: {
            username: "${member.username}"
            password: "${member.password}"
            }) {
            ok
            error
            }
        }
      `).expect(200);
    });
  });

  it.todo('createTeam');
  it.todo('registerMember');
  it.todo('editTeam');
  it.todo('teamDetail');
  it.todo('getTeams');
  it.todo('deleteTeam');
});
