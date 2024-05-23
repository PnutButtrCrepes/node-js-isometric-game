export class Entity
{
	components;
	
	constructor(stage)
	{
		this.components = [];
	}
	
	addComponent(component)
	{
		this.components.push(component);
	}
	
	hasComponentOfType(type)
	{
		if (this.components.filter((component) => component instanceof type).length > 0)
			return true;
		else
			return false;
	}
	
	getComponentOfType(type)
	{
		return this.components.filter((component) => component instanceof type)[0];
	}
}