import { describe, expect, test, it, jest } from "@jest/globals";
import { BaseAnimationPlugin } from "../../src/plugins/BaseAnimationPlugin.mjs";
import { LinearAnimationUpdater } from "../../src/updaters/LinearAnimationUpdater.mjs";
import { lab } from "../../__mocks__/lab";

const ft = 1000 / 60;
var timer = 0-ft;
var rAFcalls = -1;
// negative values account for the starter call
jest.useFakeTimers();


Object.defineProperty(
    window, 
    "requestAnimationFrame", 
    {
        writable: true,
        value: (cbFunc)=>{
            if ( (rAFcalls > 0 && rAFcalls % 2 == 0)|| rAFcalls < 0) {
                timer += ft;
            }
            rAFcalls++;
            var bap = screens[0].options.plugins[0];
            var ctts = bap.canvasScreen.options.content[0];
            if (timer.toFixed(4) == (ft*31).toFixed(4)) {
                // tests if it's in the middle
                expect(ctts.left).toBe(
                    ((timer-ft)/1000)*100
                ); //calculated to correct the 50.00000000000002
                if (/.*this.updateTimer.*/.test(cbFunc.toString())) {
                    //@TODO: Implement specific tests here
                }
                if(/.*this.queueAnimationFrame.*/.test(cbFunc.toString())) {
                    //@TODO: Implement specific tests here
                }
            }

            cbFunc(timer);
        },
    }
);
var reqAFSpy = jest.spyOn(window, 'requestAnimationFrame');

var empty = new BaseAnimationPlugin();
var screens = [
    new lab.canvas.Screen({
        title: 'canvas:1',
        content: [
            {
                id: 'object1',
                type: "i-text",
                left: -200,
                top: -200,
                fontSize: 22,
                text: "Hello, fucking world!",
                fill: '#000000',
            }
        ],
        timeout: 5000,
        plugins: [
            new BaseAnimationPlugin({
                title: 'test@canvas:1',
                updaters: {
                    object1: {
                        left: new LinearAnimationUpdater(1000, 0, 100),
                    },
                },
            }),
        ],
    }),
];

var apOptions = [
    {
        title: 'test@main:1',
        duration: 1000,
        updaters: {
            object1: {
                left: new LinearAnimationUpdater(1000, 0, 100),
            },
        },
    },
];
var BAPs = [];
for (let i of apOptions) {
    BAPs.push(new BaseAnimationPlugin(i));
}

describe(
    "BaseAnimationPlugin",
    ()=>{
        test(
            "Constructor properly setting parameters",
            ()=>{
                //default values if empty
                expect(empty.title).toBe('untitled');
                expect(empty.updaters).toMatchObject({});
                expect(empty.options).toMatchObject({});
                expect(empty.duration).toBe(0);
                expect(empty.shown).toBe(false);
                expect(empty.prepared).toBe(false);
                expect(empty.ended).toBe(false);
                for (let i in BAPs) {
                    expect(BAPs[i].title).toBe(apOptions[i].title);
                    expect(BAPs[i].updaters).toMatchObject(
                        apOptions[i].updaters
                    );
                    expect(BAPs[i].options).toMatchObject(apOptions[i]);
                    expect(BAPs[i].duration).toBe(apOptions[i].duration);
                    expect(BAPs[i].shown).toBe(false);
                    expect(BAPs[i].prepared).toBe(false);
                    expect(BAPs[i].ended).toBe(false);
                }
            }
        );
        test(
            "Expect prepare event to properly set ".concat(
                "internal variables and update to initial values"
            ),
            ()=>{
                var bap = screens[0].options.plugins[0];
                screens[0].prepare(); //tells mock to send event to the plugins
                var ctts = bap.canvasScreen.options.content[0];
                expect(bap.prepared).toBe(true);
                expect(bap.canvasScreen).toBeInstanceOf(lab.canvas.Screen);
                expect(ctts.left).toBe(0);
            }
        );
        test(
            "Expect render event to properly Start updaters",
            ()=>{
                var bap = screens[0].options.plugins[0];
                var left = bap.updaters.object1.left;
                screens[0].run();
                expect(left.started).toBe(true);
            }
        );
        test(
            "Expect show event to properly set variables, ".concat(
                " install, and handle updaterFunction, and end event",
                " (called after through mocking) to clean everything up"
            ),
            ()=>{
                var bap = screens[0].options.plugins[0];
                var ctts = bap.canvasScreen.options.content[0];
                var left = bap.updaters.object1.left;
                screens[0].show();
                expect(bap.shown).toBe(true);
                expect(bap.ended).toBe(true);
                //animation frame requested:
                expect(reqAFSpy).toBeCalledTimes(125);
                // ^ 62 times by BaseAnimationPlugin, 62 times by Screen, and
                // 1 initial calling when installed at BaseAnimationPlugin
                expect(ctts.left).toBe(100);

            }
        );
    }
);