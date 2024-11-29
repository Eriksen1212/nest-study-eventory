import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configModule } from './modules/config.module';
import { LoggerMiddleware } from '../common/middlewares/logger.middleware';
import { RegionModule } from '../region/region.module';
import { CommonModule } from '../common/common.module';
import { ReviewModule } from '../review/review.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { EventModule } from '../event/event.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    AuthModule,
    configModule,
    RegionModule,
    CategoryModule,
    CommonModule,
    ReviewModule,
    EventModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
