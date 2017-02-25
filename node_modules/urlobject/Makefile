BIN := node_modules/.bin

all: urlobject.d.ts index.js

$(BIN)/tsc:
	npm install

urlobject.d.ts: index.ts $(BIN)/tsc
	sed 's:^//// ::g' $< > module.ts
	$(BIN)/tsc --module commonjs --target ES5 --declaration module.ts
	sed 's:export declare module urlobject:declare module "urlobject":' <module.d.ts >$@
	rm module.{ts,d.ts,js}
