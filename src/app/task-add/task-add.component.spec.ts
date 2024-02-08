import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule, AbstractControl } from '@angular/forms';
import { LogicService } from '../logic.service';
import { TaskAddComponent } from './task-add.component';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
describe('TaskAddComponent', () => {
  let component: TaskAddComponent;
  let fixture: ComponentFixture<TaskAddComponent>;
  beforeEach(() => {
    const logicServiceStub = {
      addTask: () => ({}),
      nameExists: () => of({}),
    };
    TestBed.configureTestingModule({
      declarations: [TaskAddComponent],
      providers: [{ provide: LogicService, useValue: logicServiceStub }],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatCardModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(TaskAddComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('validateNameExists', () => {
    it('makes expected calls', () => {
      const logicServiceStub: LogicService =
        fixture.debugElement.injector.get(LogicService);
      jest.spyOn(logicServiceStub, 'nameExists').mockReturnValue(of(true));

      const given = { value: 'hello' } as any;
      component.validateNameExists(given);
      expect(logicServiceStub.nameExists).toHaveBeenCalled();
    });
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const formBuilderStub: FormBuilder =
        fixture.debugElement.injector.get(FormBuilder);
      jest.spyOn(formBuilderStub, 'group');
      component.ngOnInit();
      expect(formBuilderStub.group).toHaveBeenCalled();
    });
  });
  describe('submitHandler', () => {
    it('makes expected calls', () => {
      const logicServiceStub: LogicService =
        fixture.debugElement.injector.get(LogicService);
      const spyAddTask = jest.spyOn(logicServiceStub, 'addTask');
      fixture.detectChanges();
      component.submitHandler('someText');
      expect(spyAddTask).toHaveBeenCalled();
    });
  });
  describe('validateNameExists', () => {
    it('should return null if name does not exist', () => {
      const logicServiceStub: LogicService =
        fixture.debugElement.injector.get(LogicService);
      const controlMock = { value: 'nameNotExisting' };
      jest.spyOn(logicServiceStub, 'nameExists').mockReturnValue(of(false));
      fixture.detectChanges();
      component.validateNameExists(controlMock as AbstractControl).subscribe(result => {
        expect(result).toBeNull();
      });
    });

    it('should return validation error if name already exists', () => {
      const logicServiceStub: LogicService =
        fixture.debugElement.injector.get(LogicService);
      const controlMock = { value: 'existingName' };
      jest.spyOn(logicServiceStub, 'nameExists').mockReturnValue(of(true));
      fixture.detectChanges();
      component.validateNameExists(controlMock as AbstractControl).subscribe(result => {
        expect(result).toEqual({ nameTaken: true });
      });
    });
  })
});
