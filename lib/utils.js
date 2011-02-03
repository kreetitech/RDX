var Utils = module.exports = new Object();

function Clone() { }

Utils.clone = function (obj) {
  if(typeof(obj) == "function") {
    var f= new Function();
    f.__proto__ = obj;
    f.prototype.__proto__ = obj.prototype;
    return f;
  }
  Clone.prototype = obj;
  return new Clone();
};

Utils.extend = function(receiver, object) {
  for(var f in object) {
    receiver[f] = object[f];
  }
}
