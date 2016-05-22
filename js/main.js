var $, $$, windowHeight, windowWidth;

$$ = function(selector) {
  var result;
  result = null;
  if (selector[0] === '#') {
    result = document.getElementById(selector.substr(1));
  } else {
    result = document.body.getElementsByClassName(selector.substr(1));
  }
  if (result.length > 1) {
    return result;
  } else {
    return result[0];
  }
};

$ = function(selector, ctx) {
  var result;
  if (ctx) {
    result = ctx.querySelectorAll(selector);
  } else {
    result = document.querySelectorAll(selector);
  }
  if (result.length > 1) {
    return result;
  } else {
    return result[0];
  }
};

windowWidth = function() {
  var w;
  w = 0;
  if (window.innerWidth > window.outerWidth) {
    w = window.outerWidth;
  } else {
    w = window.innerWidth;
  }
  return w;
};

windowHeight = function() {
  var w;
  w = 0;
  if (window.innerHeight > window.outerHeight) {
    w = window.outerHeight;
  } else {
    w = window.innerHeight;
  }
  return w;
};

document.on('DOMContentLoaded', function() {
  $('#scroller1').enableScroller();
  $('#scroller2').enableScroller();
  $('#scroller3').enableScroller();
  $('#skype').makeWindow({
    surrounded: true
  });
  $('#tiles').makeWindow();
  $('#window').makeWindow();
  TilityInitComponents();
});
