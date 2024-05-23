import * as PIXI from '../pixi.min.mjs';

import { Component } from "./component.mjs";
import { Walkable } from './walkable.mjs';
import { FollowCamera } from './follow_camera.mjs';

export class Tilemap extends Component
{
	tilemapContainer;
	tilemapString;
	tilemap;
	textures;
	
	player;
	
	constructor(spritesheetPath)
	{
		super();
		
		this.tilemap = [];
		
		this.tilemapContainer = [];
		this.tilemapString = "1,1,1,1,1,1,1\n0,0,0,0,0,0,0\n0,0,0,0,0,0,0\n0,0,0,0,0,0,0\n0,0,0,0,0,0,0\n0,0,0,0,0,0,0\n2,2,2,2,2,2,2\n\n-\n-,0,0,0,0,0,-\n-,0,0,0,0,0,-\n-,0,0,0,0,0,-\n-,0,0,0,0,0,-\n-,0,0,0,0,0,-\n\n-\n-\n-,-,0,0,0,-,-\n-,-,0,0,0,-,-\n-,-,0,0,0,-,-\n\n-\n-\n-\n-,-,-,0,-,-,-\n\n-\n-\n-\n-,-,-,0,0,-,-"; //"0,-,0,0,0\n0,-,0,-,-\n0,0,0,0,0\n-,-,0,-,0\n0,0,0,-,0";
		
		let layers = this.tilemapString.split("\n\n");
		for (let i = 0; i < layers.length; i++)
		{
			let lines = layers[i].split("\n");
			this.tilemap[i] = [];
			for (let j = 0; j < lines.length; j++)
				this.tilemap[i].push(lines[j].split(","));
		}
		
		console.log(this.tilemap);
		
		this.loadTiles(spritesheetPath);
	}
	
	async loadTiles(spritesheetPath)
	{
		const sheet = await PIXI.Assets.load(spritesheetPath);
		sheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
		this.textures = Object.values(sheet.textures);
		
		for (let z = 0; z < this.tilemap.length; z++)
			for (let y = 0; y < this.tilemap[z].length; y++)
				for (let x = 0; x < this.tilemap[z][y].length; x++)
				{
					if (this.tilemap[z][y][x] == '-')
						continue;
					
					let tile = new PIXI.Sprite(this.textures[parseInt(this.tilemap[z][y][x])]);
					tile.scale.set(2, 2);
					tile._anchor.set(0.5, 0.5);
					globalThis.app.stage.addChild(tile);
					this.tilemapContainer.push({ x: x, y: -y, z: z, tile: tile });
				}
	}
	
	setWorldPositionReference(player)
	{
		this.player = player;
	}
	
	checkCollision(currentPosition, movementVector)
	{
		let newPosition = { x: currentPosition.x + movementVector.x, y: currentPosition.y + movementVector.y, z: currentPosition.z + movementVector.z };
		
		for (let i = 0; i < this.tilemapContainer.length; i++)
		{
			let currentTile = this.tilemapContainer[i];
			if (newPosition.x + 0.25 > currentTile.x - 0.5 && newPosition.x - 0.25 < currentTile.x + 0.5
				&& newPosition.y + 0.25 > currentTile.y - 0.5 && newPosition.y - 0.25 < currentTile.y + 0.5
				&& newPosition.z + 1 > currentTile.z - 0.5 && newPosition.z - 0 < currentTile.z + 0.5)
			{
				// collision detected, find the unaligned axis and put character in correct position
				
				/*
				if (currentPosition.x + 0.5 < currentTile.x - 0.5)
					return { x: currentTile.x - 0.5, y: newPosition.y, z: newPosition.z };
				else if (currentPosition.x - 0.5 > currentTile.x + 0.5)
					return { x: currentTile.x + 0.5, y: newPosition.y, z: newPosition.z };
				
				if (currentPosition.y + 0.5 < currentTile.y - 0.5)
					return { x: newPosition.x, y: currentTile.y - 0.5, z: newPosition.z };
				else if (currentPosition.y - 0.5 > currentTile.y + 0.5)
					return { x: newPosition.x, y: currentTile.y + 0.5, z: newPosition.z };
				
				if (currentPosition.z + 1 < currentTile.z - 1)
					return { x: newPosition.x, y: newPosition.y, z: currentTile.z - 1 };
				else if (currentPosition.z - 0 > currentTile.z + 0)
					return { x: newPosition.x, y: newPosition.y, z: currentTile.z + 0 };
					*/
				
				let keepX = false;
				let keepY = false;
				let keepZ = false;
				
				if (currentPosition.x + 0.25 < currentTile.x - 0.5 || currentPosition.x - 0.25 > currentTile.x + 0.5)
					keepX = true;
				
				if (currentPosition.y + 0.25 < currentTile.y - 0.5 || currentPosition.y - 0.25 > currentTile.y + 0.5)
					keepY = true;
				
				if (currentPosition.z + 1 < currentTile.z - 0.5 || currentPosition.z - 0 > currentTile.z + 0.5)
					keepZ = true;
					
				return { x: keepX ? currentPosition.x : newPosition.x, y: keepY ? currentPosition.y : newPosition.y, z: keepZ ? currentPosition.z : newPosition.z };
			}
		}
		
		return newPosition;
	}
	
