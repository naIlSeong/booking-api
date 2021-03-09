"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("./user/user.module");
const Joi = require("@hapi/joi");
const user_entity_1 = require("./user/entity/user.entity");
const jwt_module_1 = require("./jwt/jwt.module");
const auth_module_1 = require("./auth/auth.module");
const booking_module_1 = require("./booking/booking.module");
const booking_entity_1 = require("./booking/entity/booking.entity");
const place_entity_1 = require("./place/entity/place.entity");
const place_module_1 = require("./place/place.module");
const location_entity_1 = require("./place/entity/location.entity");
const schedule_1 = require("@nestjs/schedule");
const team_module_1 = require("./team/team.module");
const team_entity_1 = require("./team/entity/team.entity");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
                ignoreEnvVars: process.env.NODE_ENV === 'production',
                validationSchema: Joi.object({
                    NODE_ENV: Joi.string().valid('dev', 'test', 'production').required(),
                    DB_HOST: Joi.string().required(),
                    DB_PORT: Joi.number().required(),
                    DB_USERNAME: Joi.string().required(),
                    DB_PASSWORD: Joi.string().required(),
                    DB_DATABASE: Joi.string().required(),
                    SALT: Joi.number().required(),
                    PRIVATE_KEY: Joi.string().required(),
                }),
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: +process.env.DB_PORT,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                synchronize: true,
                logging: process.env.NODE_ENV !== 'production' &&
                    process.env.NODE_ENV !== 'test',
                entities: [user_entity_1.User, booking_entity_1.Booking, place_entity_1.Place, location_entity_1.PlaceLocation, team_entity_1.Team],
            }),
            graphql_1.GraphQLModule.forRoot({
                autoSchemaFile: true,
                context: ({ req }) => ({ token: req.headers['x-jwt'] }),
                playground: process.env.NODE_ENV !== 'production',
            }),
            jwt_module_1.JwtModule.forRoot({
                privateKey: process.env.PRIVATE_KEY,
            }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            booking_module_1.BookingModule,
            place_module_1.PlaceModule,
            team_module_1.TeamModule,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map