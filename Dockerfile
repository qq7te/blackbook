From node:16-alpine3.15


copy app.js .
copy bb/public bb/public
copy bb/src bb/src
copy bb/package.json bb/package.json
copy run.sh .
copy bin bin
copy noidea.js .
copy routes routes
copy views views
copy package.json .

workdir /
#run sed -i -e s/10.20.1/16.17.1/ package.json
run yarn install
run /run.sh

expose 5000

entrypoint ["node", "bin/www"]

