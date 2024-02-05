import { Injectable } from '@angular/core';
import { TaskModel } from './models/task-model';
import { Observable, combineLatest, Subject, of } from 'rxjs';
import { TaskFactoryService } from './task-factory.service';
import { map, switchMap } from 'rxjs/operators';
import { CloneSubject } from './clone-subject';
import { buttonText } from '../app/models/button-text.enum';

@Injectable({
  providedIn: 'root',
})
export class LogicService {
  readonly initialState: TaskModel[] = [];
  private state: TaskModel[] = [...this.initialState];
  private logicSubj$ = new CloneSubject(this.state);

  constructor(private taskService: TaskFactoryService) { }

  public get tasks$(): Observable<TaskModel[]> {
    return this.logicSubj$.asObservable();
  }

  public addTask(tskName: string) {
    const newTask = this.taskService.createTask(tskName);
    this.state = [...this.state, newTask];
    this.doNext();
  }

  public updateTask(evt: TaskModel): void {
    this.state = this.toggleAllButtonTexts(this.state, evt);
    this.doNext();
  }

  public get totalTime$(): Observable<number> {
    return this.tasks$.pipe(
      switchMap((tasks) =>
        combineLatest(tasks.map((task) => task.timer))
      ),
      map((timers) => timers.reduce((total, current) => total + current, 0))
    );
  }

  public nameExists(value: string): Observable<boolean> {
    return of(this.state.find((x) => x.name === value) !== undefined);
  }

  private toggleAllButtonTexts(
    tasks: TaskModel[],
    selectedTask: TaskModel
  ): TaskModel[] {
    tasks
      .filter((tsk) => tsk.id !== selectedTask.id)
      .forEach((tsk) => this.inactivateButtons(tsk));
    this.toggleText(selectedTask);
    return [...tasks];
  }


  private inactivateButtons(tsk: TaskModel): void {
    if (tsk.buttonText === buttonText.pause) {
      this.setPause(tsk);
    }
  }

  private toggleText(tsk: TaskModel): void {
    if (tsk.buttonText === buttonText.play_arrow) {
      this.setPlay(tsk);
    } else {
      this.setPause(tsk);
    }
  }

  private setPlay(tsk: TaskModel): void {
    tsk.buttonText = buttonText.pause;
    this.taskService.play(tsk.id);
  }

  private setPause(tsk: TaskModel): void {
    tsk.buttonText = buttonText.play_arrow;
    this.taskService.pause(tsk.id);
  }

  private doNext() {
    this.logicSubj$.next(this.state);
  }
}
