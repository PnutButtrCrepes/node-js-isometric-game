import { Entity } from "./entity.mjs";
import { Tilemap } from "../component-system/tilemap.mjs";

export class Level extends Entity
{
	constructor()
	{
		super();
		this.addComponent(new Tilemap('../isometric_2.json'));
	}
}