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
    // this.form.markAsPristine();
    // this.form.markAsUntouched();
    // this.form.reset();
  }

  // validateNameExists(control: AbstractControl): Observable<ValidationErrors> {
  //   return this.logicService
  //     .nameExists(`${control.value}`.toLowerCase())
  //     .pipe(map((name) => (!name ? null : { nameTaken: true })));
  // }

  validateNameExists(control: AbstractControl): Observable<ValidationErrors> {
    if (!control.valueChanges || control.pristine) {
      return of(null);
    }
    else {
      return control.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        take(1),
        switchMap((value) => this.logicService.nameExists(`${value}`.toLowerCase())),
        // tap(() => control.markAsTouched()),
        map((nameIsTaken) => (nameIsTaken ? { nameTaken: true } : null))
      );
    }
  }
}
