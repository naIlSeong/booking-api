import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { getConnection } from 'typeorm';
import * as request from 'supertest';

const user = {
  username: 'testUserName',
  password: 'testPassword',
  studentId: 123456,
};

describe('UserModule (e2e)', () => {
  let app: INestApplication;

  const publicTest = (query: string) =>
    request(app.getHttpServer()).post('/graphql').send({ query });

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

  describe('createUser', () => {
    it('create user', () => {
      return publicTest(`
            mutation {
              createUser(input: {
                username: "${user.username}"
                password: "${user.password}"
                studentId: ${user.studentId}
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
                createUser: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });

    it('Error: Already exist username', () => {
      return publicTest(`
            mutation {
              createUser(input: {
                username: "${user.username}"
                password: "${user.password}"
                studentId: ${user.studentId}
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
                createUser: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already exist username');
        });
    });

    it('Error: Already exist studentID', () => {
      return publicTest(`
            mutation {
              createUser(input: {
                username: "otherUsername"
                password: "${user.password}"
                studentId: ${user.studentId}
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
                createUser: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already exist studentID');
        });
    });
  });

  it.todo('login');
  it.todo('me');
  it.todo('editUser');
  it.todo('getUser');
  it.todo('deleteUser');
});
