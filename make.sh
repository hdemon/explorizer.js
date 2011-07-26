#! /bin/bash

rm explorizer.js

cd src
for file in `ls *.js`
do
echo $file
	cat $file >> core
	echo $'\r' >> core
done

cat intro core outro >> ../explorizer.js

rm core

cd ..
