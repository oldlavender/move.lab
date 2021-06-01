/**
 * 
 * 
 * @description     Animation plugin for lab.js
 * @author          Bruno Moreira-Guedes <moreira.guedes@estudante.uffs.edu.br>
 * @license         AGPL v3
 * 
 * Date: May 8, 2021
 * 
 * 
 */

import "/lib/lab.js";
import "/lib/lab.fallback.js";

//console.log("Initializing lab.plugins.animarion.js");

/*export class Draft {
    constructor(options){
        this.title = (options.title || "<untitled>");
        this.options = options;
    }

    handle(context, event){
        console.log(`Component ${ this.title } received ${ event }`);
        console.log("context = ", context);
        let nothing;
    }
}*/

export var move = {
    lab: {
        plugins: {},
        updaters: {},
        animationTypes: {},
        starters: {},
    }
};

/**
 * 
 * @class BaseAnimationPlugin
 * Description: Listen to events and attach update routines to a canvas.
 * PS: kept for compatibility purposes. Will be merged into MoveLab in a future 
 * 
 */
export class BaseAnimationPlugin {
    /**
     * 
     * @param {*} options   object containing plugin parameters
     * 
     *      OPTIONS
     *          .duration   sets global animation duration
     *          .options    sets other options, useful for extending purposes
     *          .updaters   [DEPRECATED] object containing object ids and their
     *                      updating properties with associated updaters.
     *                      SUBOPTIONS:
     *                      .objid  object containing the updating properties
     *                              for an object
     *                      EXAMPLE
     *                      updaters: {
     *                        object1: {
     *                         width: new LinearAnimationUpdater(3000, 5, 12),
     *                         angle: new LinearAnimationUpdater(3000, 30, 90),
     *                        }
     *                      } 
     *                      // animates object1 with 3ms duration, by linearly
     *                      increasing width from 5 to 12 and changing angle 
     *                      (rotating) linearly from 30 degrees to 90 degrees
     * 
     *      BEST USAGE      Use child classes logic
     */
    constructor(options) {
        this.updaters = options.updaters || {}; //for updaters defined in the updaters section
        this.options = options || {};
        this.duration = options.duration || 0;
        this.shown = false;
        this.prepared = false;
        this.ended = false;
    }
    
    /**
     * 
     * @summary             method called when controlled object is on preparation
     * @param {*} context   context object passed by event handler
     */
   onPrepare(context) {
       this.prepared = true;
       this.canvasScreen = context;
       this.canvas = context.options.canvas;
       this.options.defaults = context.options || {};
       this.options.defaultcontent = context.options.content || {};
       this.updaterFunction(this.canvasScreen.timer, false);
       /*console.log(
           "Animation prepared. context=",
           context,
           "\ncontent=",
           context.options.content
           );*/
   }

   onRender(context) {
       this.startUpdaters();
   }

   onShow(context) {
       this.shown = true;
       this.installUpdaterFunction();
   }

   startUpdaters() {
       for (let obj in this.updaters) {
           for (let coordinate in this.updaters[obj]) {
               let updater = this.updaters[obj][coordinate];
               updater.Start();
           }
       }
   }

   installUpdaterFunction() {
       window.requestAnimationFrame(upd => this.updaterFunction.call(this, upd));
   }

   updateCoordinate(objid, coordinate, value) {
       let contentArray = this.canvasScreen.options.content;
       for (let i in contentArray) {
           let content = contentArray[i];
           //console.log("updateCoordinate: content=",content);
           if (content.id == objid) {
               content[coordinate] = value;
               /*console.log(
                   "Updated coordinate: ",
                   objid,
                   "{ ..., ",
                   coordinate,
                   ": ",
                   value,
                   ", ... }"
                   );*/
               break;
           }
       }
   }

   updaterFunction(timestamp, reinstall=true) {
       //console.log("updaterFunction(timestamp=",timestamp,")");
       for (let obj in this.updaters) {
           for (let coordinate in this.updaters[obj]) {
               let curUpdater = this.updaters[obj][coordinate];
               if (this.shown && !this.ended) {
                curUpdater.Update();
               }
               this.updateCoordinate(obj, coordinate, curUpdater.GetCoordinates());
           }
       }
       if (this.shown && !this.ended && reinstall) {
            this.canvasScreen.queueAnimationFrame();
            this.installUpdaterFunction();
       }
   }

   log(context, event) {
       //console.log(this.title,": Unhandled Event ",event);
       //console.log("context=", context);
   }

    handle(context, event){
        
        switch(event) {
            case 'prepare':
                this.onPrepare(context);
                break;
            case 'show':
                this.onShow(context);
                break;
            case 'render':
                this.onRender(context);
                break;
            case 'end':
                this.ended = true;
                break;
            default:
                this.log(context, event);
        }
    }
}

move.lab.plugins.BaseAnimationPlugin = BaseAnimationPlugin;

