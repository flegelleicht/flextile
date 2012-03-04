var FlextileEnvironment = new Env(null, {  		
  "h1" : function(env) {
    var r = ['<h1>', env.args, '</h1>'];
    return r;
  },
  "section" : function(env) {
    var ps = env.parentSectionNumber = env.parentSectionNumber || '';
    var cs = env.currentSectionNumber = env.currentSectionNumber || 1;
    var h = env.h = env.h || 2;
    var e = new Env(env, {
      section : function(env) { 
        var ps = env.parentSectionNumber;
        var cs = env.currentSectionNumber++;
        var e = new Env(env, {});
        e.parentSectionNumber = ps+'.'+cs;
        e.currentSectionNumber = 1;
        e.h = env.h+1;
        var r = ['<h' + env.h + '>'+ ps + '.' + cs, env.args, '</h'+env.h+'>'];
        r.env = e;
        return r;
      }
    });
    e.parentSectionNumber = ''+cs;
    e.currentSectionNumber = 1;
    e.h = env.h++;
    var r = ['<h'+env.h+'>'+cs, env.args, '</h'+env.h+'>'];
    r.env = e;

    env.currentSectionNumber++;
    return r;
  },
  "lol" : function(env) {
    console.log(env.args);
    return ['(','lol ',env.args,')'];
  },
  "test" : function() {}
});