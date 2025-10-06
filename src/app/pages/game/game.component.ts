import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SudokuService } from '../../services/sudoku.service';

@Component({
  selector: 'app-game',
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  private sudoku = inject(SudokuService);

  rows = Array.from({ length: 9 }, (_, i) => i);
  cols = Array.from({ length: 9 }, (_, i) => i);

  grid = computed(() => this.sudoku.grid());
  incorrect = computed(() => this.sudoku.incorrect());
  solved = computed(() => this.sudoku.isSolved());

  isGiven(r: number, c: number): boolean {
    return this.sudoku.isGiven(r, c);
  }

  ngOnInit() {
    console.log(this.grid());
  }
  verify(): void {
    this.sudoku.check();
  }

  newPuzzle(): void {
    this.sudoku.loadRandomPuzzle();
  }

  onInput(rowIndex: number, colIndex: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.trim();
    if (raw === '') {
      this.sudoku.setCell(rowIndex, colIndex, 0);
      return;
    }
    const num = Number(raw);
    if (Number.isInteger(num) && num >= 1 && num <= 9) {
      this.sudoku.setCell(rowIndex, colIndex, num);
    } else {
      const current = this.grid()[rowIndex][colIndex];
      input.value = current === 0 ? '' : String(current);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (allowed.includes(event.key)) return;
    if (/^[1-9]$/.test(event.key)) return;
    event.preventDefault();
  }
}
