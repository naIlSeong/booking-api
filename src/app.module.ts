import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import * as Joi from '@hapi/joi';
import { User } from './user/entity/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { Booking } from './booking/entity/booking.entity';
import { Place } from './place/entity/place.entity';
import { PlaceModule } from './place/place.module';
import { PlaceLocation } from './place/entity/location.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TeamModule } from './team/team.module';
import { Team } from './team/entity/team.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.test',
      ],
      ignoreEnvVars: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'test', 'production'),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.number(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_DATABASE: Joi.string(),
        SALT: Joi.number(),
        PRIVATE_KEY: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      logging:
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test',
      entities: [User, Booking, Place, PlaceLocation, Team],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({ token: req.headers['x-jwt'] }),
      playground: process.env.NODE_ENV !== 'production',
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    BookingModule,
    PlaceModule,
    TeamModule,
  ],
})
export class AppModule {}
