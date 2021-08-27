import { describe, expect, test } from "@jest/globals";
import { BaseAnimationUpdater } from "../../src/updaters/BaseAnimationUpdater.mjs";

var dt = Date.now();
const TestClass = BaseAnimationUpdater;
const Construct = cas_ => new TestClass(cas_.duration, cas_.startPosition, cas_.endPosition);

const testcases = [
    {
        duration: 1500,
        startPosition: 0,
        endPosition: 100,
        startDef: dt,
        checkpoints: [
            dt+375,
            dt+750,
            dt+1125
        ],
        endpoint: 1500+dt,
    },
    {
        duration: 2000,
        startPosition: 25,
        endPosition: -50,
        startDef: dt,
        checkpoints: [
            dt+500,
            dt+1000,
            dt+1500
        ],
        endpoint: 2000+dt,
    },
    {
        duration: 500,
        startPosition: 360,
        endPosition: 720,
        startDef: dt,
        checkpoints: [
            dt+125,
            dt+250,
            dt+375
        ],
        endpoint: 500+dt,
    },
    {
        duration: 444,
        startPosition: 200,
        endPosition: 100,
        startDef: dt,
        checkpoints: [
            dt+111,
            dt+222,
            dt+333
        ],
        endpoint: 444+dt,
    },
    {
        duration: 1800,
        startPosition: 0,
        endPosition: -100,
        startDef: dt,
        checkpoints: [
            dt+400,
            dt+800,
            dt+1200
        ],
        endpoint: 1800+dt,
    },
    {
        duration: 3600,
        startPosition: -225,
        endPosition: 100,
        startDef: dt,
        checkpoints: [
            dt+900,
            dt+1800,
            dt+2700
        ],
        endpoint: 3600+dt,
    },
];



describe(
    'BaseAnimationUpdater',
    ()=>{
        test(
            "Constructor should properly set parameters",
            ()=> {
                for (let curCase of testcases) {
                    var curobj = Construct(curCase);
                    expect(curobj.duration).toBe(curCase.duration);
                    expect(curobj.startPosition).toBe(curCase.startPosition);
                    expect(curobj.endPosition).toBe(curCase.endPosition);
                    expect(curobj.started).toBe(false);
                    expect(curobj.ended).toBe(false);
                }
            }
        );
        test(
            "Start() must properly set started/ended bools and timers only when not already started",
            ()=>{
                for (let curCase of testcases) {
                    var curobj = Construct(curCase);
                    curobj.Start(curCase.startDef);
                    expect(curobj.started).toBe(true);
                    expect(curobj.startTime).toBe(curCase.startDef);
                    expect(curobj.currentTime).toBe(curCase.startDef);
                    expect(curobj.ended).toBe(false);
                    curobj.Start(); // must have no effect as it's already started
                    expect(curobj.startTime).toBe(curCase.startDef); //must be unaltered
                    expect(curobj.currentTime).toBe(curCase.startDef); //must be unaltered
                }
            }
        );
        test(
            "Stop() must end timers and set ended to true",
            ()=>{
                for (let curCase of testcases) {
                    var curobj = Construct(curCase);
                    curobj.Start(curCase.startDef);
                    curobj.Stop();
                    expect(curobj.startTime).toBe(0);
                    expect(curobj.currentTime).toBe(0);
                    expect(curobj.ended).toBe(true);
                }
            }
        );
        test(
            "Clear() must reset control booleans",
            ()=>{
                for (let curCase of testcases) {
                    var curobj = Construct(curCase);
                    curobj.Start(curCase.startDef);
                    curobj.Clear();
                    expect(curobj.started).toBe(false); 
                    expect(curobj.ended).toBe(false);
                }
            }
        );
        test(
            "Update() must increase currentTime when new time is greater than old one",
            ()=>{
                for (let curCase of testcases) {
                    var curobj = Construct(curCase);
                    curobj.Start(curCase.startDef);
                    curobj.Update(curCase.checkpoints[0]);
                    expect(curobj.currentTime).toBe(curCase.checkpoints[0]); 
                    curobj.Update(curCase.checkpoints[1]);
                    expect(curobj.currentTime).toBe(curCase.checkpoints[1]);
                    curobj.Update(curCase.checkpoints[0]); //try to go back in time
                    expect(curobj.currentTime).toBe(curCase.checkpoints[1]); //shouldn't be allowed, so the current time must remain
                    curobj.Update(curCase.checkpoints[2]); //advances again
                    expect(curobj.currentTime).toBe(curCase.checkpoints[2]); //check if advanced again
                }
            }
        );
        test(
            "Update() must end when animation time is reached",
            ()=>{
                for (let curCase of testcases) {
                    var curobj = Construct(curCase);
                    curobj.Start(curCase.startDef);
                    curobj.Update(curCase.checkpoints[0]);
                    curobj.Update(curCase.checkpoints[2]); //advances again
                    curobj.Update(curCase.endpoint);
                    expect(curobj.ended).toBe(true); //check if advanced again
                }
            }
        );
        test(
            "Getting ".concat(
                "coordinates from an abstract class must throw an error,",
                " and GetUpdatedCoordinates() should update internal timer ",
                "and set to end case it's at or beyond the end"
            ),
            ()=>{
                for (let curCase of testcases) {
                    var curobj = Construct(curCase);
                    //console.log("curobj=", curobj);
                    curobj.Start(curCase.startDef); // start so all functions will get coordinate
                    expect(
                        ()=>curobj.GetMomentCoordinates(curCase.startDef)
                    ).toThrow(
                        new TypeError(`Cannot call abstract method GetUpdatedCoordinates(${curCase.startDef})`)
                    );
                    curobj.Update(curCase.checkpoints[0]);
                    expect(
                        ()=>curobj.GetMomentCoordinates(
                            curCase.checkpoints[0]
                        )
                    ).toThrow(
                        new TypeError(`Cannot call abstract method GetUpdatedCoordinates(${curCase.checkpoints[0]})`)
                    );
                    expect(
                        ()=>curobj.GetUpdatedCoordinates(
                            curCase.checkpoints[1]
                        )
                    ).toThrow(
                        new TypeError(`Cannot call abstract method GetUpdatedCoordinates(${curCase.checkpoints[1]})`)
                    );
                    expect(curobj.currentTime).toBe(curCase.checkpoints[1]);
                    curobj.Update(curCase.checkpoints[2]);
                    expect(()=>curobj.GetCoordinates()).toThrow();
                    expect(curobj.currentTime).toBe(curCase.checkpoints[2]);
                    expect(
                        ()=>curobj.GetUpdatedCoordinates(curCase.endpoint)
                    ).toThrow(
                        new TypeError(`Cannot call abstract method GetUpdatedCoordinates(${curCase.endpoint})`)
                    );
                    expect(curobj.ended).toBe(true); 
                }
            }
        );
    }
);