/**
 * 
 * @class BaseAnimationUpdater    Base Updater class
 */
export class BaseAnimationUpdater {

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
        this.ended = true;
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
            this.currentTime = this.startTime + this.duration;
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
     * @-abstract            Abstract method that must be implemented by inheriting classes
     * @-summary             Returns the coordinates for a determined time updating clock
     * @-param {*} time      The time of the animation
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
        /*console.log("constructor=",
        this.constructor,
        " class=",
        BaseAnimationUpdater);*/
        if (this.constructor == BaseAnimationUpdater) {
            throw new TypeError(`Cannot call abstract method GetUpdatedCoordinates(${time})`);
        } else if (this.GetMomentCoordinates == BaseAnimationUpdater.GetMomentCoordinates) {
            throw new TypeError("Method GetMomentCoordinates(time) not implemented by child class");
        }
    }
}