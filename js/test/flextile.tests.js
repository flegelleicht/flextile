var $;

function parse(str) {
  var f = new Flextile();
  var o = str;
  var r = f.parse(f.tokenize(str));
  
  console.log(o);
  console.log("->");
  console.log(r);

  $ = r;
}

function interpret(str) {
	var f = new Flextile();
	var o = str;
	var r = f.interpret(f.parse(f.tokenize(str)));

	console.log(o);
	console.log("->");
	console.log(r);
	
	$ = r;
}

function interpret_in_env(str, env) {
	var f = new Flextile();
	var o = str;
	var r = f.interpret(f.parse(f.tokenize(str)), env);

	console.log(o);
	console.log("->");
	console.log(r);
	
	$ = r;
}
// parse("(h1 Hello World)");

// interpret("(h1 Hello World!)");
// interpret("(h1 (h1 Hello World!))");

// interpret("(section Motivation) (section Stand der Technik (section Bibliotheken) (section Frameworks (section OpenMP (section Pragmas) (section Compiler Options)))) (section Neuer Ansatz)");
// interpret("(h1 (b Hello\nWorld))");
// interpret("Test (h1 (b Hello\nWorld))");

interpret_in_env("(section Motivation) (section Stand der Technik (section Bibliotheken) (section Frameworks (section OpenMP (section Pragmas) (section Compiler Options)))) (section Neuer Ansatz)", FlextileEnvironment);
