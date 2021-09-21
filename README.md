# move.lab
lab.js plugin responsible for basic animation (we move lab visual components for you).

# Status
While I am aware that things are far away from the ideal, it is an easy implementation of visual animations for lab.js. By now, the plugin works by causing new screen refreshes through a direct call to requestAnimationFrame. It then recalculate object positions or other properties based on timestamp. I think there might be better ways of doing that, but it needs some thought.
# How to Use move.lab
There is a functioning example in the folder [example](https://github.com/brunodOut/move.lab/tree/main/example) of this repository, also available at the package. The live version of this example is available at https://demolab.bruno.today/move.lab/dist/example.html
## General Concept
The plugin reads the `.updaters` property of a content object in the canvas. The updaters property has the information of what is updated and how it is updated.
## The `.updaters` Property
Every lab.js canvas has a `content` property containing an array of content elements in the form of a JavaScript object. i.e.
```
[{
  id: 'hello',
  type: "i-text",
  left: -200,
  top: -200,
  fontSize: 22,
  text: "Hello, world!",
  fill: '#000000',
}]
```
In this example, we have a text "Hello, world" positioned at (-200, -200), in black color and with a 22pt font size.
In move.lab, an updater is a type of routine which changes a certain property in a certain pattern. There are, currently, the following Updater types:
* `LinearAnimationUpdater`, with the shortcuts:
  *  `Line`
  *  `Linear`
  *  `Continuous`
* `ParabolicAnimationUpdater`, with the shortcuts:
  * `Parabolic`
  * `Arc`
  * `Boomerang`

You set up an updater for a certain property using the `.updaters` property, by adding to it an object containing as key the property you want to change. i.e.
```
[{
  id: 'hello',
  type: "i-text",
  left: -200,
  top: -200,
  fontSize: 22,
  text: "Hello, animated world!",
  fill: '#000000',
  updaters: {
    left: { // <- left, as the name of the property we want to set the updater for
      id: 'horizontal-movement', // just for identification purposes in testing
      type: 'Linear', // <- here you set the type of the updater
                      // From now on we set the updater parameters, for instance,
                      //   the LinearAnimationUpdater has a duration, a start position
                      //   and an end position as parameters
      duration: 2500, // <- PS: The duration is in miliseconds, so 2500 = 2.5 seconds
      start: -300, // <- The starting value for left coordinate, for time=0
      end: 300, // <- The ending point for left coordinate, for time=2500
        // This setup is moving the content horizontally from -300 to 300 in 2500 ms.
    },
    top: {
      id: 'vertical movement',
      type: 'Arc', // <- sets the type as Arc, a shortcut for ParabolicAnimationUpdater
                   //   The ParabolicAnimationUpdater has a duration, a starting point,
                   //   an ending point and a middle point. In this example, we want to
                   //   move into an Arc trajectory, meaning the vertical position will
                   //   change from a base point (start) to the upmost point (middle)
                   //   and then return to the base point (end).
                   //   Notice, however, that this Arc trajectory depends not only on
                   //   the vertical updater (ParabolicAnimationUpdater), but also on
                   //   an horizontal updater in sync with that. But you can use a 
                   //   ParabolicAnimationUpdater alone to do really cool stuff, like
                   //   rotating a fixation cross forth and back! (by manipulating the
                   //   angle property, there will be an example in the future).
      duration: 2500, // <- To be in sync they must take the same time
      start: 0,
      middle: -250, // <- the top, you can use positive to make an U
    }
  }
}]
```
As described in the comments, the above example moves a text horizontally and vertically following an arc trajectory.

# Roadmap
I have a lot of ideas. I will list them, but I'm just not sure whether they're great and I'm very open to 
1. Develop more updaters.
  * Including a `SequenceAnimationUpdater`, allowing a new updater after the other within a programmed timeline.
2. Find better methods of implementing the animations.
  * As, to be honest, I don't think I'm doing the best one could do.
3. Change some stuff into lab.js and hypnotize @FelixHenninger to accept those changes.
  * I'm not sure it would be appropriate, but I think adding a new 'frame' event on lab.js, to be triggered by `requestAnimationFrame`, would be easy to implement and would make the move.lab <-> lab.js integration not that ugly and improvised (and also would add a new functionality to lab.js; psychoPy and other libraries also have that).
4. Put move.lab to work into lab.js builder if someone is willing to implement that.
  * That would be great, but I have literally no idea on how to do that. Maybe something related to the timeline thing, after `SequenceAnimationUpdater` is implemented, but I don't even understand how to use it, imagine implementing something similar.
6. Most important thing: get some feedback and see if I can implement them.
  * Considering my own limitations of time and mostly skills, as I'm learning to code again after almost a decade, plus JavaScript was not my thing and I coded stuff in JS in the times of ES4/ES5 - I'm a dinossaur!

# Support
It's complicated. I'm autistic and sometimes I need long times away from things to keep my mental health in order. But open an Issue, reach me at lab.js support slack (see at the lab.js README.md) or send me an email. I'll answer as soon as I can, which might be something between few minutes and several weeks.

# Contribute
You can make pull requests, there is not much of a guideline by now, just implement/update the tests (it's using jest) and make sure everything is okay.
In the future there will be more guidelines.
PS: I have very limited time and skills for maintaining this project, so if you are more skilled and are willing to, reach me and pitch me about how you could help the project.

## Author/Maintainer (s)
1. [Bruno Moreira-Guedes](https://github.com/brunodOut/brunodOut) < moreira.guedes@estudante.uffs.edu.br >
## Acknowledgements
I would like to acknowledge the author is financially supported by the Brazilian agency CAPES, for the provision my stipend during my master's program.
