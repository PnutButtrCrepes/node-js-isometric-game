import * as PIXI from '../pixi.min.mjs';
import { Component } from "./component.mjs";
import { FollowCamera } from './follow_camera.mjs';

export class Walkable extends Component
{
	x;
	y;
	z;
	dz;
	
	level;
	
	previousUp;
	previousDown;
	previousLeft;
	previousRight;
	
	movingUp;
	movingDown;
	movingLeft;
	movingRight;
	
	isJumpPressed;
	state; // 0 = standing, 1 = airborne
	
	animationUp;
	animationDown;
	animationLeft;
	animationRight;
	shadow;
	
	constructor(spritesheetPath, upFrames, downFrames, leftFrames, rightFrames)
	{
		super();
		
		this.x = 1;
		this.y = -1;
		this.z = 1;
		this.dz = 0;
		
		this.previousUp = false;
		this.previousDown = false;
		this.previousLeft = false;
		this.previousRight = false;
		
		this.movingUp = false;
		this.movingDown = false;
		this.movingLeft = false;
		this.movingRight = false;
		
		this.isJumpPressed = false;
		this.state = 0;
		
		this.loadAnimations(spritesheetPath, downFrames, upFrames, leftFrames, rightFrames);
	}
	
	async loadAnimations(spritesheetPath, upFrames, downFrames, leftFrames, rightFrames)
	{
		const sheet = await PIXI.Assets.load(spritesheetPath);
		sheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
		let textures = Object.values(sheet.textures);
		
		this.animationDown = new PIXI.AnimatedSprite(textures.slice(0, downFrames));
		this.animationUp = new PIXI.AnimatedSprite(textures.slice(downFrames, downFrames + upFrames));
		this.animationLeft = new PIXI.AnimatedSprite(textures.slice(downFrames + upFrames, downFrames + upFrames + leftFrames));
		this.animationRight = new PIXI.AnimatedSprite(textures.slice(downFrames + upFrames + leftFrames, downFrames + upFrames + leftFrames + rightFrames));
		
		this.animationUp.animationSpeed = 0.1;
		this.animationDown.animationSpeed = 0.1;
		this.animationLeft.animationSpeed = 0.1;
		this.animationRight.animationSpeed = 0.1;
		
		this.animationUp._anchor.set(0.5, 1);
		this.animationDown._anchor.set(0.5, 1);
		this.animationLeft._anchor.set(0.5, 1);
		this.animationRight._anchor.set(0.5, 1);
		
		this.animationUp.scale.set(2, 2);
		this.animationDown.scale.set(2, 2);
		this.animationLeft.scale.set(2, 2);
		this.animationRight.scale.set(2, 2);
		
		let shadowTexture = PIXI.Texture.from("./shadow.png");
		this.shadow = new PIXI.Sprite(shadowTexture);
		this.shadow._anchor.set(0.5, 0.8);
		
		globalThis.app.stage.addChild(this.animationUp);
		globalThis.app.stage.addChild(this.animationDown);
		globalThis.app.stage.addChild(this.animationLeft);
		globalThis.app.stage.addChild(this.animationRight);
		globalThis.app.stage.addChild(this.shadow);
	}
	
