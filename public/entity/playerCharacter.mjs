import { UserInput } from "../component-system/userInput.mjs";
import { Walkable } from "../component-system/walkable.mjs";
import { Entity } from "./entity.mjs";

export class PlayerCharacter extends Entity
{
	constructor()
	{
		super();
		this.addComponent(new UserInput(this));
		this.addComponent(new Walkable('../spritesheet.json', 4, 4, 2, 2));
	}
}