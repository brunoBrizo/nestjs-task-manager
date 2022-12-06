import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getAllTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    const result = this.taskService.getAllTasks(filterDto);

    return result;
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    const task = this.taskService.getTaskById(id);

    return task;
  }

  @Post()
  createTask(@Body() { title, description }: CreateTaskDto): Task {
    const task = this.taskService.createTask(title, description);

    return task;
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.taskService.deleteTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() { status }: UpdateTaskStatusDto,
  ): Task {
    const task = this.taskService.updateTaskStatus(id, status);

    return task;
  }
}
