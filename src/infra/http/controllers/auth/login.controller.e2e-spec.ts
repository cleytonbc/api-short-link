import { describe, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { UserFactory } from '@test/factories/make-user';
import { LoginPresenter } from '../../presenters/login.presenter';

type LoginResponse = ReturnType<typeof LoginPresenter.toHTTP>;

describe('Get user by ID (integration)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [UserFactory],
    })

      .compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /login', async () => {
    const user = await userFactory.makePrismaUser({ password: 'test123' });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        password: `test123`,
        email: user.email,
      })
      .expect(200);

    const body = response.body as LoginResponse;

    expect(body).toHaveProperty('access_token');
    expect(body.user.name).toBe(user.name);
    expect(body.user.email).toBe(user.email);
    expect(body.user).not.toHaveProperty('password');
  }, 60000);
});