	update(delta)
	{
		// cancel out movement
		if (this.movingUp && this.movingDown)
		{
			this.movingUp = false;
			this.movingDown = false;
		}
		
		if (this.movingLeft && this.movingRight)
		{
			this.movingLeft = false;
			this.movingRight = false;
		}
		
		// handle the animations
		if (!this.movingUp && !this.movingDown && !this.movingLeft && !this.movingRight && !this.isJumpPressed && this.state == 0)
		{
			if (this.animationUp != undefined)
			{
				this.animationUp.stop();
				this.animationDown.stop();
				this.animationLeft.stop();
				this.animationRight.stop();
			
				this.animationUp.currentFrame = 0;
				this.animationDown.currentFrame = 0;
				this.animationLeft.currentFrame = 0;
				this.animationRight.currentFrame = 0;
			}
			
			//return;
		}
		
		if (this.movingUp)
		{
			if (!this.previousLeft && !this.previousRight)
			{
				this.animationUp.visible = true;
				this.animationDown.visible = false;
				this.animationLeft.visible = false;
				this.animationRight.visible = false;
				
				this.animationUp.play();
			}
		}
		
		if (this.movingDown)
		{
			if (!this.previousLeft && !this.previousRight)
			{
				this.animationUp.visible = false;
				this.animationDown.visible = true;
				this.animationLeft.visible = false;
				this.animationRight.visible = false;
				
				this.animationDown.play();
			}
		}
		
		if (this.movingLeft)
		{
			if (!this.previousUp && !this.previousDown)
			{
				this.animationUp.visible = false;
				this.animationDown.visible = false;
				this.animationLeft.visible = true;
				this.animationRight.visible = false;
				
				this.animationLeft.play();
			}
		}
		
		if (this.movingRight)
		{
			if (!this.previousUp && !this.previousDown)
			{
				this.animationUp.visible = false;
				this.animationDown.visible = false;
				this.animationLeft.visible = false;
				this.animationRight.visible = true;
				
				this.animationRight.play();
			}
		}
		
		let movement = { x: 0, y: 0, z: 0 };
		
		// handle actual movement
		switch (globalThis.camera.getComponentOfType(FollowCamera).currentView)
		{
			case globalThis.camera.getComponentOfType(FollowCamera).NORMAL_VIEW:
				if (this.movingUp && this.movingRight)
					movement.y = 0.05;
				else if (this.movingDown && this.movingRight)
					movement.x = 0.05;
				else if (this.movingDown && this.movingLeft)
					movement.y = -0.05;
				else if (this.movingUp && this.movingLeft)
					movement.x = -0.05;
				else
				{
					if (this.movingUp)
					{
						movement.x = -0.05 * 0.707;
						movement.y = 0.05 * 0.707;
					}
						
					if (this.movingDown)
					{
						movement.x = 0.05 * 0.707;
						movement.y = -0.05 * 0.707;
					}
						
					if (this.movingLeft)
					{
						movement.x = -0.05 * 0.707;
						movement.y = -0.05 * 0.707;
					}
						
					if (this.movingRight)
					{
						movement.x = 0.05 * 0.707;
						movement.y = 0.05 * 0.707;
					}
				}
			break;
			
			case globalThis.camera.getComponentOfType(FollowCamera).LEFT_VIEW:
				if (this.movingUp && this.movingRight)
					movement.x = 0.05;
				else if (this.movingDown && this.movingRight)
					movement.y = -0.05;
				else if (this.movingDown && this.movingLeft)
					movement.x = -0.05;
				else if (this.movingUp && this.movingLeft)
					movement.y = 0.05;
				else
				{
					if (this.movingUp)
					{
						movement.x = 0.05 * 0.707;
						movement.y = 0.05 * 0.707;
					}
						
					if (this.movingDown)
					{
						movement.x = -0.05 * 0.707;
						movement.y = -0.05 * 0.707;
					}
						
					if (this.movingLeft)
					{
						movement.x = -0.05 * 0.707;
						movement.y = 0.05 * 0.707;
					}
						
					if (this.movingRight)
					{
						movement.x = 0.05 * 0.707;
						movement.y = -0.05 * 0.707;
					}
				}
			break;
			
			case globalThis.camera.getComponentOfType(FollowCamera).RIGHT_VIEW:
				if (this.movingUp && this.movingRight)
					movement.x = -0.05;
				else if (this.movingDown && this.movingRight)
					movement.y = 0.05;
				else if (this.movingDown && this.movingLeft)
					movement.x = 0.05;
				else if (this.movingUp && this.movingLeft)
					movement.y = -0.05;
				else
				{
					if (this.movingUp)
					{
						movement.x = -0.05 * 0.707;
						movement.y = -0.05 * 0.707;
					}
						
					if (this.movingDown)
					{
						movement.x = 0.05 * 0.707;
						movement.y = 0.05 * 0.707;
					}
						
					if (this.movingLeft)
					{
						movement.x = 0.05 * 0.707;
						movement.y = -0.05 * 0.707;
					}
						
					if (this.movingRight)
					{
						movement.x = -0.05 * 0.707;
						movement.y = 0.05 * 0.707;
					}
				}
			break;
			
			case globalThis.camera.getComponentOfType(FollowCamera).BACKWARDS_VIEW:
				if (this.movingUp && this.movingRight)
					movement.y = -0.05;
				else if (this.movingDown && this.movingRight)
					movement.x = -0.05;
				else if (this.movingDown && this.movingLeft)
					movement.y = 0.05;
				else if (this.movingUp && this.movingLeft)
					movement.x = 0.05;
				else
				{
					if (this.movingUp)
					{
						movement.x = 0.05 * 0.707;
						movement.y = -0.05 * 0.707;
					}
						
					if (this.movingDown)
					{
						movement.x = -0.05 * 0.707;
						movement.y = 0.05 * 0.707;
					}
						
					if (this.movingLeft)
					{
						movement.x = 0.05 * 0.707;
						movement.y = 0.05 * 0.707;
					}
						
					if (this.movingRight)
					{
						movement.x = -0.05 * 0.707;
						movement.y = -0.05 * 0.707;
					}
				}
			break;
		}
		
		if (this.state == 0 && this.isJumpPressed)
		{
			this.state = 1;
			this.dz = 0.11;
		}
		
		if (this.state == 1)
		{
			this.dz -= 0.005;
			movement.z = this.dz;
		}
		
		let newPosition = this.level.checkCollision({ x: this.x, y: this.y, z: this.z }, movement);
		this.x = newPosition.x;
		this.y = newPosition.y;
		this.z = newPosition.z;
		
		if (this.state === 1)
		{
			if (this.level.hasStoppedFalling({ x: this.x, y: this.y, z: this.z }, movement))
			{
				this.state = 0;
				this.dz = -0.1;
			}
		}
		else if (this.state === 0)
		{
			if (!this.level.hasStoppedFalling({ x: this.x, y: this.y, z: this.z }, { x: movement.x, y: movement.y, z: -0.1 }))
				this.state = 1;
		}
		
		let shadowWorldPosition = this.level.raycastMap({ x: this.x, y: this.y, z: this.z }, { x: 0, y: 0, z: -1 }, 0.9, 5);
		if (shadowWorldPosition !== false)
		{
			let shadowScreenPosition = globalThis.camera.getComponentOfType(FollowCamera).worldToScreen(shadowWorldPosition.x - this.x, shadowWorldPosition.y - this.y, shadowWorldPosition.z - this.z);
			this.shadow.position.set(shadowScreenPosition[0], shadowScreenPosition[1]);
			this.shadow.zIndex = globalThis.camera.getComponentOfType(FollowCamera).getZIndex(shadowWorldPosition.x, shadowWorldPosition.y, shadowWorldPosition.z);
		}
		else
		{
			let shadowScreenPosition = globalThis.camera.getComponentOfType(FollowCamera).worldToScreen(0, 0, -10);
			
			if (this.shadow != undefined)
				this.shadow.position.set(shadowScreenPosition[0], shadowScreenPosition[1]);
		}
		
		//console.log({ x: this.x, y: this.y, z: this.z });
		
		this.previousUp = this.movingUp;
		this.previousDown = this.movingDown;
		this.previousLeft = this.movingLeft;
		this.previousRight = this.movingRight;
		
		let screenPosition = globalThis.camera.getComponentOfType(FollowCamera).worldToScreen(this.x - this.x, this.y - this.y, this.z - this.z);
		
		if (this.animationUp != undefined)
		{
			this.animationUp.position.set(screenPosition[0], screenPosition[1]);
			this.animationDown.position.set(screenPosition[0], screenPosition[1]);
			this.animationLeft.position.set(screenPosition[0], screenPosition[1]);
			this.animationRight.position.set(screenPosition[0], screenPosition[1]);
			
			this.animationUp.zIndex = globalThis.camera.getComponentOfType(FollowCamera).getZIndex(this.x, this.y, this.z);
			this.animationDown.zIndex = globalThis.camera.getComponentOfType(FollowCamera).getZIndex(this.x, this.y, this.z);
			this.animationLeft.zIndex = globalThis.camera.getComponentOfType(FollowCamera).getZIndex(this.x, this.y, this.z);
			this.animationRight.zIndex = globalThis.camera.getComponentOfType(FollowCamera).getZIndex(this.x, this.y, this.z);
		}
	}
	
	setCollisionTilemap(level)
	{
		this.level = level;
	}
	
	getPosition()
	{
		return [this.x, this.y, this.z];
	}
}