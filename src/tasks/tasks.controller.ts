import { User } from './../auth/user.entity';
import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './tasks.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private taskService: TasksService) {}

  @Get()
  async getAllTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.debug(
      `Getting all tasks for user ${user.id} with filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    const result = this.taskService.getAllTasks(filterDto, user);

    return result;
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.debug(`Getting task ${id} for user ${user.id}}`);
    const task = await this.taskService.getTaskById(id, user);

    return task;
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.debug(
      `Create task for user ${user.id}. Task data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    const task = await this.taskService.createTask(createTaskDto, user);

    return task;
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    this.logger.debug(`Deleting task ${id} for user ${user.id}}`);
    await this.taskService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() { status }: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.debug(
      `Updating task ${id} status for user ${user.id}. New status: ${status}}`,
    );
    const task = await this.taskService.updateTaskStatus(id, status, user);

    return task;
  }
}
