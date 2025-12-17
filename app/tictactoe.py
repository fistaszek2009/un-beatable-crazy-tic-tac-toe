BASE = 10

class TicTacToe():
    def __init__(self):
        self.board = [
            [0,0,0],
            [0,0,0],
            [0,0,0]
        ]
        self.currentSign = 1
        self.gameRunning = True
    
    def demo(self):
        while self.gameRunning:
            self.print()

            if self.currentSign == 1:
                self.insert()
            else:
                (x,y),s = self.minmax(False,0,self.board)
                self.insert(x*3+y)
                print("-"*30)

            win = self.checkWin(self.board)

            if win == 0 and any(cell == 0 for row in self.board for cell in row):
                self.currentSign = -self.currentSign
            
            else:
                self.gameRunning = False
                self.print()

                if win == 0:
                    print("Draw")
                
                else: print(f"Win {self.currentSign}")     

    def insert(self,where=None):
        if(where==None):
            print("Position of your move:")
        print(where)
        try:
            if(where>=0 and where<9 and self.board[(where)//3][(where)%3] == 0):
                self.board[(where)//3][(where)%3] = self.currentSign
            else:
                raise Exception("Bad index of board.")
        except:
            print("Problem with inserting position")

        win = self.checkWin(self.board)
        anyEmpty = any(cell == 0 for row in self.board for cell in row)

        if win != 0 or not anyEmpty:
            self.gameRunning = False

    def checkWin(self,board):
        for row in board:
            if(row[0] == row[1] and row[1] == row[2] and row[0] != 0):
                return row[0]
        
        for col in range(3):
            if(board[0][col] != 0 and board[0][col] == board[1][col] and board[1][col] == board[2][col]):
                return board[0][col]
        
        for i in range(0,3,2):
             if(board[0][2-i] != 0 and board[0][2-i]==board[1][1] and board[0][2-i] == board[2][i]):
                return board[0][2-i]

        return 0
    
    def print(self):
        for row in self.board:
            for j, item in enumerate(row):
                print(item, end="")
                if j != len(row) - 1:
                    print(" | ", end="")
            print()

    def minmax(self,isMaximising, depth, board):
        # x - max, o - min

        win = self.checkWin(board)
        emptyExists = any(cell == 0 for row in board for cell in row)

        if win != 0:
            score = (BASE - depth) * win
            return (None,None), score
        elif not emptyExists:
             return (None,None), 0

        bestMove = (None,None)
        bestScore = -9999 if isMaximising else 9999
       
        for i in range(len(board)):
            for j in range(len(board[i])):
                if board[i][j] == 0:

                    board[i][j] = 1 if isMaximising else -1
                    _,score = self.minmax(not isMaximising, depth+1, board)
                    
                    bestMove = (i,j) if(isMaximising and score > bestScore) or (not isMaximising and score < bestScore) else bestMove
                    bestScore = score if(isMaximising and score > bestScore) or (not isMaximising and score < bestScore) else bestScore
                    board[i][j] = 0


        return bestMove,bestScore
    
    def reset(self):
        self.board = [[0 for _ in range(3)] for _ in range(3)]
        self.currentSign = 1
        self.gameRunning = True

if __name__ == "__main__":
    game = TicTacToe()
    game.demo()