/**
 * 
 * @class BaseAnimationUpdater    Base Updater class
 */
export class BaseAnimationUpdater {

    /*
     * @ Class LinearMovement 
     * Description: Calculates coordinates for a linear movement
     */
    constructor(duration, startPosition, endPosition){
        this.setParameters(duration, startPosition, endPosition);
    }

    setParameters(duration, startPosition, endPosition) {
        this.duration = duration;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        //this.endTime = this.startTime + duration;
        this.started = false;
        this.ended = false;
    }

    Start(time = Date.now()) {
        if (!this.started) {
            this.startTime = time;
            this.currentTime = time;
            //this.endTime = this.startTime + this.duration;
            this.ended = false;
        }
        this.started = true;
    }

    Stop(time = Date.now()) {
        this.currentTime = 0;
        this.startTime = 0;
    }

    Clear() {
        this.setParameters(this.duration, this.startPosition, this.endPosition);
    }

    Restart(time = Date.now()) {
        this.Stop();
        this.Clear();
        this.Start();
    }

    Update(time=Date.now()) {
        this.updateClock(time);
    }

    updateClock(time = Date.now()) {
        // The way updateClock is implemented is make sure it does not go back
        // unless it's restarted
        if (time > this.currentTime && this.started && !this.ended) {
            this.currentTime = time;
        }
        if (this.currentTime >= (this.startTime + this.duration)) {
            this.ended = true;
        }
    }

    /**
     * 
     * @param {*} time  the time for the coordinates
     * @returns the updated coordinates for the current animation time
     */
    GetCoordinates(time=this.currentTime) {
        //console.log("Getting coordinates for time=",time);
        if (this.ended) {
            return this.endPosition;
        } 
        else if (!this.started) {
            return this.startPosition;
        }
        else {
            // returns the abstract method
            return this.GetUpdatedCoordinates(time);
        }

    }

    /**
     * @abstract            Abstract method that must be implemented by inheriting classes
     * @summary             Returns the coordinates for a determined time updating clock
     * @param {*} time      The time of the animation
     */
    /*
    GetUpdatedCoordinates(time = Date.now()) {
        if (this == BaseMovementAnimation) {
            throw new TypeError("Cannot call abstract method GetUpdatedCoordinates(",time,")");
        } else if (this.GetUpdatedCoordinates == BaseMovementAnimation.GetUpdatedCoordinates) {
            throw new TypeError("Method GetUpdatedCoordinates(time) not implemented by child class");
        }
    }*/

    /**
     * @summary         Returns the coordinates for a determined time updating the clock
     * @param {*} time  Animation time, defaults to current clock time
     * @returns         The updated coordinate for the 'time' moment
     */
    GetUpdatedCoordinates(time = Date.now()) {
        if (time >= 0) {
            this.updateClock(time);
        }
        
        return this.GetMomentCoordinates(this.currentTime);
    }

    /**
     * @abstract        Abstract method that must be implemented by inheriging classes
     * @summary         Returns the coordinates for a determined time with no clock update
     * @param {*} time 
     */
    GetMomentCoordinates(time) {
        if (this == BaseMovementAnimation) {
            throw new TypeError("Cannot call abstract method GetUpdatedCoordinates(",time,")");
        } else if (this.GetUpdatedCoordinates == BaseMovementAnimation.GetUpdatedCoordinates) {
            throw new TypeError("Method GetUpdatedCoordinates(time) not implemented by child class");
        }
    }
}
move.lab.updaters.BaseAnimationUpdater = BaseAnimationUpdater;


/**
 * @class LinearAnimationUpdater   Implements linear movements or linear changes in coordinates
 */
export class LinearAnimationUpdater extends BaseAnimationUpdater {
    constructor(duration, startPosition, endPosition) {
        super(duration, startPosition, endPosition);
    }

    GetMomentCoordinates(time=this.currentTime) {
        const totalMovement = this.endPosition - this.startPosition;
        const animationTime = time - this.startTime;
        let p = animationTime / this.duration;
        /*console.log(
            "Moment coordinates: p=",p,
            "; totalMovement"
            );*/
        return (p*totalMovement)+this.startPosition;
    }

}

