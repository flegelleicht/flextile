var Env = function(env, vocabulary) {
	this.ancestor = env || null;
	
	var vocab = {};
	for(var key in vocabulary) {
		vocab[key] = vocabulary[key];
	}
	
	this.resolve = function (term) {
		var result;
		if(vocab[term]){ 
			result = vocab[term];
		}
		else {
			result = (this.ancestor) ? this.ancestor.resolve(term) : null;
		}
		
		if(!result) {
		  result = this.term_missing(term);
		}
		
		return result;
	}
	
	this.term_missing = function(term) {
	  console.log("term_missing: "+term);
	  return function(env) { return env.args; };
	}
	
	this.forms = [];
	this.emit = function(t) { this.forms.push(t); }

	this.debug = {};
	this.debug.vocabulary = vocab;
}

var Flextile = (function() {
	var constructor = function() {
	};
	
	var TextToken = function() { this.text = ''; this.whitespace = ''; };
	var OpeningToken = function() { this.whitespace = ''; };
	var ClosingToken = function() { this.whitespace = ''; };

	var Form = function() {
	  this.tokens = [];
		if(arguments.length > 0) this.tokens = this.tokens.concat(arguments[0]);
		this.push = function(obj) { this.tokens.push(obj); }
		this.head = function() { return this.tokens[0]; }
		this.tail = function() { return this.tokens.slice(1); }
	}

	var PlaceHolder = function(func) { this.func = func; };
	
	constructor.prototype = {
		
		tokenize : function(str) {
			/* Helper functions */
			var pushToken = function(t) {
				result.push(t);
				currentToken = t;
			}
			
			var addWhitespaceToCurrentToken = function(ch) {
				if(currentToken === null) return;
				currentToken.whitespace += ch;
			}
			
			var createNewCurrentTextToken = function() {
				currentToken = new TextToken();
				result.push(currentToken);        
			}
			
			var addCharacterToTextToken = function(ch) {
				if(!(currentToken instanceof TextToken)) {
					createNewCurrentTextToken();
				} else {
					if(currentToken.whitespace.length > 0) {
						createNewCurrentTextToken();
					}
				}
				currentToken.text += ch;
			}

			/* Actual tokenizing action */
			var result = [];
			var currentToken = null;

			var l = str.length;
			var c;
			
			for(var i = 0; i < l; ++i) {
				c = str.charAt(i);

						 if(c === '(')                  { pushToken(new OpeningToken()); }
				else if(c === ')')                  { pushToken(new ClosingToken()); }
				else if(" \t\n\r".indexOf(c) >= 0)  { addWhitespaceToCurrentToken(c); }
				else                                { addCharacterToTextToken(c); }
			}
			
			return result;
		},
		
		parse : function(tokens) {
			var tokns = [].concat(tokens);
			var result = this._parse(tokns);
			return result;
		},
		
		_parse : function(tokens) {
			var result = [];
			var token;
			while(tokens.length > 0) {
				token = tokens.shift();
				
				if      (token instanceof OpeningToken) { result.push(new Form(this._parse(tokens))); }
				else if (token instanceof ClosingToken) { return result; }
				else if (token instanceof TextToken) { result.push(token); }
				else { console.log(token.constructor); return ''; }
			}
			return result;
		},
		
		interpret : function(parsetree, environment) {
			var forms = [].concat(parsetree);
			var env = environment || new Env(null, {});
			var doc = {};
			
			var result = this._interpret(forms, env, doc);
			return result;
		},
		
		_interpret : function(form, env, doc) {
		  var result = [];
	    if(form instanceof Array) {
	      for(var i = 0; i < form.length; ++i) {
	        result = result.concat(this._interpret(form[i], env, doc));
	      }
	    }
	    else if(form instanceof Form) {
	      var command = form.head();
	      command = this._interpret(command,env,doc);
	      var func = env.resolve(command);
	      
        // var e = new Env(env, {});
	      env.args = form.tail();
	      
	      var ret = null;
	      if(func) {
	        ret = func(env);
	        ret = this._interpret(ret, (ret.env)? ret.env : env, doc); // Use inner env defined in func?!
	      }
	      
	      result = result.concat(ret);
	    }
	    else if(form instanceof TextToken) {
	      result = form.text;
	    }
	    else {
	      result = form;
	    }
	    return result;
		},
		
		print : function(parseresult) {},
	};
	
	return constructor;
})();
