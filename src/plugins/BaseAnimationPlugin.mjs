import { BaseAnimationUpdater } from "../updaters/BaseAnimationUpdater.mjs";

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
     *                      } 1
     *                      // animates object1 with 3ms duration, by linearly
     *                      increasing width from 5 to 12 and changing angle 
     *                      (rotating) linearly from 30 degrees to 90 degrees
     *          .log        bool, indicating whether to log received events
     * 
     *      BEST USAGE      Use child classes logic
     */
    constructor(options={}) {
        this.title = options.title || 'untitled';
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
   }

   onRender(context) {
       this.startUpdaters();
   }

   onShow(context) {
       this.shown = true;
       this.installUpdaterFunction();
   }

   onEnd(context) {
       this.ended = true;
   }

   startUpdaters() {
       for (let obj in this.updaters) {
           for (let coordinate in this.updaters[obj]) {
               let updater = this.updaters[obj][coordinate];
               if (!(updater instanceof BaseAnimationUpdater)) continue;
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
               break;
           }
       }
   }

   updaterFunction(timestamp, reinstall=true) {
       for (let obj in this.updaters) {
           for (let coordinate in this.updaters[obj]) {
               let curUpdater = this.updaters[obj][coordinate];
               if (!(curUpdater instanceof BaseAnimationUpdater)) {
                   continue;
               }
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

   logEvent(context, event, handled=false) {
       let status = handled ? 'handled' : 'unhandled';
       if (this.options.log == true) {
           console.log(`[${this.title}] ${event} status=${
            status
           }\n\tcontext=`, context);
       }
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
                this.onEnd(context);
                break;
            default:
                this.logEvent(context, event);
        }
    }
}
