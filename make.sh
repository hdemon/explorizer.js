#! /bin/bash

rm explorizer-[0-9.]*.js
version=$(head -n 1 version)

cd src

cat core.js         >> code
cat util.js         >> code
cat resizer.js      >> code
cat aligner.js      >> code
cat selector.js     >> code
cat manipulator.js  >> code
cat titlebar.js     >> code
cat locator.js      >> code
cat evtcontroller.js>> code
cat wform.js        >> code

cat intro code outro >> ../explorizer-${version}.js
rm code

cd ..
