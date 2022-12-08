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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './tasks.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  async getAllTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    const result = this.taskService.getAllTasks(filterDto);

    return result;
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    const task = await this.taskService.getTaskById(id);

    return task;
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.taskService.createTask(createTaskDto);

    return task;
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string): Promise<void> {
    await this.taskService.deleteTask(id);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() { status }: UpdateTaskStatusDto,
  ): Promise<Task> {
    const task = await this.taskService.updateTaskStatus(id, status);

    return task;
  }
}
