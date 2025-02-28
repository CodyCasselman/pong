import { Game } from "../classes/game";
import { canvas, ctx } from "../constants";
import { drawText } from "../drawing/draw";

const game = Game.getInstance();

// Define the menu options
const menuOptions = ["1 Player ", "2 Players"]; //, "Settings"];

// Define the selected menu index (starting from zero)
let selectedMenuIndex = 0;

const drawTitle = (): void => {
  // Draw the title text on the canvas
  drawText({
    text: "Pong",
    x: canvas.width / 2,
    y: canvas.height / 2 - 100,
    isBold: true,
    fontSize: 92,
    hasShadow: true,
  });
};

const drawMenuOptions = (): void => {
  // Loop through each menu option and draw it on the canvas
  for (let i = 0; i < menuOptions.length; i++) {
    const x = canvas.width / 2;
    const y = canvas.height / 2 + i * 50 - (menuOptions.length - 1) * 25;
    let text = menuOptions[i];
    let color = `rgba(255, 255, 255)`;

    if (i === selectedMenuIndex) {
      // If this menu option is selected, draw it with a different color
      color = `rgba(255, 255, 0)`;
      text = ">" + text;
    } else {
      text = " " + text;
    }

    drawText({
      text: text,
      color,
      x,
      y,
      isBold: true,
      fontSize: 32,
    });
  }
};

// Draw the menu on the canvas
export const drawMenu = (): void => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawTitle();
  drawMenuOptions();
};

//REFACTOR
export const moveMenuCursor = (direction: string) : void => {
  let directionModifier = (direction === "up"? 1 : menuOptions.length - 1 );
  selectedMenuIndex = selectedMenuIndex + directionModifier % menuOptions.length;
  drawMenu();
}

export const menuActions = (): void => {
  if (selectedMenuIndex === 0) {
    game.setPlayers(1);
  } else if (selectedMenuIndex === 1) {
    game.setPlayers(2);
  }
  game.newGame();
};

const showSettings = (): void => {
  // add settings menu
  throw new Error("Function not implemented.");
};
