import { User } from './../auth/user.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './tasks.entity';
import { TaskStatus } from './tasks-status.enum';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        new Brackets((q) => {
          q.where(
            'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
            { search: `%${search}%` },
          );
        }),
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = this.create({
      title,
      description,
      status: TaskStatus.Open,
      user,
    });

    await this.save(task);
    return task;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.findOne({ where: { id, user } });

    return task;
  }
}
