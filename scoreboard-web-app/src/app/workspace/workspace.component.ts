import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Game } from './models/game.model';
import { GameResult } from './models/game-result.model';
import { EditOption } from './enums/edit-option.enum';
import { ChangeType } from './enums/change-type.enum';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  game: Game = {
    home: {
      leg: 0,
      set: 0,
      total: 0,
      changed: ChangeType.None
    },
    guest: {
      leg: 0,
      set: 0,
      total: 0,
      changed: ChangeType.None
    }
  }
  EditOption = EditOption;
  ChangeType = ChangeType;

  editMode: boolean = false;
  editOptions: EditOption[] = [EditOption.HomeLeg, EditOption.GuestLeg, EditOption.HomeSet, EditOption.GuestSet, EditOption.HomeTotal, EditOption.GuestTotal, EditOption.Return, EditOption.Reset];
  focusedOption: number = 0;
  selectedEditOption?: EditOption;
  constructor(private websocketService: WebsocketService) {

  }

  ngOnInit(): void {
    this.websocketService.receiveMessage().subscribe(message => {
      if (message.state == 'BUTTON_PRESSED') {
        this.buttonPressed();
      }
      else if (message.state == 'ROTATED') {
        this.changeFocused(message.delta)
      }
      else if (message.state == 'HOME_CHANGE') {
        this.incrementLeg(this.game.home)
      }
      else if (message.state == 'GUEST_CHANGE') {
        this.incrementLeg(this.game.guest)
      }
    });
  }

  incrementLeg(gameResult: GameResult) {
    this.resetGameChangeType();
    gameResult.leg = gameResult.leg + 1;
    gameResult.total = gameResult.total + 1;
    gameResult.changed = ChangeType.Leg;
    if (gameResult.leg == 2) {
      this.incrementSet(gameResult, true);
    }
  }

  incrementSet(gameResult: GameResult, resetLegs: boolean) {
    this.resetGameChangeType();
    gameResult.set = gameResult.set + 1;
    gameResult.changed = ChangeType.Set;
    if (resetLegs) {
      this.game.home.leg = 0;
      this.game.guest.leg = 0;
    }
  }

  resetGame() {
    this.game = {
      home: {
        leg: 0,
        set: 0,
        total: 0,
        changed: ChangeType.None
      },
      guest: {
        leg: 0,
        set: 0,
        total: 0,
        changed: ChangeType.None
      }
    }
    this.returnToGame();
  }

  resetGameChangeType() {
    this.game.home.changed = ChangeType.None;
    this.game.guest.changed = ChangeType.None;
  }

  buttonPressed() {
    if (this.editMode) {
      if (this.selectedEditOption == EditOption.Reset || this.editOptions[this.focusedOption] == EditOption.Reset) {
        this.resetGame();
      }
      else if (this.selectedEditOption == EditOption.Return || this.editOptions[this.focusedOption] == EditOption.Return) {
        this.returnToGame();
      }
      else if (this.selectedEditOption == this.editOptions[this.focusedOption]) {
        this.selectedEditOption = undefined;
      }
      else {
        this.selectedEditOption = this.editOptions[this.focusedOption]
      }
    }
    else {
      this.editMode = true;
    }
  }

  returnToGame() {
    this.editMode = false;
    this.focusedOption = 0;
    this.selectedEditOption = undefined;
  }

  changeFocused(delta: number) {
    if (this.selectedEditOption) {
      if (this.selectedEditOption == EditOption.HomeLeg) {
        this.game.home.leg = this.game.home.leg + delta;
        if (this.game.home.leg >= 2) {
          this.game.home.leg = 0;
        }
        else if (this.game.home.leg < 0) {
          this.game.home.leg = 1;
        }
      }
      else if (this.selectedEditOption == EditOption.GuestLeg) {
        this.game.guest.leg = this.game.guest.leg + delta;
        if (this.game.guest.leg >= 2) {
          this.game.guest.leg = 0;
        }
        else if (this.game.guest.leg < 0) {
          this.game.guest.leg = 1;
        }
      }
      else if (this.selectedEditOption == EditOption.HomeSet) {
        this.game.home.set = this.game.home.set + delta;
        if (this.game.home.set >= 100) {
          this.game.home.set = 99;
        }
        else if (this.game.home.set < 0) {
          this.game.home.set = 0;
        }
      }
      else if (this.selectedEditOption == EditOption.GuestSet) {
        this.game.guest.set = this.game.guest.set + delta;
        if (this.game.guest.set >= 100) {
          this.game.guest.set = 99;
        }
        else if (this.game.guest.set < 0) {
          this.game.guest.set = 0;
        }
      }
      else if (this.selectedEditOption == EditOption.HomeTotal) {
        this.game.home.total = this.game.home.total + delta;
        if (this.game.home.total >= 1000) {
          this.game.home.total = 999;
        }
        else if (this.game.home.total < 0) {
          this.game.home.total = 0;
        }
      }
      else if (this.selectedEditOption == EditOption.GuestTotal) {
        this.game.guest.total = this.game.guest.total + delta;
        if (this.game.guest.total >= 1000) {
          this.game.guest.total = 999;
        }
        else if (this.game.guest.total < 0) {
          this.game.guest.total = 0;
        }
      }
    }
    else {
      this.focusedOption = this.focusedOption + delta
      if (this.focusedOption < 0) {
        this.focusedOption = this.editOptions.length - 1;
      }
      if (this.focusedOption == this.editOptions.length) {
        this.focusedOption = 0;
      }
    }
  }
}