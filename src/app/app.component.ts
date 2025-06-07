import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonsService } from './commons.service';
import { Question } from './models.interface';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, FormsModule, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
   private fb = inject(FormBuilder);
  private questionsService = inject(CommonsService);

  step = signal<'name' | 'quiz' | 'result'>('name');
  nameForm = this.fb.group({ name: ['', Validators.required] });
  playerName = signal('');

  questions = signal<Question[]>([]);
  currentIndex = signal(0);
  score = signal(0);
  answers = signal<{ question: string; selected: string; correct: boolean }[]>([]);

  // readonly currentQuestion = computed(() => this.questions()[this.currentIndex()] ?? null);
  readonly currentQuestion = computed(() => this.questions()[this.currentIndex()] ?? null);

constructor() {
  effect(() => {
    const loaded = this.questionsService.questions();
    if (loaded.length > 0 && this.questions().length === 0) {
      const shuffled = this.shuffleArray(loaded).map(q => ({
        ...q,
        responses: this.shuffleArray(q.responses)
      }));
      this.questions.set(shuffled);
    }
  });
}

startQuiz() {
  if (this.nameForm.invalid || this.questions().length === 0) return;
  this.playerName.set(this.nameForm.value.name!);
  this.step.set('quiz');
}

  selectAnswer(response: { response: string; correct: boolean }) {
    const current = this.currentQuestion();
    if (!current) return;

    const correct = response.correct;
    if (correct) this.score.update(s => s + 10);

    this.answers.update(arr => [
      ...arr,
      { question: current.question, selected: response.response, correct }
    ]);

    const next = this.currentIndex() + 1;
    if (next < this.questions().length) {
      this.currentIndex.set(next);
    } else {
      this.step.set('result');
    }
  }

  reset() {
    this.step.set('name');
    this.nameForm.reset();
    this.score.set(0);
    this.answers.set([]);
    this.currentIndex.set(0);

    const loaded = this.questionsService.questions();
    if (loaded.length > 0) {
      const shuffled = this.shuffleArray(loaded).map(q => ({
        ...q,
        responses: this.shuffleArray(q.responses)
      }));
      this.questions.set(shuffled);
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }
//  private questionsService = inject(CommonsService);
//   questions = signal<Question[]>([]);
//   currentIndex = signal(0);

//   readonly currentQuestion = () => this.questions()[this.currentIndex()] ?? null;

//   constructor() {
//     effect(() => {
//       const loaded = this.questionsService.questions();
//       if (loaded.length > 0 && this.questions().length === 0) {
//         const shuffled = this.shuffleArray(loaded).map(q => ({
//           ...q,
//           responses: this.shuffleArray(q.responses)
//         }));
//         this.questions.set(shuffled);
//       }
//     });
//   }

//   nextQuestion() {
//     const next = this.currentIndex() + 1;
//     if (next < this.questions().length) {
//       this.currentIndex.set(next);
//     }
//   }

//   shuffleArray<T>(array: T[]): T[] {
//     return [...array].sort(() => Math.random() - 0.5);
//   }
}
