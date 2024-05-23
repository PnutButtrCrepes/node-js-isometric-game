import { Component } from "./component.mjs";

export class Health extends Component
{
	STATUS_POISONED = 0;
	
	maxHealth;
	health;
	statuses;
	isAlive;
	
	constructor(maxHealth)
	{
		this.maxHealth = maxHealth;
		this.health = maxHealth;
		statuses = [];
		isAlive = true;
	}
	
	update(delta)
	{
		for (i = 0; i < statuses.length; i++)
		{
			switch (statuses[i])
			{
				case this.STATUS_POISONED:
					this.health -= 1 * delta;
				break;
			}
		}
		
		if (this.health <= 0)
			this.isAlive = false;
	}
	
	healOrDamage(healthOrDamage)
	{
		this.health += healthOrDamage;
		
		if (this.health > this.maxHealth)
			this.health = this.maxHealth;
			
		if (this.health <= 0)
			this.isAlive = false;
		else
			this.isAlive = true;
	}
}