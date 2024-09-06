import { words } from './words.mjs';
import { HANGMAN_UI } from './hangman-ui.mjs';
import * as readline from 'readline';

let gameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0
};

const getRandomWord = () => {
  return words[Math.floor(Math.random() * words.length)];
};

const getBlankSpaces = (word) => {
  return Array(word.length).fill('_');
};

const getHangmanDrawing = (attempts) => {
  return HANGMAN_UI[attempts - 1];
};

const MAX_ATTEMPTS = 12;

const playGame = () => {
  gameStats.gamesPlayed++;

  let word = getRandomWord();
  let blankSpaces = getBlankSpaces(word);
  let attempts = 0;
  let guessedLetters = new Set();
  let mistakes = 0;

  console.log(`\x1b[32mWelcome to Hangman!\x1b[0m`);
  console.log(`\x1b[32mYou have ${MAX_ATTEMPTS} attempts to guess the word.\x1b[0m`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askForGuess = () => {
    rl.question(`Guess a letter: `, (guess) => {
      guess = guess.toLowerCase();

      if (guessedLetters.has(guess)) {
        console.log(`\x1b[31mYou already guessed ${guess}!\x1b[0m`);
        askForGuess();
        return;
      }

      guessedLetters.add(guess);

      let correct = false;
      for (let i = 0; i < word.length; i++) {
        if (word[i] === guess) {
          blankSpaces[i] = guess;
          correct = true;
        }
      }

      if (!correct) {
        mistakes++;
        attempts++;
      }

      console.log(getHangmanDrawing(attempts));
      console.log(`\x1b[32mWord: ${blankSpaces.join(' ')}\x1b[0m`);
      console.log(`\x1b[31mMistakes: ${mistakes}\x1b[0m`);

      if (attempts === MAX_ATTEMPTS) {
        console.log(`\x1b[31mGame over! The word was: ${word}\x1b[0m`);
        gameStats.gamesLost++;
        askIfPlayAgain(rl);
        return;
      }

      if (!blankSpaces.includes('_')) {
        console.log(`\x1b[32mCongratulations! You guessed the word: ${word}\x1b[0m`);
        gameStats.gamesWon++;
        askIfPlayAgain(rl);
        return;
      }

      askForGuess();
    });
  };

  const askIfPlayAgain = (rl) => {
    rl.question(`Do you want to play again? (yes/no) `, (response) => {
      response = response.toLowerCase();

      if (response === 'yes') {
        playGame();
      } else {
        console.log(`\x1b[32mThanks for playing!\x1b[0m`);
        console.log(`\x1b[32mGame Stats:\x1b[0m`);
        console.log(`\x1b[32mGames Played: ${gameStats.gamesPlayed}\x1b[0m`);
        console.log(`\x1b[32mGames Won: ${gameStats.gamesWon}\x1b[0m`);
        console.log(`\x1b[32mGames Lost: ${gameStats.gamesLost}\x1b[0m`);
        rl.close();
      }
    });
  };

  askForGuess();
};

playGame();