import { describe, expect, test, it } from "@jest/globals";
import { 
    ParabolicAnimationUpdater, 
    ParabolicAnimationAltCon
 } from "../../src/updaters/ParabolicAnimationUpdater.mjs";

var dt = Date.now();
const TestClass = ParabolicAnimationUpdater;
const Construct = cas_ => new TestClass(
    cas_.duration, cas_.startPosition, cas_.endPosition, cas_.middle
);
// TODO: make some test cases where endPosition != startPosition after
// fixing it in the code
const testcases = [
    {
        duration: 1500,
        startPosition: 0,
        endPosition: 0,
        middle: 50,
        startDef: dt,
        checkpoints: [
            dt+375,
            dt+750,
            dt+1125
        ],
        endpoint: 1500+dt,
        positionpoints: [37.5, 50, 37.5],
    },
    {
        duration: 2000,
        startPosition: 50,
        endPosition: 50,
        middle: -25,
        startDef: dt,
        checkpoints: [
            dt+500,
            dt+1000,
            dt+1500
        ],
        endpoint: 2000+dt,
        positionpoints: [-18.73433583, -25, -18.73433583],
    },
    {
        duration: 500,
        startPosition: 360,
        endPosition: 360,
        middle: 400,
        startDef: dt,
        checkpoints: [
            dt+125,
            dt+250,
            dt+375
        ],
        endpoint: 500+dt,
        positionpoints: [493.14456036, 400, 493.14456036],
    },
    {
        duration: 444,
        startPosition: 200,
        endPosition: 200,
        middle: 150,
        startDef: dt,
        checkpoints: [
            dt+111,
            dt+222,
            dt+333
        ],
        endpoint: 444+dt,
        positionpoints: [-49.06828953, 150, -49.06828953],
    },
    {
        duration: 1800,
        startPosition: 0,
        endPosition: 0,
        middle: -50,
        startDef: dt,
        checkpoints: [
            dt+450,
            dt+900,
            dt+1350
        ],
        endpoint: 1800+dt,
        positionpoints: [-37.5, -50, -37.5],
    },
    {
        duration: 3600,
        startPosition: -220,
        endPosition: -220,
        middle: -110,
        startDef: dt,
        checkpoints: [
            dt+900,
            dt+1800,
            dt+2700
        ],
        endpoint: 3600+dt,
        positionpoints: [-82.08296779, -110, -82.08296779],
    },
];



describe(
    TestClass.name,
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
            "Start() must properly set".concat(
                " started/ended bools and timers only when not already started"
            ),
            ()=>{
                for (let curCase of testcases) {
                    var curobj = Construct(curCase);
                    curobj.Start(curCase.startDef);
                    expect(curobj.started).toBe(true);
                    expect(curobj.startTime).toBe(curCase.startDef);
                    expect(curobj.currentTime).toBe(curCase.startDef);
                    expect(curobj.ended).toBe(false);
                    //must have no effect as it's already started:
                    curobj.Start();
                    //must be unaltered:
                    expect(curobj.startTime).toBe(curCase.startDef); 
                    //must be unaltered:
                    expect(curobj.currentTime).toBe(curCase.startDef); 
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
                    //try to go back in time:
                    curobj.Update(curCase.checkpoints[0]); 
                    //shouldn't be allowed, so the current time must remain:
                    expect(curobj.currentTime).toBe(curCase.checkpoints[1]); 
                    curobj.Update(curCase.checkpoints[2]); // <- advances again
                    //check if advanced again:
                    expect(curobj.currentTime).toBe(curCase.checkpoints[2]); 
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
                "coordinate methods should return proper coordinates and ",
                "GetUpdatedCoordinates() should also update internal timer ",
                "and set to end case it's at or beyond the end"
            ),
            ()=>{
                for (let curCase of testcases) {
                    var curobj = Construct(curCase);
                    curobj.Start(curCase.startDef); 
                    expect(
                        curobj.GetMomentCoordinates(
                            curCase.startDef
                            ).toFixed(6)
                    ).toBe(curCase.startPosition.toFixed(6));

                    curobj.Update(curCase.checkpoints[0]);

                    expect(curobj.GetMomentCoordinates(
                        curCase.checkpoints[0]
                    ).toFixed(6)).toBe(curCase.positionpoints[0].toFixed(6));

                    expect(curobj.GetUpdatedCoordinates(
                        curCase.checkpoints[1]
                    ).toFixed(6)).toBe(curCase.positionpoints[1].toFixed(6));

                    expect(curobj.currentTime).toBe(curCase.checkpoints[1]);

                    curobj.Update(curCase.checkpoints[2]);

                    expect(curobj.GetCoordinates().toFixed(6)).toBe(
                        curCase.positionpoints[2].toFixed(6)
                    );

                    expect(curobj.currentTime).toBe(curCase.checkpoints[2]);
                    //in an arc it should be the case
                    expect(curobj.GetUpdatedCoordinates(
                        curCase.endpoint
                    ).toFixed(6)).toBe(curCase.startPosition.toFixed(6));
                    //TODO: Make it work with curCase.endPosition
                    expect(curobj.ended).toBe(true); 
                }
            }
        );
        test(
            "Proper function of the alternative constructor",
            ()=>{
                var altcon = ParabolicAnimationAltCon({
                    duration: 1500,
                    start: 0,
                    middle: 50,
                    end: 100,
                });
                expect(altcon.duration).toBe(1500);
                expect(altcon.startPosition).toBe(0);
                expect(altcon.endPosition).toBe(100);
                expect(altcon.middlePosition).toBe(50);
                expect(altcon.started).toBe(false);
                expect(altcon.ended).toBe(false);
            }
        );
    }
);