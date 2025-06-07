import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { Question } from './models.interface';

@Injectable({
  providedIn: 'root'
})
export class CommonsService {
 private http = inject(HttpClient);

  private _questions = toSignal(
    this.http.get<Question[]>('/data/questions.json'),
    { initialValue: [] }
  );

  readonly questions = computed(() => this._questions());

  /**
   * Alternativa si quieres manejarlo como Observable directamente
   */
  getQuestions$(): Observable<Question[]> {
    return this.http.get<Question[]>('/data/questions.json');
  }

}
