import { BaseAnimationUpdater } from "./BaseAnimationUpdater.mjs";

/**
 * @class LinearAnimationUpdater   Implements linear movements or linear changes in coordinates
 * 
 */
 export class LinearAnimationUpdater extends BaseAnimationUpdater {
    constructor(duration, startPosition, endPosition) {
        super(duration, startPosition, endPosition);
    }

    GetMomentCoordinates(time=this.currentTime) {
        const totalMovement = this.endPosition - this.startPosition;
        const animationTime = time - this.startTime;
        let p = animationTime / this.duration;

        return (p*totalMovement)+this.startPosition;
    }

}

export const LinearAnimationAltCon = (options) => new LinearAnimationUpdater(options.duration, options.start, options.end);