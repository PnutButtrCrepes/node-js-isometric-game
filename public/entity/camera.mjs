import { FollowCamera } from "../component-system/follow_camera.mjs";
import { Entity } from "./entity.mjs";

export class Camera extends Entity
{
	constructor()
	{
		super();
		this.addComponent(new FollowCamera());
	}
}