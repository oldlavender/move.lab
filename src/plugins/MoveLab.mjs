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

import { BaseAnimationPlugin } from "./BaseAnimationPlugin.mjs";
import { BaseAnimationUpdater } from "../updaters/BaseAnimationUpdater.mjs";
import { LinearAnimationUpdater, LinearAnimationAltCon } from "../updaters/LinearAnimationUpdater.mjs";
import { ParabolicAnimationUpdater, ParabolicAnimationAltCon } from "../updaters/ParabolicAnimationUpdater.mjs";



 const move = {
    lab: {
        plugins: {
            BaseAnimationPlugin: BaseAnimationPlugin,
        },
        updaters: {
            BaseAnimationUpdater: BaseAnimationUpdater,
            LinearAnimationUpdater: LinearAnimationUpdater,
            ParabolicAnimationUpdater: ParabolicAnimationUpdater
        },
        animationTypes: {
            Line: LinearAnimationUpdater,
            Continuous: LinearAnimationUpdater,
            Linear: LinearAnimationUpdater,
            Parabolic: ParabolicAnimationUpdater,
            Boomerang: ParabolicAnimationUpdater,
            Arc: ParabolicAnimationUpdater,
        },
        starters: {
            Line: LinearAnimationAltCon,
            Continuous: LinearAnimationAltCon,
            Linear: LinearAnimationAltCon,
            Parabolic: ParabolicAnimationAltCon,
            Boomerang: ParabolicAnimationAltCon,
            Arc: ParabolicAnimationAltCon,
        },
    }
};

export class MoveLab extends BaseAnimationPlugin {
    constructor(options={}) {
        super(options);
    }

    /**
     * 
     * @param {*} context 
     * 
     * 
     * UPDATERS:            content: [
     *                          {
     *                              id: 'obj0',
     *                              ...
     *                              left: -300,
     *                              updaters: {
     *                                  left: {
     *                                      id: 'straight-line-1500ms',
     *                                      type: Linear,
     *                                      duration: 1500,
     *                                      start: -300,
     *                                      end: 300,
     *                                  },
     *                              },
     *                          },
     *                      ]
     */
    retrieveUpdaters(context) {
        var contents = context.options.content;
        for (let i of contents) { //for every item in the contents...
            if (!(i instanceof Object)) continue;
            if (i.updaters === undefined) {
                continue; //no updater for this content, move on
            }
            
            let id = i.id; //attempt to retrieve the id of the object
            if (id === undefined) {
                // if id is missing, assign one
                id = `__upd_${i}_id__`;
                i.id = id;
            }
            this.updaters[id] = {};

            //this.updaters
            for (let j in i.updaters) { //for every updater...
                let coordUpd = i.updaters[j];
                if (coordUpd.type !== undefined) {
                  // instantiate a new coordUpd.type with coordUpd as options
                  this.updaters[id][j] = move.lab.starters[coordUpd.type](
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

move.lab.plugins.MoveLab = MoveLab;
const lab = move.lab;

export { 
    move,
    lab,
    BaseAnimationUpdater, 
    LinearAnimationUpdater, 
    ParabolicAnimationUpdater,
    LinearAnimationAltCon,
    ParabolicAnimationAltCon,
    BaseAnimationPlugin,
};