import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { getConnection } from 'typeorm';
import * as request from 'supertest';

// ID : 1
const representative = {
  username: 'testUsername',
  password: 'testPassword',
};

// ID : 2
const otherUser = {
  username: 'otherUsername',
  password: 'otherPassword',
};

// ID : 3
const member = {
  username: 'memberUsername',
  password: 'memberPassword',
};

const TEAM_NAME = 'teamName';
const OTHER_TEAM_NAME = 'otherTeamName';

describe('TeamModule (e2e)', () => {
  let app: INestApplication;
  let representativeToken: string;
  let otherUserToken: string;

  const publicTest = (query: string) =>
    request(app.getHttpServer()).post('/graphql').send({ query });
  const privateTest = (query: string) =>
    request(app.getHttpServer())
      .post('/graphql')
      .set('x-jwt', representativeToken)
      .send({ query });
  const otherPrivateTest = (query: string) =>
    request(app.getHttpServer())
      .post('/graphql')
      .set('x-jwt', otherUserToken)
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
          representativeToken = token;
        });
    });

    it('login otherUser & save token', () => {
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
          otherUserToken = token;
        });
    });
  });

  describe('createTeam', () => {
    it('Create representative team', () => {
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
                createTeam: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });

    it('Error: Already team name exist', () => {
      return otherPrivateTest(`
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
                createTeam: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already team name exist');
        });
    });

    it('Error: Already has team', () => {
      return privateTest(`
        mutation {
            createTeam(input: {
              teamName: "${OTHER_TEAM_NAME}"
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
                createTeam: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already has team');
        });
    });
  });

  // ToDo
  // describe('registerMember', () => {
  //   it('Error: Not have a team', () => {
  //     return otherPrivateTest(`
  //       mutation {
  //           registerMember(input: {
  //             memberId: 3
  //           }) {
  //             ok
  //             error
  //           }
  //         }
  //       `)
  //       .expect(200)
  //       .expect((res) => {
  //         const {
  //           body: {
  //             data: {
  //               registerMember: { ok, error },
  //             },
  //           },
  //         } = res;
  //         expect(ok).toEqual(false);
  //         expect(error).toEqual('Not have a team');
  //       });
  //   });

  //   // team 1 = {userId 1, userId 3}
  //   it('Register member', () => {
  //     return privateTest(`
  //       mutation {
  //           registerMember(input: {
  //             memberId: 3
  //           }) {
  //             ok
  //             error
  //           }
  //         }
  //       `)
  //       .expect(200)
  //       .expect((res) => {
  //         const {
  //           body: {
  //             data: {
  //               registerMember: { ok, error },
  //             },
  //           },
  //         } = res;
  //         expect(ok).toEqual(true);
  //         expect(error).toEqual(null);
  //       });
  //   });

  //   // team 1 = {userId 1, userId 3}
  //   // team 2 = {userId 2}
  //   it("Create other user's team", () => {
  //     return otherPrivateTest(`
  //       mutation {
  //           createTeam(input: {
  //             teamName: "${OTHER_TEAM_NAME}"
  //           }) {
  //             ok
  //             error
  //           }
  //         }
  //       `)
  //       .expect(200)
  //       .expect((res) => {
  //         const {
  //           body: {
  //             data: {
  //               createTeam: { ok, error },
  //             },
  //           },
  //         } = res;
  //         expect(ok).toEqual(true);
  //         expect(error).toEqual(null);
  //       });
  //   });

  //   it("Error: You can't do this", () => {
  //     return otherPrivateTest(`
  //       mutation {
  //           registerMember(input: {
  //             memberId: 2
  //           }) {
  //             ok
  //             error
  //           }
  //         }
  //       `)
  //       .expect(200)
  //       .expect((res) => {
  //         const {
  //           body: {
  //             data: {
  //               registerMember: { ok, error },
  //             },
  //           },
  //         } = res;
  //         expect(ok).toEqual(false);
  //         expect(error).toEqual("You can't do this ");
  //       });
  //   });

  //   it.todo('Error: User not found');
  //   it.todo('Error: Already has team');
  // });

  it.todo('editTeam');
  it.todo('teamDetail');
  it.todo('getTeams');
  it.todo('deleteTeam');
});
