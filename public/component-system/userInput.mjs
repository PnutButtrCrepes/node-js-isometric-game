import { Component } from "./component.mjs";
import { Walkable } from "./walkable.mjs";
import { FollowCamera } from "./follow_camera.mjs";

export class UserInput extends Component
{
	entity;
	
	constructor(entity)
	{
		super();
		
		this.entity = entity;
		
		//const _onPointerMove = this.onPointerMove.bind( this );
		//const _onPointerDown = this.onPointerDown.bind( this );
		//const _onPointerUp = this.onPointerUp.bind( this );
		const _onKeyDown = this.onKeyDown.bind( this );
		const _onKeyUp = this.onKeyUp.bind( this );

		//this.domElement.addEventListener( 'contextmenu', contextmenu );
		//this.domElement.addEventListener( 'pointerdown', _onPointerDown );
		//this.domElement.addEventListener( 'pointermove', _onPointerMove );
		//this.domElement.addEventListener( 'pointerup', _onPointerUp );

		window.addEventListener( 'keydown', _onKeyDown );
		window.addEventListener( 'keyup', _onKeyUp );
	}
	
	init() {}
	
	update(delta) {}
	
	onKeyDown(event)
	{
		console.log(event.code);
		switch (event.code)
		{
			case 'ArrowUp':
			case 'KeyW': this.entity.getComponentOfType(Walkable).movingUp = true; break;
	
			case 'ArrowDown':
			case 'KeyS': this.entity.getComponentOfType(Walkable).movingDown = true; break;
	
			case 'ArrowLeft':
			case 'KeyA': this.entity.getComponentOfType(Walkable).movingLeft = true; break;
	
			case 'ArrowRight':
			case 'KeyD': this.entity.getComponentOfType(Walkable).movingRight = true; break;
			
			case 'KeyQ': globalThis.camera.getComponentOfType(FollowCamera).rotateLeft(); break;
			
			case 'KeyE': globalThis.camera.getComponentOfType(FollowCamera).rotateRight(); break;
			
			case 'Space': this.entity.getComponentOfType(Walkable).isJumpPressed = true; break;
		}
	}
	
	onKeyUp(event)
	{
		switch (event.code)
		{
			case 'ArrowUp':
			case 'KeyW': this.entity.getComponentOfType(Walkable).movingUp = false; break;
	
			case 'ArrowDown':
			case 'KeyS': this.entity.getComponentOfType(Walkable).movingDown = false; break;
	
			case 'ArrowLeft':
			case 'KeyA': this.entity.getComponentOfType(Walkable).movingLeft = false; break;
	
			case 'ArrowRight':
			case 'KeyD': this.entity.getComponentOfType(Walkable).movingRight = false; break;
			
			case 'Space': this.entity.getComponentOfType(Walkable).isJumpPressed = false; break;
		}
	}
}