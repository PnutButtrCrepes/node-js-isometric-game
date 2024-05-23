import { Component } from "./component.mjs";

export class FollowCamera extends Component
{
	NORMAL_VIEW = 0;
	LEFT_VIEW = 1;
	RIGHT_VIEW = 2;
	BACKWARDS_VIEW = 3;
	
	currentView = this.NORMAL_VIEW;
	
	update(delta)
	{
		
	}
	
	worldToScreen(x, y, z)
	{
		let scalingFactor = Math.floor(32 / 4); // size of the tiles (16 * scale) divided by 4
		
		let screenX = 0;
		let screenY = 0;
		
		switch (this.currentView)
		{
			case this.NORMAL_VIEW:
				screenX = Math.floor(window.innerWidth / 2) + x * scalingFactor * 2 + y * scalingFactor * 2;
				screenY = Math.floor(window.innerHeight / 2) + x * scalingFactor - y * scalingFactor - z * scalingFactor * 2;
			break;
			
			case this.LEFT_VIEW:
				screenX = Math.floor(window.innerWidth / 2) + x * scalingFactor * 2 - y * scalingFactor * 2;
				screenY = Math.floor(window.innerHeight / 2) - x * scalingFactor - y * scalingFactor - z * scalingFactor * 2;
			break;
			
			case this.RIGHT_VIEW:
				screenX = Math.floor(window.innerWidth / 2) - x * scalingFactor * 2 + y * scalingFactor * 2;
				screenY = Math.floor(window.innerHeight / 2) + x * scalingFactor + y * scalingFactor - z * scalingFactor * 2;
			break;
			
			case this.BACKWARDS_VIEW:
				screenX = Math.floor(window.innerWidth / 2) - x * scalingFactor * 2 - y * scalingFactor * 2;
				screenY = Math.floor(window.innerHeight / 2) - x * scalingFactor + y * scalingFactor - z * scalingFactor * 2;
			break;
		}
		
		return [screenX, screenY];
	}
	
	getZIndex(x, y, z)
	{
		let zIndex = 0;
		
		switch (this.currentView)
		{
			case this.NORMAL_VIEW:
				zIndex = x - y + z;
			break;
			
			case this.LEFT_VIEW:
				zIndex = -x - y + z;
			break;
			
			case this.RIGHT_VIEW:
				zIndex = x + y + z;
			break;
			
			case this.BACKWARDS_VIEW:
				zIndex = -x + y + z;
			break;
		}
		
		return zIndex;
	}
	
	rotateLeft()
	{
		switch(this.currentView)
		{
			case this.NORMAL_VIEW:
				this.currentView = this.LEFT_VIEW;
			break;
			
			case this.LEFT_VIEW:
				this.currentView = this.BACKWARDS_VIEW;
			break;
			
			case this.RIGHT_VIEW:
				this.currentView = this.NORMAL_VIEW;
			break;
			
			case this.BACKWARDS_VIEW:
				this.currentView = this.RIGHT_VIEW;
			break;
		}
	}
	
	rotateRight()
	{
		switch(this.currentView)
		{
			case this.NORMAL_VIEW:
				this.currentView = this.RIGHT_VIEW;
			break;
			
			case this.LEFT_VIEW:
				this.currentView = this.NORMAL_VIEW;
			break;
			
			case this.RIGHT_VIEW:
				this.currentView = this.BACKWARDS_VIEW;
			break;
			
			case this.BACKWARDS_VIEW:
				this.currentView = this.LEFT_VIEW;
			break;
		}
	}
}