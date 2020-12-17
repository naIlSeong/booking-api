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

const invalidUser = {
  username: 'invalidName',
  password: 'invalidPassword',
};

describe('UserModule (e2e)', () => {
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

  describe('login', () => {
    it('Error: User not found', () => {
      return publicTest(`
            mutation {
              login(input: {
                username: "${invalidUser.username}",
                password: "${invalidUser.password}"
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
          expect(ok).toEqual(false);
          expect(error).toEqual('User not found');
          expect(token).toEqual(null);
        });
    });

    it('Error: Wrong password', () => {
      return publicTest(`
            mutation {
              login(input: {
                username: "${user.username}",
                password: "${invalidUser.password}"
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
          expect(ok).toEqual(false);
          expect(error).toEqual('Wrong password');
          expect(token).toEqual(null);
        });
    });

    it('login & get token', () => {
      return publicTest(`
          mutation {
            login(input: {
              username: "${user.username}",
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

  describe('me', () => {
    it('return my profile', () => {
      return privateTest(`
          query {
            me {
              username
              studentEmail
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { username, studentEmail },
              },
            },
          } = res;
          expect(username).toEqual(user.username);
          expect(studentEmail).toEqual(`${user.studentId}@jnu.ac.kr`);
        });
    });
  });

  it.todo('editUser');
  it.todo('getUser');
  it.todo('deleteUser');
});
