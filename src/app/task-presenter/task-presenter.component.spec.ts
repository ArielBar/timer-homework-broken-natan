import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaskPresenterComponent } from './task-presenter.component';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { buttonText } from '../models/button-text.enum';
import { TaskModel } from '../models/task-model';

describe('TaskPresenterComponent', () => {
  let component: TaskPresenterComponent;
  let fixture: ComponentFixture<TaskPresenterComponent>;
  @Pipe({ name: 'minuteSeconds' })
  class MockPipe implements PipeTransform {
    transform(value: number): number {
      return value;
    }
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TaskPresenterComponent, MockPipe],
      imports: [MatIconModule, MatCardModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPresenterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render task', () => {
    // Arrange
    component.task = {
      id: 1,
      name: 'some name',
      buttonText: buttonText.pause,
      timer: of(10),
    };
    // Act
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement).toMatchSnapshot();
  });
  describe('onClick', () => {
    it('should emit clicked event when clicked', () => {
      const task: TaskModel = {
        id: 1,
        name: 'some name',
        buttonText: buttonText.pause,
        timer: of(10),
      };
      component.task = task;
      fixture.detectChanges();
      jest.spyOn(component.clicked, 'emit');

      component.click();

      expect(component.clicked.emit).toHaveBeenCalledWith(task);
    });
    it('should call click method on click event', () => {

      const task: TaskModel = {
        id: 1,
        name: 'some name',
        buttonText: buttonText.pause,
        timer: of(10),
      };
      component.task = task;

      fixture.detectChanges();
      jest.spyOn(component, 'click');

      const button = fixture.nativeElement.querySelector('#task-button');
      button.click();

      expect(component.click).toHaveBeenCalled();
    });
  })

  describe('DOM', () => {
    it('should render task details correctly', () => {
      const task: TaskModel = {
        id: 1,
        name: 'some name',
        buttonText: buttonText.pause,
        timer: of(10),
      };
      component.task = task;
      fixture.detectChanges();

      const taskNameElement = fixture.nativeElement.querySelector('.input-name');
      const buttonTextElement = fixture.nativeElement.querySelector('#task-button');
      expect(taskNameElement.textContent).toContain(task.name.toUpperCase());
      expect(buttonTextElement.textContent.trim()).toEqual(task.buttonText);
    });
  })
});
