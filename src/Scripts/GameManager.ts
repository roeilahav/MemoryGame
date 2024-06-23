import MainScene from "../Scenes/MainScene";

export class GameManager {
    private scene: MainScene;
    private symbols: Phaser.GameObjects.Sprite[];
    private flippedCards: Phaser.GameObjects.Sprite[];
    private canClick: boolean;
    private matches: number;
    private mistakes: number;
    private positiveFeedbacks: string[];
    private negativeFeedbacks: string[];
    private gameOver: boolean;
    private timerEvent: Phaser.Time.TimerEvent | null;
    private timerText!: Phaser.GameObjects.Text;
    private advancedMode: boolean;
    private leaderboard: { userName: string, userScore: number, userActions: number }[] = [];
    private leaderboardText: Phaser.GameObjects.Text | null = null;
    private userName: string;
    private userScore: number;
    private userActions: number;

    constructor(scene: MainScene) {
        this.scene = scene;
        this.symbols = this.scene.symbolsArr() as Phaser.GameObjects.Sprite[];
        this.flippedCards = [];
        this.canClick = true;
        this.matches = 0;
        this.mistakes = 0;
        this.positiveFeedbacks = ["Very good!", "You got this!", "Well Done!", "Keep going!", "You rock!"];
        this.negativeFeedbacks = ["Try again!", "Not correct!", "Almost!", "False!", "Try to remember!"];
        this.gameOver = false;
        this.timerEvent = null;
        this.advancedMode = false;
        this.userName = "";
        this.userScore = 0;
        this.userActions = 0;
    
        this.promptGameMode();
    }
    //handles the advanced mode before the game starts
    private promptGameMode() {
        const promptText = this.scene.add.text(400, 300, 'Try advanced mode?', { fontSize: '32px', color: '#F3E5AB', fontStyle: 'bold' }).setOrigin(0.5);
        const yesButton = this.scene.add.text(300, 350, 'Yes', { fontSize: '32px', color: '#F3E5AB', fontStyle: 'bold' }).setOrigin(0.5);
        const noButton = this.scene.add.text(500, 350, 'No', { fontSize: '32px', color: '#F3E5AB', fontStyle: 'bold' }).setOrigin(0.5);
    
        yesButton.setInteractive();
        noButton.setInteractive();
        yesButton.on('pointerdown', () => handleChoice(true));
        noButton.on('pointerdown', () => handleChoice(false));
        
        //handles the user's choice of game mode
        const handleChoice = (advanced: boolean,) => {
            this.advancedMode = advanced;
            promptText.destroy();
            yesButton.destroy();
            noButton.destroy();
            //initializing a new game (advanced mode or regular mode)
            this.initializeGame();
        };
    }

    //initializies a new game(also when restarting one)
    private initializeGame() {
        this.resetGameProperties();
        this.resetSymbols();
        this.shuffleSymbols();
        this.updateMistakesLeftText();
        this.showFeedback('start');
        if (this.advancedMode) {
            this.startTimer(60);
        }
    }
    
    //resets game properties
    private resetGameProperties() {
        this.matches = 0;
        this.mistakes = 0;
        this.flippedCards = [];
        this.userScore = 0; 
        this.userActions = 0; 
        this.gameOver = false;
         //hides the leaderboard when the game starts
        if (this.leaderboardText) {
            this.leaderboardText.destroy();
            this.leaderboardText = null;
        }
    }
    
    //flippes back the cards 
    private resetSymbols() {
        this.symbols.forEach((symbol) => {
            symbol.setTexture('symbols', 'symbol_0.png');
            symbol.setData('flipped', false);
            symbol.setData('matched', false);
            symbol.setInteractive();
            symbol.on('pointerdown', () => this.handleCardClick(symbol));
        });
    }
    
    //shuffles the positions of the cards each new game
    private shuffleSymbols() {
        const positions = this.symbols.map(symbol => ({ x: symbol.x, y: symbol.y }));
        Phaser.Utils.Array.Shuffle(positions);
        this.symbols.forEach((symbol, index) => {
            symbol.setPosition(positions[index].x, positions[index].y);
        });
    }
    
