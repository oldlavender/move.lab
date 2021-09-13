import { 
    move, MoveLab
 } from "./lib/move.lab.mjs"; // <- Adjust this path accordingly
import "./lib/lab.js"; // <- Adjust accordingly, do not use named import here

const s = new lab.flow.Sequence({
    title: '@root',
    content: [
        new lab.canvas.Screen({
            title: 'canvas@root',
            content: [
                {
                    id: 'hello',
                    type: "i-text",
                    left: -200,
                    top: -200,
                    fontSize: 22,
                    text: "Hello, animated world!",
                    fill: '#000000',
                    updaters: {
                        left: {
                            id: 'horizontal-movement',
                            type: 'Linear',
                            duration: 2500,
                            start: -300,
                            end: 300,
                        },
                        top: {
                            id: 'vertical-movement',
                            type: 'Arc',
                            duration: 2500,
                            start: 0,
                            end: 0,
                            middle: -250,
                        },
                    },
                },
            ],
            timeout: 5000,
            plugins: [
                new MoveLab({
                    title: 'movelab@canvas'
                }),
            ],
        }),
    ],
});


s.run();