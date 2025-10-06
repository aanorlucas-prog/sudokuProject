import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SudokuService {
    // Signals pour la grille et les cellules incorrectes
    grid = signal<number[][]>([]);
    incorrect = signal<boolean[][]>([]);

    // Plusieurs puzzles (0 = vide) et leurs solutions correspondantes
    private readonly puzzles: number[][][] = [
        [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ],
        [
            [0, 0, 0, 2, 6, 0, 7, 0, 1],
            [6, 8, 0, 0, 7, 0, 0, 9, 0],
            [1, 9, 0, 0, 0, 4, 5, 0, 0],
            [8, 2, 0, 1, 0, 0, 0, 4, 0],
            [0, 0, 4, 6, 0, 2, 9, 0, 0],
            [0, 5, 0, 0, 0, 3, 0, 2, 8],
            [0, 0, 9, 3, 0, 0, 0, 7, 4],
            [0, 4, 0, 0, 5, 0, 0, 3, 6],
            [7, 0, 3, 0, 1, 8, 0, 0, 0]
        ],
        [
            [0, 2, 0, 6, 0, 8, 0, 0, 0],
            [5, 8, 0, 0, 0, 9, 7, 0, 0],
            [0, 0, 0, 0, 4, 0, 0, 0, 0],
            [3, 7, 0, 0, 0, 0, 5, 0, 0],
            [6, 0, 0, 0, 0, 0, 0, 0, 4],
            [0, 0, 8, 0, 0, 0, 0, 1, 3],
            [0, 0, 0, 0, 2, 0, 0, 0, 0],
            [0, 0, 9, 8, 0, 0, 0, 3, 6],
            [0, 0, 0, 3, 0, 6, 0, 9, 0]
        ]
    ];

    private readonly solutions: number[][][] = [
        [
            [5, 3, 4, 6, 7, 8, 9, 1, 2],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [3, 4, 5, 2, 8, 6, 1, 7, 9]
        ],
        [
            [4, 3, 5, 2, 6, 9, 7, 8, 1],
            [6, 8, 2, 5, 7, 1, 4, 9, 3],
            [1, 9, 7, 8, 3, 4, 5, 6, 2],
            [8, 2, 6, 1, 9, 5, 3, 4, 7],
            [3, 7, 4, 6, 8, 2, 9, 1, 5],
            [9, 5, 1, 7, 4, 3, 6, 2, 8],
            [5, 1, 9, 3, 2, 6, 8, 7, 4],
            [2, 4, 8, 9, 5, 7, 1, 3, 6],
            [7, 6, 3, 4, 1, 8, 2, 5, 9]
        ],
        [
            [1, 2, 3, 6, 7, 8, 4, 5, 9],
            [5, 8, 4, 2, 3, 9, 7, 6, 1],
            [9, 6, 7, 1, 4, 5, 3, 2, 8],
            [3, 7, 2, 4, 6, 1, 5, 8, 0],
            [6, 9, 1, 5, 8, 3, 2, 7, 4],
            [4, 5, 8, 7, 9, 2, 6, 1, 3],
            [8, 3, 6, 9, 2, 4, 1, 0, 7],
            [2, 1, 9, 8, 5, 7, 0, 3, 6],
            [7, 4, 5, 3, 1, 6, 8, 9, 2]
        ]
    ];

    private currentIndex = signal<number>(0);

    constructor() {
        // Initialiser la grille avec le premier puzzle
        this.loadPuzzle(0);
    }

    // Signal computed pour savoir si le sudoku est résolu
    isSolved = computed<boolean>(() => {
        const g = this.grid();
        const solution = this.solutions[this.currentIndex()];
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (g[r][c] !== solution[r][c]) return false;
            }
        }
        return true;
    });

    // Charger un puzzle par index
    loadPuzzle(index: number): void {
        if (index < 0 || index >= this.puzzles.length) return;
        this.currentIndex.set(index);
        this.grid.set(this.puzzles[index].map(row => row.slice()));
        this.incorrect.set(Array.from({ length: 9 }, () => Array(9).fill(false)));
    }

    // Réinitialiser la grille courante
    resetGrid(): void {
        this.loadPuzzle(this.currentIndex());
    }

    // Modifier une cellule
    setCell(rowIndex: number, colIndex: number, value: number): void {
        // Empêcher la modification des cases données
        if (this.isGiven(rowIndex, colIndex)) return;
        if (rowIndex < 0 || rowIndex > 8 || colIndex < 0 || colIndex > 8) return;
        if (value < 0 || value > 9) return;

        const next = this.grid().map(row => row.slice());
        next[rowIndex][colIndex] = value;
        this.grid.set(next);
    }

    // Indique si la case est donnée (initiale, non éditable)
    isGiven(rowIndex: number, colIndex: number): boolean {
        return this.puzzles[this.currentIndex()][rowIndex][colIndex] !== 0;
    }

    // Vérifier les erreurs dans la grille
    check(): boolean {
        const g = this.grid();
        const solution = this.solutions[this.currentIndex()];
        const flags: boolean[][] = Array.from({ length: 9 }, () => Array(9).fill(false));
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const val = g[r][c];
                // case incorrecte si valeur non nulle et différente de la solution
                flags[r][c] = val !== 0 && val !== solution[r][c];
            }
        }
        this.incorrect.set(flags);
        return this.isSolved();
    }

    // Charger un puzzle aléatoire différent de l'actuel
    loadRandomPuzzle(): void {
        if (this.puzzles.length <= 1) {
            this.loadPuzzle(0);
            return;
        }
        let idx = this.currentIndex();
        while (idx === this.currentIndex()) {
            idx = Math.floor(Math.random() * this.puzzles.length);
        }
        this.loadPuzzle(idx);
    }
}