    //manages the actions that occur when a card is clicked 
    private handleCardClick(symbol: Phaser.GameObjects.Sprite) {
        if (this.canClick && !this.gameOver && !symbol.getData('flipped')) {
            this.flipCard(symbol);
            //pushes the two flipped cards into the array for match checking
            this.flippedCards.push(symbol);

            if (this.flippedCards.length === 2) {
                this.checkForMatch();
            }
        }
    }

    //flippes the card
    private flipCard(symbol: Phaser.GameObjects.Sprite) {
        const symbolKey = symbol.getData('symbolKey'); 
        symbol.setTexture('symbols', symbolKey).setData('flipped', true);
    }

    //checks for a match between 2 cards
    private checkForMatch() {
        const [card1, card2] = this.flippedCards;
        const isMatch = card1.getData('symbolKey') === card2.getData('symbolKey'); //comparison operation stored in a boolean const
        
        card1.setData('matched', isMatch);
        card2.setData('matched', isMatch);
        this.flippedCards = [];
        this.userActions++;
    
        if (isMatch) {
            this.handleMatch();
        } else {
            this.handleMismatch(card1, card2);
        }
    }
    
    //handles the game when there is a match
    private handleMatch() {
        this.matches++;
        this.userScore++;
    
        if (this.matches === 6) {
            this.endGame('win');
            this.scene.time.delayedCall(1000, () => {
                this.updateLeaderboard(); // updates the leaderboard when the game ends
            });
        } else {
            this.showFeedback('match');
            if (this.advancedMode) {
                this.swapTiles();
            }
        }
    }
    
    //handles the game when there is a mismatch
    private handleMismatch(card1: Phaser.GameObjects.Sprite, card2: Phaser.GameObjects.Sprite) {
        this.mistakes++;
        this.updateMistakesLeftText();
        if (this.mistakes === 6) {
            this.endGame('lose');
            this.scene.time.delayedCall(1000, () => {
                this.updateLeaderboard(); //updates the leaderboard when the game ends
            });
        } else {
            this.showFeedback('no match');
            this.canClick = false;
            this.scene.time.delayedCall(2000, () => {
                card1.setTexture('symbols', 'symbol_0.png').setData('flipped', false); //flipping back the cards
                card2.setTexture('symbols', 'symbol_0.png').setData('flipped', false);
                this.canClick = true;
            });
        }
    }

    //handles the feedbacks and the messages for each scenario
    private showFeedback(feedback: string) {
        this.canClick = false;
        let text = '';
        switch (feedback) {
            case 'start':
                text = 'Start!';
                break;
            case 'win':
                text = 'You Won!';
                break;
            case 'lose':
                text = 'Game Over!';
                break;
            case 'match':
                text = this.positiveFeedbacks[Math.floor(Math.random() * this.positiveFeedbacks.length)];
                break;
            case 'no match':
                text = this.negativeFeedbacks[Math.floor(Math.random() * this.negativeFeedbacks.length)];
                break;
            default:
                text = '';
        }
        
        const messageText = this.scene.add.text(400, 300, text, { fontSize: '50px', color: '#F3E5AB', fontStyle: 'bold' }).setOrigin(0.5);
        this.scene.time.delayedCall(2000, () => {
            messageText.setVisible(false);
            this.canClick = true;
        });
    }
    
    //creating the retry button
    private createRetryButton() {
        const retryButton = this.scene.add.text(400, 400, 'Retry', { fontSize: '50px', color: '#F3E5AB', fontStyle: 'bold' }).setOrigin(0.5);
        retryButton.setInteractive();
        retryButton.on('pointerdown', () => {
            retryButton.destroy();
            //if the user pressed the retry button, it starts the prompt agian and later inizializing the game 
            this.promptGameMode(); 
        });
    }
    
    //updates the counter of the mistakes left
    private updateMistakesLeftText() {
        const mistakesLeft = 6 - this.mistakes;
        this.scene.mistakesLeftText!.setText(`Mistakes Left: ${mistakesLeft} `);
    }

