import { describe, expect, test, it, jest } from "@jest/globals";
import { MoveLab } from "../../src/plugins/MoveLab.mjs";
import { move } from "../../src/plugins/MoveLab.mjs";
import { lab } from "../../__mocks__/lab";

var movelabs = [
    new MoveLab({
        title: 'test@canvas:1',
    }),
];
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
                updaters: {
                    top: {
                        id: 'vertical-movement',
                        type: 'Arc',
                        duration: 2500,
                        start: 0,
                        end: 0,
                        middle: -150,
                    },
                    left: {
                        id: 'horizontal-movement',
                        type: 'Linear',
                        duration: 2500,
                        start: -300,
                        end: 300,
                    },
                },
            },
        ],
        timeout: 5000,
        plugins: [
            movelabs[0],
        ],
    }),
];

describe(
    "MoveLab",
    ()=>{
        test(
            "Expect instance to have updaters retrieved when ".concat(
                "it receives an prepare event"
            ),
            ()=>{
                var s=screens[0], m=movelabs[0];
                //console.log("move=", move);
                s.prepare();
                expect(m.updaters.object1.top).toBeInstanceOf(
                    move.lab.updaters.ParabolicAnimationUpdater
                );
                expect(m.updaters.object1.left).toBeInstanceOf(
                    move.lab.updaters.LinearAnimationUpdater
                );
            }
        );
    }
);