	hasStoppedFalling(currentPosition, movementVector)
	{
		let newPosition = { x: currentPosition.x + movementVector.x, y: currentPosition.y + movementVector.y, z: currentPosition.z + movementVector.z };
		
		for (let i = 0; i < this.tilemapContainer.length; i++)
		{
			let currentTile = this.tilemapContainer[i];
			if (newPosition.x + 0.25 > currentTile.x - 0.5 && newPosition.x - 0.25 < currentTile.x + 0.5
				&& newPosition.y + 0.25 > currentTile.y - 0.5 && newPosition.y - 0.25 < currentTile.y + 0.5
				&& newPosition.z + 1 > currentTile.z - 0.5 && newPosition.z - 0 < currentTile.z + 0.5)
			{
				// collision detected, find the unaligned axis and put character in correct position
					
				if (currentPosition.z - 0 >= currentTile.z + 0)
				{
					// was falling airborne
					return true;
				}
			}
		}
		
		return false;
	}
	
	raycastMap(startingPoint, direction, step, maximumDistance)
	{
		let magnitudeDirection = Math.sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);
		let unitDirection = { x: direction.x / magnitudeDirection, y: direction.y / magnitudeDirection, z: direction.z / magnitudeDirection };
		
		for (let j = 0; j < maximumDistance; j += step)
		{
			let currentRaycastPosition = { x: startingPoint.x + unitDirection.x * j, y: startingPoint.y + unitDirection.y * j, z: startingPoint.z + unitDirection.z * j };
			
			for (let i = 0; i < this.tilemapContainer.length; i++)
			{
				let currentTile = this.tilemapContainer[i];
				if (currentRaycastPosition.x > currentTile.x - 0.5 && currentRaycastPosition.x < currentTile.x + 0.5
					&& currentRaycastPosition.y > currentTile.y - 0.5 && currentRaycastPosition.y < currentTile.y + 0.5
					&& currentRaycastPosition.z > currentTile.z - 0.5 && currentRaycastPosition.z < currentTile.z + 0.5)
				{
					// collision detected
					
					return { x: currentRaycastPosition.x, y: currentRaycastPosition.y, z: currentTile.z + 0.5 };
				}
			}
		}
		
		return false;
	}
	
	update()
	{
		for (let i = 0; i < this.tilemapContainer.length; i++)
		{
			let currentTile = this.tilemapContainer[i];
			
			let playerPosition = this.player.getComponentOfType(Walkable).getPosition();
			let relativeX = currentTile.x - playerPosition[0];
			let relativeY = currentTile.y - playerPosition[1];
			let relativeZ = currentTile.z - playerPosition[2];
			
			let screenPosition = globalThis.camera.getComponentOfType(FollowCamera).worldToScreen(relativeX, relativeY, relativeZ);
			
			currentTile.tile.position.set(screenPosition[0], screenPosition[1]);
			currentTile.tile.zIndex = globalThis.camera.getComponentOfType(FollowCamera).getZIndex(currentTile.x, currentTile.y, currentTile.z - 0.5);
		}
	}
}