    //triggerd every time the game ends
    private endGame(feedback: string){
        this.showFeedback(feedback);
        this.stopTimer();
        this.gameOver = true;
        this.scene.time.delayedCall(2000, () => {
            this.createRetryButton();
        });   
    }

    //starts the timer when the user chosses to play in advanced mode
    private startTimer(duration: number) {
        this.timerText = this.scene.add.text(550, 30, "Time Left: 60", { fontSize: '32px', color: '#F3E5AB', fontStyle: 'bold' }).setOrigin(0.5);

        //create a new timer event
        this.timerEvent = this.scene.time.addEvent({
            delay: duration * 1000,
            
        //triggered when the timer runs out
            callback: this.handleTimeout,
            callbackScope: this
        });
        //repeating event for updating the timer
        this.scene.time.addEvent({
            delay: 1000,
            callback: this.updateTimerText,
            callbackScope: this,
            loop: true
        });
    }
    
    //stopps and removes the timer when the game ends
    private stopTimer() {
        if (this.timerEvent) {
            this.timerEvent.remove();
            this.timerEvent = null;
        }
        if (this.timerText) {
            this.timerText.destroy();
        }
    }

    //handles the timer when times up
    private handleTimeout() {
        this.stopTimer();
        this.endGame('lose');
        this.scene.time.delayedCall(1000, () => {
            this.updateLeaderboard(); 
        });
    }

    //updates the time every second
    private updateTimerText() {
        if (this.timerEvent) {
            const timeLeft = Math.ceil(this.timerEvent.getRemainingSeconds()); 
            if (timeLeft >= 0) {
                this.timerText.setText(`Time Left: ${timeLeft}`);
            }
        }
    }

    //swappes tiles in advanced mode
    private swapTiles() {
    //filtering unflipped tiles
    const unflippedTiles = this.symbols.filter(symbol => !symbol.getData('flipped'));
    if (unflippedTiles.length <= 2) return;

    //selecting 2 random tiles
    const index1 = Phaser.Math.Between(0, unflippedTiles.length - 1);
    let index2 = Phaser.Math.Between(0, unflippedTiles.length - 1);

    //if its the same tile, keep searching
    while (index1 === index2) {
        index2 = Phaser.Math.Between(0, unflippedTiles.length - 1);
    }

    //storing the tiles and the new positions
    const symbol1 = unflippedTiles[index1];
    const symbol2 = unflippedTiles[index2];

    const tempPosition = { x: symbol1.x, y: symbol1.y };
    
    //the animation for the swap
    this.scene.tweens.add({
        targets: symbol1,
        x: symbol2.x,
        y: symbol2.y,
        duration: 800,
        ease: 'Power2'
    });

    this.scene.tweens.add({
        targets: symbol2,
        x: tempPosition.x,
        y: tempPosition.y,
        duration: 800,
        ease: 'Power2'
    });
    }

    //updates the score and the amount of actions taken by the user
    private updateLeaderboard() {
        this.userName = prompt("Enter your name:") || "Player";
        this.leaderboard.push({ userName: this.userName, userScore: this.userScore, userActions: this.userActions });
        // sort leaderboard by score in descending order, and by actions in ascending order(if there is a tie)
        this.leaderboard.sort((a, b) => {
            if (b.userScore === a.userScore) {
                return a.userActions - b.userActions;
            }
            return b.userScore - a.userScore;
        });
        this.displayLeaderboard();
    }

    //displays the ranks of the users
    private displayLeaderboard() {
    const leaderboardText = this.leaderboard.map((entry, index) => `${index + 1}.${entry.userName}  Score:${entry.userScore}  Actions:${entry.userActions}`).join('\n');
    const leaderboardStyle = { fontSize: '24px', color: '#F3E5AB', fontStyle: 'bold', backgroundColor: '#000000' }; 
    this.leaderboardText = this.scene.add.text(400, 100,`\n${leaderboardText}`, leaderboardStyle).setOrigin(0.5);
    }
}