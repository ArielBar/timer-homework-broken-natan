import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { LogicService } from '../logic.service';
import { debounceTime, distinctUntilChanged, map, switchMap, take, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskAddComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private logicService: LogicService) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      text: [
        null,
        Validators.compose([Validators.required, Validators.minLength(2)]),
        this.validateNameExists.bind(this),
      ],
    });
  }

  submitHandler(text: string) {
    this.logicService.addTask(text.toLowerCase());
  }

  validateNameExists(control: AbstractControl): Observable<ValidationErrors> {
    return this.logicService
      .nameExists(`${control.value}`.toLowerCase())
      .pipe(map((nameIsTaken) => (!nameIsTaken ? null : { nameTaken: true })));
  }
}
