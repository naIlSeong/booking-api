import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { getConnection } from 'typeorm';
import * as request from 'supertest';
import { UserRole } from 'src/user/entity/user.entity';

// ID : 1 , team: 1
const representative = {
  username: 'testUsername',
  password: 'testPassword',
};

// ID : 2 , team: 2
const otherUser = {
  username: 'otherUsername',
  password: 'otherPassword',
};

// ID : 3 , team: 1
const member = {
  username: 'memberUsername',
  password: 'memberPassword',
};

const TEAM_NAME = 'teamName';
const OTHER_TEAM_NAME = 'otherTeamName';
const NEW_TEAM_NAME = 'newTeamName';

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

    it('Create other team', () => {
      return otherPrivateTest(`
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
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });
  });

  describe('registerMember', () => {
    it('Error: User not found', () => {
      return privateTest(`
      mutation {
          registerMember(input: {
            memberId: 999
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
                registerMember: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('User not found');
        });
    });

    // team 1 = {userId 1, userId 3}
    it('Register member', () => {
      return privateTest(`
        mutation {
            registerMember(input: {
              memberId: 3
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
                registerMember: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });

    it('Error: Already has team', () => {
      return otherPrivateTest(`
      mutation {
          registerMember(input: {
            memberId: 3
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
                registerMember: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already has team');
        });
    });
  });

  describe('editTeam', () => {
    it('Error: Already team exist', () => {
      return privateTest(`
          mutation {
            editTeam(input: {
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
                editTeam: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Already team exist');
        });
    });

    it('Error: Same team name', () => {
      return privateTest(`
          mutation {
            editTeam(input: {
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
                editTeam: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Same team name');
        });
    });

    it('Change team name', () => {
      return privateTest(`
          mutation {
            editTeam(input: {
              teamName: "${NEW_TEAM_NAME}"
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
                editTeam: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });
  });

  describe('teamDetail', () => {
    it('Error: Team not found', () => {
      return privateTest(`
          query {
            teamDetail(input: {
              teamId: 999
            }) {
              ok
              error
              team {
                teamName
                members {
                  username
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
                teamDetail: { ok, error, team },
              },
            },
          } = res;
          expect(ok).toEqual(false);
          expect(error).toEqual('Team not found');
          expect(team).toEqual(null);
        });
    });

    it('Find team ID: 1', () => {
      return privateTest(`
      query {
        teamDetail(input: {
          teamId: 1
        }) {
          ok
          error
          team {
            teamName
            members {
              username
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
                teamDetail: {
                  ok,
                  error,
                  team: { teamName, members },
                },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          expect(teamName).toEqual(NEW_TEAM_NAME);
          expect(members.length).toEqual(2);
          expect(members).toEqual([
            {
              username: representative.username,
            },
            {
              username: member.username,
            },
          ]);
        });
    });
  });

  describe('deleteTeam', () => {
    it('Delete team by representative', () => {
      return privateTest(`
          mutation {
            deleteTeam {
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
                deleteTeam: { ok, error },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
        });
    });

    // userId: 1, role: Representative
    it('Check role: Representative => Individual', () => {
      return privateTest(`
          query {
            me {
              username
              role
              team {
                teamName
              }
            }
          }
        `)
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                me: { username, role, team },
              },
            },
          } = res;
          expect(username).toEqual(representative.username);
          expect(role).toEqual(UserRole.Individual);
          expect(team).toEqual(null);
        });
    });

    // userId: 3, role: Member
    it('Check role: Member => Individual', () => {
      return privateTest(`
          query {
            getUser(input: {
              userId: 3
            }) {
              ok
              error
              user {
                username
                role
                team {
                  teamName
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
                getUser: {
                  user: { username, role, team },
                },
              },
            },
          } = res;
          expect(username).toEqual(member.username);
          expect(role).toEqual(UserRole.Individual);
          expect(team).toEqual(null);
        });
    });
  });

  describe('getTeams', () => {
    it('Find all teams', () => {
      return privateTest(`
          query {
            getTeams {
              ok
              error
              teams {
                teamName
                members {
                  username
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
                getTeams: { ok, error, teams },
              },
            },
          } = res;
          expect(ok).toEqual(true);
          expect(error).toEqual(null);
          expect(teams.length).toEqual(1);
          expect(teams).toEqual([
            {
              teamName: OTHER_TEAM_NAME,
              members: [
                {
                  username: otherUser.username,
                },
              ],
            },
          ]);
        });
    });
  });
});
