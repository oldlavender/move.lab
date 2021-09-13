class Screen {
    constructor(opts={}) {
        this.options = opts;
        this._timer = 0;
        this.started = false;
        this.ended = false;
        var _canvas = document.getElementById('canvas');
        this.options.canvas = _canvas;
    }

    queueAnimationFrame() {
        window.requestAnimationFrame((t) => this.updateTimer(t));
    }

    updateTimer(newTime=0) {
        this.timer = newTime;
    }

    doEvent(evt) {
        for (let plg of this.options.plugins) {
            plg.handle(this, evt);
        }
    }

    prepare() {
        this.doEvent('prepare');
    }

    run() {
        this.doEvent('run');
        this.doEvent('render');
    }

    show() {
        this.doEvent('show');
    }

    reset() {
        this.timer = 0;
    }

    end() {
        this.doEvent('end');
        this.ended = true;
    }

    get timer() {
        return this._timer;
    }

    set timer(t) {
        this._timer = t;
        if (t >= this.options.timeout) {
            this.end();
        }
    }
}

export const lab = {
    canvas: {
        Screen: Screen,
    },
};