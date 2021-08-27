import { describe, expect, test, it } from "@jest/globals";
import { 
    move, BaseAnimationUpdater, LinearAnimationUpdater, ParabolicAnimationUpdater,
    LinearAnimationAltCon, ParabolicAnimationAltCon,
    BaseAnimationPlugin, MoveLab
 } from "../dist/move.lab.dev.mjs";


describe(
    "move.lab.mjs Objects",
    ()=>{
        test(
            "Expect move to be available",
            ()=>{
                expect(move).toBeInstanceOf(Object);
                expect(move.lab).toBeInstanceOf(Object);
                expect(move.lab.plugins).toBeInstanceOf(Object);
                expect(move.lab.updaters).toBeInstanceOf(Object);
                expect(move.lab.animationTypes).toBeInstanceOf(Object);
                expect(move.lab.starters).toBeInstanceOf(Object);
            }
        );
        test(
            "Expect animation classes to be available",
            ()=>{
                expect(BaseAnimationUpdater).toBeDefined();
                expect(LinearAnimationUpdater).toBeDefined();
                expect(ParabolicAnimationUpdater).toBeDefined();
            }
        );
        test(
            "Expect Plugins to be available",
            ()=>{
                expect(BaseAnimationPlugin).toBeDefined();
                expect(MoveLab).toBeDefined();
            }
        );
        test(
            "Expect alternative constructors to be available",
            ()=>{
                expect(LinearAnimationAltCon).toBeDefined();
                expect(ParabolicAnimationAltCon).toBeDefined();
            }
        );
    }
);