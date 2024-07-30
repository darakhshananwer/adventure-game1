#! /usr/bin/env node

import inquirer from 'inquirer';

type Room = {
  name: string;
  description: string;
  items: string[];
  actions: { [key: string]: string };
};

class Game {
  rooms: { [key: string]: Room };
  currentRoom: Room;
  inventory: string[];

  constructor() {
    this.rooms = {
      start: {
        name: 'Start Room',
        description: 'You are in a small, dimly lit room. There is a door to the north.',
        items: [],
        actions: { goNorth: 'hallway' }
      },
      hallway: {
        name: 'Hallway',
        description: 'A long, narrow hallway. There is a door to the south and a door to the north.',
        items: ['key'],
        actions: { goSouth: 'start', goNorth: 'treasureRoom' }
      },
      treasureRoom: {
        name: 'Treasure Room',
        description: 'A room filled with treasure. There is a door to the south.',
        items: [],
        actions: { goSouth: 'hallway' }
      }
    };
    this.currentRoom = this.rooms['start'];
    this.inventory = [];
  }

  async start() {
    console.log('Welcome to the Adventure Game!');
    while (true) {
      console.log(`\n${this.currentRoom.description}`);
      if (this.currentRoom.items.length > 0) {
        console.log(`You see: ${this.currentRoom.items.join(', ')}`);
      }

      const actionChoices = Object.keys(this.currentRoom.actions).concat(['pickUp', 'inventory', 'quit']);
      const answer = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: actionChoices
      });

      if (answer.action === 'pickUp') {
        await this.pickUp();
      } else if (answer.action === 'inventory') {
        this.showInventory();
      } else if (answer.action === 'quit') {
        console.log('Thanks for playing!');
        break;
      } else {
        await this.move(answer.action);
      }
    }
  }

  async pickUp() {
    if (this.currentRoom.items.length === 0) {
      console.log('There is nothing to pick up.');
      return;
    }

    const itemAnswer = await inquirer.prompt({
      type: 'list',
      name: 'item',
      message: 'What do you want to pick up?',
      choices: this.currentRoom.items
    });

    this.inventory.push(itemAnswer.item);
    this.currentRoom.items = this.currentRoom.items.filter(item => item !== itemAnswer.item);
    console.log(`You picked up: ${itemAnswer.item}`);
  }

  showInventory() {
    if (this.inventory.length === 0) {
      console.log('Your inventory is empty.');
    } else {
      console.log(`You have: ${this.inventory.join(', ')}`);
    }
  }

  async move(action: string) {
    const nextRoomKey = this.currentRoom.actions[action];
    if (nextRoomKey) {
      this.currentRoom = this.rooms[nextRoomKey];
    } else {
      console.log('You cannot go that way.');
    }
  }
}

const game = new Game();
game.start();