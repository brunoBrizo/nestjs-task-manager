import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'host.docker.internal',
      port: 49153,
      username: 'postgres',
      password: 'postgrespw',
      database: 'task-manager',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
