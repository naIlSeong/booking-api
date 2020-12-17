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

const TEAM_NAME = 'teamName';
const OTHER_TEAM_NAME = 'otherTeamName';

describe('TeamModule (e2e)', () => {
  let app: INestApplication;
  let representativeToken: string;
  let memberToken: string;

  const publicTest = (query: string) =>
    request(app.getHttpServer()).post('/graphql').send({ query });
  const privateTest = (query: string) =>
    request(app.getHttpServer())
      .post('/graphql')
      .set('x-jwt', representativeToken)
      .send({ query });
  const memberPrivateTest = (query: string) =>
    request(app.getHttpServer())
      .post('/graphql')
      .set('x-jwt', memberToken)
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
          representativeToken = token;
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

    it('login member & save token', () => {
      return publicTest(`
              mutation {
                  login(input: {
                  username: "${member.username}"
                  password: "${member.password}"
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
          memberToken = token;
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
      return memberPrivateTest(`
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

  it.todo('registerMember');
  it.todo('editTeam');
  it.todo('teamDetail');
  it.todo('getTeams');
  it.todo('deleteTeam');
});
