# CSS syntax highlighting in VS Code

Adds syntax highlighting to CSS files in VS Code

Derived from https://github.com/atom/language-css.
Originally [converted](http://flight-manual.atom.io/hacking-atom/sections/converting-from-textmate)
from the [CSS TextMate bundle](https://github.com/textmate/css.tmbundle).

Contributions are greatly appreciated. Please fork this repository and open a
pull request to add snippets, make grammar tweaks, etc.

[CONTRIBUTOR NOTES]
A while back, I created a [custom-css](https://github.com/wileycoyote78/custom-css) json file to add support for the new *container* properties (@container, container, container-type, container-name) in order to remove the squiggly line. However, the color syntax was not applying to the properties.
Saw that someone had created a pull request to add color syntax to the properties, but not the at-rule (see PR#14). After studying the cson file, I realized that the existing @media rule is basically identical to the new @container rule. Just copied and pasted the @media rule lines, and changed the regex lines to look for 'container' instead of 'media'.
This, however, still does not correct the problem that any properties (i.e. padding, margin, etc.) inside an @container block do not display a description thumbnail thingy when hovering over them.
