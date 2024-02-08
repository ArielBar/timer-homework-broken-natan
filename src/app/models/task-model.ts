import { Observable } from 'rxjs';
import { buttonText } from './button-text.enum';

export interface TaskModel {
  id: number;
  name: string;
  timer: Observable<number>;
  buttonText: buttonText;
}
