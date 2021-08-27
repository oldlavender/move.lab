import { BaseAnimationUpdater } from "./BaseAnimationUpdater.mjs";

export class ParabolicAnimationUpdater extends BaseAnimationUpdater {

    /**
     * 
     * @param {*} duration 
     * @param {*} startPosition 
     * @param {*} endPosition 
     * @param {*} middlePosition The vertex of the parabolic curve, arc height
     */
    constructor(duration, startPosition, endPosition, middlePosition) {
        super(duration, startPosition, endPosition);
        this.setSpecificParameters(middlePosition);
    }

    setSpecificParameters(middlePosition) {
        //super.setParameters(duration, startPosition, endPosition);
        this.middlePosition = middlePosition;
    }

    Start(time=Date.now()) {
        super.Start(time);
        this.calculateEquationFormula();
    }

    /**
     * 
     * @method      calculateEquationFormula()
     * @summary     Calculates& stores the quadratic formula for the parameters
     * @returns     void
     */
    calculateEquationFormula() {
        if (!this.started || this.ended) {
            return;
        }

        const relStart = 0;
        const relEnd = relStart + this.duration;
        const midanimation = relStart + (this.duration / 2.0);
        const rootEquation = {
            a: 1,
            b: (-relEnd-relStart),
            c: (-this.startPosition * -this.endPosition),
            ax: 1*(midanimation**2),
            bx: ((-relEnd-relStart)*midanimation),
        }; 
        const vertexMultiplier = this.middlePosition / (
            rootEquation.ax +
            rootEquation.bx +
            rootEquation.c
        );
        const equation = {
            a: rootEquation.a * vertexMultiplier,
            b: rootEquation.b * vertexMultiplier,
            c: rootEquation.c * vertexMultiplier,
        };

        this.equation = equation;
    }

    GetMomentCoordinates(time=this.currentTime) {
        const equation = this.equation;
        const relTime = time-this.startTime;
        const coord = (equation.a * (relTime**2)) + (equation.b * relTime) + equation.c;

        return coord;
    }

}

export const ParabolicAnimationAltCon = (options) => new ParabolicAnimationUpdater(options.duration, options.start, options.end, options.middle);