const LinearAnimationAltCon = (options) => new LinearAnimationUpdater(options.duration, options.start, options.end);
move.lab.updaters.LinearAnimationUpdater = LinearAnimationUpdater;
move.lab.animationTypes.Line = LinearAnimationUpdater;
move.lab.animationTypes.Continuous = LinearAnimationUpdater;
move.lab.animationTypes.Linear = LinearAnimationUpdater;
move.lab.starters.Line = LinearAnimationAltCon;
move.lab.starters.Continuous = LinearAnimationAltCon;
move.lab.starters.Linear = LinearAnimationAltCon;

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

        /*console.log(
            "Equation calculated from: midanimation=", midanimation,
            " relEnd=", relEnd,
            " relStart=", relStart,
            " startPosition=", this.startPosition,
            " endPosition=", this.endPosition
        );
        console.log("rootEquation=", rootEquation);
        console.log("vertexMultuplier=", vertexMultiplier);
        console.log("equation=", equation);*/

        this.equation = equation;
    }

    GetMomentCoordinates(time=this.currentTime) {
        const equation = this.equation;
        const relTime = time-this.startTime;
        const coord = (equation.a * (relTime**2)) + (equation.b * relTime) + equation.c;

        /*console.log(
            "ParabolicAnimationUpdater:GetMomentCoordinates(time=",
            time,
            ") coord=",
            coord
        );*/

        return coord;
    }

}

const ParabolicAnimationAltCon = (options) => new ParabolicAnimationUpdater(options.duration, options.start, options.end, options.middle);

move.lab.updaters.ParabolicAnimationUpdater = ParabolicAnimationUpdater;
move.lab.animationTypes.Parabolic = ParabolicAnimationUpdater;
move.lab.animationTypes.Boomerang = ParabolicAnimationUpdater;
move.lab.animationTypes.Arc = ParabolicAnimationUpdater;
move.lab.starters.Parabolic = ParabolicAnimationAltCon;
move.lab.starters.Boomerang = ParabolicAnimationAltCon;
move.lab.starters.Arc = ParabolicAnimationAltCon;


export class MoveLab extends BaseAnimationPlugin {
    constructor() {
        super({});
    }

    /**
     * 
     * @param {*} context 
     * 
     * 
     * UPDATERS:
     *      Example:        content: [
     *                          {
     *                              id: 'obj0',
     *                              left: -200,
     *                              top: 0,
     *                              angle: 0,
     *                              updaters: {
     *                                  angle: {
     *                                      type: Linear,
     *                                      duration: 1000,
     *                                      start: 0,
     *                                      end: 630,
     *                                  },
     *                                  left: {
     *                                      type: Linear,
     *                                      duration: 1000,
     *                                      start: -200,
     *                                      end: 200,
     *                                  },
     *                                  top: {
     *                                      type: Sequence, //to-be-implemented
     *                                      duration: 1000,
     *                                      items: [
     *                                          {
     *                                              type: Boomerang,
     *                                              duration: 250,
     *                                              start: 0,
     *                                              end: 0,
     *                                              middle: 50,
     *                                          },
     *                                          {
     *      *                                       type: Boomerang,
     *                                              duration: 250,
     *                                              start: 0,
     *                                              end: 0,
     *                                              middle: -50,
     *                                          },
     *                                          {
     *                                              type: Boomerang,
     *                                              duration: 250,
     *                                              start: 0,
     *                                              end: 0,
     *                                              middle: 50,
     *                                          },
     *                                          {
     *      *                                       type: Boomerang,
     *                                              duration: 250,
     *                                              start: 0,
     *                                              end: 0,
     *                                              middle: -50,
     *                                          },
     *                                      ],
     *                                  },
     *                              },
     *                          },
     *                      ]
     */
    retrieveUpdaters(context) {
        var contents = context.options.content;
        for (let i in contents) { //for every item in the contents...
            if (contents[i].updaters === undefined) {
                continue; //no updater for this content, move on
            }
            
            let id = contents[i].id; //attempt to retrieve the id of the object
            if (id === undefined) {
                // if id is missing, assign one
                id = `__upd_${i}_id__`;
                contents[i].id = id;
            }
            this.updaters[id] = {};

            //this.updaters
            for (let j in contents[i].updaters) { //for every updater...
                let coordUpd = contents[i].updaters[j];
                if (coordUpd.type !== undefined) {
                  // instantiate a new coordUpd.type with coordUpd as options
                  this.updaters[id][j] = new move.lab.starters[coordUpd.type](
                                                coordUpd);
                }
            }
        }
    }

    onPrepare(context) {
        this.retrieveUpdaters(context);
        super.onPrepare(context);
    }
}

/*const lab = {};

export const lab.animation = {
    Draft: Draft,
    AnimationModifier: AnimationModifier,
};*/

/*
export const move = {
    lab: {
        plugins: {
            BaseAnimationPlugin: BaseAnimationPlugin,
            MoveLab: MoveLab,
        },
        updaters: {
            BaseAnimationUpdater: BaseAnimationUpdater,
            LinearAnimationUpdater: LinearAnimationUpdater,
            ParabolicAnimationUpdater: ParabolicAnimationUpdater,
        },
        animationtypes: { //aliases for the updater names
            Line: LinearAnimationUpdater,
            Continuous: LinearAnimationUpdater,
            Linear: LinearAnimationUpdater,
            Parabolic: ParabolicAnimationUpdater,
            Arc: ParabolicAnimationUpdater,
        }
    }
};*/

//lab.plugins = plugins;