import { User } from './../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getAllTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const tasks = await this.tasksRepository.getTasks(filterDto, user);

    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.tasksRepository.createTask(createTaskDto, user);

    return task;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.getTaskById(id, user);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }
}
