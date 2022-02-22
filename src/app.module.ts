import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import get from 'lodash.get';
import set from 'lodash.set';
import { decode } from './utils/jwt.utils';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      cors: {
        credential: true,
      },
      context: ({ req, res }) => {
        const token = get(req, 'cookies.token');
        const user = token ? decode(token) : null;
        if (user) {
          set(req, 'user', user);
        }
        return { req, res };
      },
    }),
    MongooseModule.forRoot(process.env.DATABASE),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
