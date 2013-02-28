/*
 * Array.shuffle() helper
 */
Array.prototype.shuffle = function() {
  var s = [];
  while(this.length) s.push(this.splice(Math.random() * this.length, 1));
  while(s.length) this.push(s.pop()[0]);
  return this;
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
