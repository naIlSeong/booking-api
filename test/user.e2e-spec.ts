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

const updatedUser = {
  username: 'updatedUserName',
  password: 'updatedPassword',
  studentId: 777777,
};

const otherUser = {
  username: 'otherUsername',
  password: 'otherPassword',
  studentId: 654321,
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
                username: "${otherUser.username}"
                password: "${otherUser.password}"
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

  describe('editUser', () => {
    it('Create other user', () => {
      return publicTest(`
            mutation {
              createUser(input: {
                username: "${otherUser.username}"
                password: "${otherUser.password}"
                studentId: ${otherUser.studentId}
              }) {
                ok
                error
              }
            }
        `).expect(200);
    });

    it('Error: Already username exist', () => {
      return privateTest(`
          mutation {
            editUser(input: {
              username: "${otherUser.username}"
              password: "${updatedUser.password}"
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
                editUser: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already username exist');
        });
    });

    it('Error: Already exist student id', () => {
      return privateTest(`
          mutation {
            editUser(input: {
              username: "${updatedUser.username}"
              password: "${updatedUser.password}"
              studentId: ${otherUser.studentId}
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
                editUser: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already exist student id');
        });
    });

    it('Error: Same Password', () => {
      return privateTest(`
          mutation {
            editUser(input: {
              username: "${updatedUser.username}"
              password: "${user.password}"
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
                editUser: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Same Password');
        });
    });

    it.todo('Error: Same Team');
    it.todo('Error: Team not found');

    // Todo: Change Team
    it('Update username, password, studentId', () => {
      return privateTest(`
          mutation {
            editUser(input: {
              username: "${updatedUser.username}"
              password: "${updatedUser.password}"
              studentId: ${updatedUser.studentId}
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
                editUser: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });
  });

  describe('getUser', () => {
    it('Error: User not found', () => {
      return privateTest(`
          query {
            getUser(input: {
              userId: 999
            }) {
              ok
              error
              user {
                username
                studentEmail
              }
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                getUser: { ok, error, user },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('User not found');
          expect(user).toEqual(null);
        });
    });

    it('Find user by ID', () => {
      return privateTest(`
          query {
            getUser(input: {
              userId: 2
            }) {
              ok
              error
              user {
                username
                studentEmail
              }
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                getUser: {
                  ok,
                  error,
                  user: { username, studentEmail },
                },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          expect(username).toEqual(otherUser.username);
          expect(studentEmail).toEqual(`${otherUser.studentId}@jnu.ac.kr`);
        });
    });
  });

  describe('deleteUser', () => {
    it('Delete user', () => {
      return privateTest(`
          mutation {
            deleteUser {
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
                deleteUser: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });
  });
});
