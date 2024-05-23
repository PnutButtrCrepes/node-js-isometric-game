import * as PIXI from './pixi.min.mjs';

import { PlayerCharacter } from './entity/playerCharacter.mjs';
import { Level } from './entity/level.mjs';
import { Tilemap } from './component-system/tilemap.mjs';
import { Walkable } from './component-system/walkable.mjs';
import { Camera } from './entity/camera.mjs';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

globalThis.app = new PIXI.Application
({
	width: WIDTH,
	height: HEIGHT,
	transparent: false,
    background: '#1099bb',
});
globalThis.app.stage.sortableChildren = true;

// used to help get rid of extra chrome padding and add renderer to page
app.renderer.view.style.position = 'absolute';
document.body.appendChild(app.view);

// some notes, Super Mario RPG: Mario is 30 (32) units tall, steps are 16 units tall, must-jump blocks are 48. These include the entire sprite
// other sprites that are not blocks but decorations are 32 units tall, or as tall as the player
// also note that every block is half as tall as its pixel height, as only half is height, rest is walkable

// the actual logic begins here
// register the camera
globalThis.camera = new Camera();

let entities = [];
//let systems = [];

let player = new PlayerCharacter();
entities.push(player);

let worldMap = new Level();
entities.push(worldMap);

player.getComponentOfType(Walkable).setCollisionTilemap(worldMap.getComponentOfType(Tilemap));
worldMap.getComponentOfType(Tilemap).setWorldPositionReference(player);

// Listen for animate update
app.ticker.add((delta) =>
{	
    for (const entity of entities)
		for (const component of entity.components)
			component.update(delta);
});