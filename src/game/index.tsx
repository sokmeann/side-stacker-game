export class SideStackerGame {
  numRows: number;
  numColumns: number;
  rowWin: number | boolean;
  columnWin: number | boolean;
  diagonalWin: number | boolean;
  winner: boolean | 1 | 2;

  constructor(numRows: number, numColumns: number) {
    this.numRows = numRows;
    this.numColumns = numColumns;
    this.rowWin = false;
    this.columnWin = false;
    this.diagonalWin = false;
    this.winner = false;
  }
  // initialize a game
  createBoard() {
    const row = Array.apply(null, Array(this.numColumns)).map((e) => 0);
    const board = Array.apply(null, Array(this.numRows)).map(
      () => row
    ) as Array<Array<0 | 1 | 2>>;
    return board;
  }
  // check if row still has room to add a new token
  canAddToken(row: Array<0 | 1 | 2>) {
    return row.includes(0);
  }
  // add token from either left or right side of the stack
  addToken(
    dir: "left" | "right",
    token: 1 | 2,
    rowIdx: number,
    board: Array<Array<0 | 1 | 2>>
  ) {
    let row = new Array(...board[rowIdx]);

    if (dir === "left") {
      row.unshift(token);
      const index = row.indexOf(0);
      row.splice(index, 1);
    }
    if (dir === "right") {
      row.push(token);
      const index = row.indexOf(0);
      row.splice(index, 1);
    }
    board[rowIdx] = row;
    if (!this.winner) {
      this.checkRowWin(rowIdx, board);
      this.checkColumnWin(board);
      this.checkDiagonalWin(board);
    }
    return board;
  }
  // check if row win
  checkRowWin(rowIdx: number, board: Array<Array<0 | 1 | 2>>) {
    const row = board[rowIdx].join("");
    if (row.includes("1111")) {
      this.rowWin = rowIdx;
      this.winner = 1;
    }
    if (row.includes("2222")) {
      this.rowWin = rowIdx;
      this.winner = 2;
    }
  }
  // check if column win
  checkColumnWin(board: Array<Array<0 | 1 | 2>>) {
    for (let i = 0; i < this.numColumns; i++) {
      if (!this.winner) {
        const col: Array<0 | 1 | 2> = [];
        board.forEach((e) => col.push(e[i]));
        const column = col.join("");
        if (column.includes("1111")) {
          this.columnWin = i;
          this.winner = 1;
        }
        if (column.includes("2222")) {
          this.columnWin = i;
          this.winner = 2;
        }
      }
    }
  }
  // check if diagonal win
  // possible diagonal wins happen when cell coord starts at 3,0 until 6,3
  // with row-- and column++ pattern
  // or when cell coords starts at 3,0 until 0,3
  // with row++ and column++ pattern
  // total of 14 diagonals to check
  checkDiagonalWin(board: Array<Array<0 | 1 | 2>>) {
    const diagonals: Array<string> = [];
    const startValsDir1 = [
      { r: 3, c: 0 },
      { r: 4, c: 0 },
      { r: 5, c: 0 },
      { r: 6, c: 0 },
      { r: 6, c: 1 },
      { r: 6, c: 2 },
      { r: 6, c: 3 },
    ];
    const startValsDir2 = [
      { r: 3, c: 0 },
      { r: 2, c: 0 },
      { r: 1, c: 0 },
      { r: 0, c: 0 },
      { r: 0, c: 1 },
      { r: 0, c: 2 },
      { r: 0, c: 3 },
    ];
    startValsDir1.forEach((e) =>
      diagonals.push(this.getDiagonalDir1(e.r, e.c, board))
    );
    startValsDir2.forEach((e) =>
      diagonals.push(this.getDiagonalDir2(e.r, e.c, board))
    );
    diagonals.forEach((diagonal, i) => {
      if (!this.winner) {
        if (diagonal.includes("1111")) {
          this.diagonalWin = i;
          this.winner = 1;
        }
        if (diagonal.includes("2222")) {
          this.diagonalWin = i;
          this.winner = 2;
        }
      }
    });
  }
  // get diagonal values direction 1
  getDiagonalDir1(
    startRow: number,
    startColumn: number,
    board: Array<Array<0 | 1 | 2>>
  ) {
    const diagonal = [];
    let count = 0;
    for (let r = startRow; r >= 0; r--) {
      const c = startColumn + count;
      diagonal.push(board[r][c]);
      count++;
    }
    return diagonal.join("");
  }
  // get diagonal values direction 2
  getDiagonalDir2(
    startRow: number,
    startColumn: number,
    board: Array<Array<0 | 1 | 2>>
  ) {
    const diagonal = [];
    let count = 0;
    for (let r = startRow; r <= 6; r++) {
      const c = startColumn + count;
      diagonal.push(board[r][c]);
      count++;
    }
    return diagonal.join("");
  }
  // get winner
  getWinner() {
    return this.winner;
  }
}
