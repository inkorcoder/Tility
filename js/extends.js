var ACTIVE_WINDOW, SCROLL, TilityInitComponents, _$, _setAlignedMargin, _windowWidth;

SCROLL = 200;

ACTIVE_WINDOW = null;

_$ = function(selector, ctx) {
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

_windowWidth = function() {
  var w;
  w = 0;
  if (window.innerWidth > window.outerWidth) {
    w = window.outerWidth;
  } else {
    w = window.innerWidth;
  }
  return w;
};

Object.prototype.on = function(ev, handler) {
  return this.addEventListener(ev, handler);
};

Object.prototype.off = function(ev, handler) {
  if (handler) {
    return this.removeEventListener(ev, handler);
  } else {
    return this.removeEventListener(ev);
  }
};

Object.prototype.updateScrollDef = function(isPrivate) {
  this.def = {
    sw: this.scrollWidth - (!isPrivate ? this.wrapper ? this._scroll : 0 : 0),
    cw: this.clientWidth,
    sh: this.scrollHeight - (!isPrivate ? this.wrapper ? this._scroll : 0 : 0),
    ch: this.clientHeight
  };
  this.def.coef = this.def.cw / this.def.sw;
  this.def.scrollBarCoef = this.scrollbar.clientWidth / this.def.sw;
  this.def.scrollBarCoefRev = this.def.sw / this.scrollbar.clientWidth;
  this.def.diff = this.def.sw - this.def.cw;
  this.def.coefH = this.def.ch / this.def.sh;
  this.def.scrollBarCoefH = this.scrollbar.clientHeight / this.def.sh;
  this.def.scrollBarCoefRevH = this.def.sh / this.scrollbar.clientHeight;
  this.def.diffH = this.def.sh - this.def.ch;
  if (this.wrapper && this.classList.contains('horizontal')) {
    this.wrapper.translateNode(this._scroll + "px,0");
  } else if (this.wrapper && this.classList.contains('vertical')) {
    this.wrapper.translateNode("0," + this._scroll + "px");
  }
  if (this.anchors && this.anchors[0] && this.classList.contains('horizontal')) {
    this.anchors[0].setAttribute('style', 'width:' + (this.def.coef * 100) + '%;');
  }
  if (this.anchors && this.anchors[0] && this.classList.contains('vertical')) {
    return this.anchors[0].setAttribute('style', 'height:' + (this.def.coefH * 100) + '%;');
  }
};

Object.prototype.updateDrags = function() {
  if (this.classList.contains('horizontal')) {
    if (this.def.sw <= this.def.cw) {
      return this.anchors[0].parentNode.classList.add('hidden');
    } else {
      this.anchors[0].parentNode.classList.remove('hidden');
      return this.anchors[0].setAttribute('style', "width:" + (this.def.coef * 100) + "%; left:" + ((-this._scroll) * this.def.scrollBarCoef) + "px;");
    }
  } else if (this.classList.contains('vertical')) {
    if (this.def.sh <= this.def.ch) {
      return this.anchors[0].parentNode.classList.add('hidden');
    } else {
      this.anchors[0].parentNode.classList.remove('hidden');
      return this.anchors[0].setAttribute('style', "height:" + (this.def.coefH * 100) + "%; top:" + ((-this._scroll) * this.def.scrollBarCoefH) + "px;");
    }
  }
};

Object.prototype.translateNode = function(str) {
  return this.style.transform = "translate(" + str + ")";
};

Object.prototype.enableScroller = function() {
  var $this, onmove;
  this.anchors = [];
  this.arrows = [];
  this.anchors[0] = $('.scrollbar .scrollbar-anchor', this);
  this.scrollbar = $('.scrollbar .scrollbar-drag', this);
  this.arrows[0] = $('.scrollbar .scrollbar-arrow.left', this);
  this.arrows[1] = $('.scrollbar .scrollbar-arrow.right', this);
  this.anchors[0].parent = this;
  this.wrapper = $('.scroll-wrapper', this);
  this.wrapper.parent = this;
  this._scroll = 0;
  this.updateScrollDef();
  $this = this;
  this.reinit = function() {
    $this._scroll = 0;
    if (_windowWidth() > 800) {
      $this.addEventListeners();
    }
    $this.updateScrollDef();
    return $this.updateDrags();
  };
  onmove = function(e) {
    var s;
    if ($this.eventFrom === 'wrapper') {
      if ($this.classList.contains('horizontal')) {
        s = (e.pageX - $this.catchedOffset) + ($this.eventFrom === 'wrapper' ? $this.catchedLeftScroll : -($this.catchedLeftScroll * $this.def.scrollBarCoef));
        if (s < 0 && s > -$this.def.diff) {
          $this._scroll = s;
        }
      } else if ($this.classList.contains('vertical')) {
        s = (e.pageY - $this.catchedOffsetH) + ($this.eventFrom === 'wrapper' ? $this.catchedLeftScroll : -($this.catchedLeftScroll * $this.def.scrollBarCoefH));
        if (s < 0 && s > -$this.def.diffH) {
          $this._scroll = s;
        }
      }
    }
    if ($this.eventFrom === 'drag') {
      if ($this.classList.contains('horizontal')) {
        s = (e.pageX - $this.catchedOffset) + ($this.eventFrom === 'wrapper' ? $this.catchedLeftScroll : -($this.catchedLeftScroll * $this.def.scrollBarCoef));
        s = s * $this.def.scrollBarCoefRev;
        if (-s < 0 && ((-s > -$this.def.diff) || (s < $this.def.diff))) {
          $this._scroll = -s;
        }
      } else if ($this.classList.contains('vertical')) {
        s = (e.pageY - $this.catchedOffsetH) + ($this.eventFrom === 'wrapper' ? $this.catchedLeftScroll : -($this.catchedLeftScroll * $this.def.scrollBarCoefH));
        s = s * $this.def.scrollBarCoefRevH;
        if (-s < 0 && ((-s > -$this.def.diffH) || (s < $this.def.diffH))) {
          $this._scroll = -s;
        }
      }
    }
    $this.updateScrollDef(true);
    return $this.updateDrags();
  };
  this.addEventListeners = function() {
    this.wrapper.on('mousedown', function(e) {
      $this.catchedOffset = e.pageX;
      $this.catchedOffsetH = e.pageY;
      $this.catchedLeftScroll = $this._scroll;
      $this.eventFrom = 'wrapper';
      $this.wrapper.on('mousemove', onmove);
      return $this.classList.add('catched');
    });
    this.wrapper.on('mouseup', function(e) {
      $this.wrapper.off('mousemove', onmove);
      return $this.classList.remove('catched');
    });
    this.anchors[0].on('mousedown', function(e) {
      $this.catchedOffset = e.pageX;
      $this.catchedOffsetH = e.pageY;
      $this.catchedLeftScroll = $this._scroll;
      $this.eventFrom = 'drag';
      return document.on('mousemove', onmove);
    });
    document.on('mouseup', function(e) {
      return document.off('mousemove', onmove);
    });
    this.arrows[0].on('click', function(e) {
      e.preventDefault();
      if ($this.classList.contains('horizontal')) {
        if ($this._scroll + (SCROLL / 10) < 0) {
          $this._scroll += SCROLL / 10;
        } else {
          $this._scroll += -$this._scroll;
        }
      } else if ($this.classList.contains('vertical')) {
        if ($this._scroll + (SCROLL / 10) < 0) {
          $this._scroll += SCROLL / 10;
        } else {
          $this._scroll += -$this._scroll;
        }
      }
      $this.updateScrollDef(true);
      return $this.updateDrags();
    });
    this.arrows[1].on('click', function(e) {
      e.preventDefault();
      if ($this.classList.contains('horizontal')) {
        if ($this._scroll - (SCROLL / 10) > -$this.def.diff) {
          $this._scroll -= SCROLL / 10;
        } else {
          $this._scroll -= $this.def.diff - (-$this._scroll);
        }
      } else if ($this.classList.contains('vertical')) {
        if ($this._scroll - (SCROLL / 10) > -$this.def.diffH) {
          $this._scroll -= SCROLL / 10;
        } else {
          $this._scroll -= $this.def.diffH - (-$this._scroll);
        }
      }
      $this.updateScrollDef(true);
      return $this.updateDrags();
    });
    return this.wheel(function(delta, direct) {
      var coef;
      coef = [];
      coef[0] = $this.def.diff - (-$this._scroll) > SCROLL ? SCROLL : $this.def.diff - (-$this._scroll);
      coef[1] = $this._scroll < -SCROLL ? SCROLL : -$this._scroll;
      coef[2] = $this.def.diffH - (-$this._scroll) > SCROLL ? SCROLL : $this.def.diffH - (-$this._scroll);
      coef[3] = $this._scroll < -SCROLL ? SCROLL : -$this._scroll;
      if ($this.classList.contains('horizontal')) {
        if (delta > 0 && $this._scroll > -$this.def.diff) {
          $this._scroll -= coef[0];
        } else if (delta < 0 && $this._scroll < 0) {
          $this._scroll += coef[1];
        }
        $this.wrapper.translateNode($this._scroll + "px,0");
      } else if ($this.classList.contains('vertical')) {
        if (delta > 0 && $this._scroll > -$this.def.diffH) {
          $this._scroll -= coef[2];
        } else if (delta < 0 && $this._scroll < 0) {
          $this._scroll += coef[3];
        }
        $this.wrapper.translateNode("0," + $this._scroll + "px");
      }
      $this.updateDrags();
    });
  };
  if (_windowWidth() > 800) {
    this.addEventListeners();
  }
  console.log(_windowWidth());
  return this.destroy = function() {
    $this.removeEventListener('onwheel');
    $this.removeEventListener('onmousewheel');
    $this.removeEventListener('mousewheel');
    $this.removeEventListener('MozMousePixelScroll');
    $this.removeEventListener('onmousewheel');
    $this.wrapper.removeEventListener('onwheel');
    $this.wrapper.removeEventListener('onmousewheel');
    $this.wrapper.removeEventListener('mousewheel');
    $this.wrapper.removeEventListener('MozMousePixelScroll');
    return $this.wrapper.removeEventListener('onmousewheel');
  };
};

Object.prototype.stylesToAttributes = function() {};

Object.prototype.getCoordinates = function(e) {
  return this.box = this.getBoundingClientRect();
};

Object.prototype.makeWindow = function(options) {
  var $this, windowDrag;
  $this = this;
  options = options || {};
  options.surrounded = options.surrounded || false;
  $this.box = $this.getBoundingClientRect();
  $this.header = $('.window-header', $this);
  $this.X = 0;
  $this.buttons = {
    minimize: _$('.window-minimize', $this),
    toggle: _$('.window-toggle', $this),
    close: _$('.window-close', $this)
  };
  $this.buttons.minimize.on('mousedown', function(e) {
    $this.classList.add('hidden');
    return e.preventDefault();
  });
  $this.buttons.close.on('mousedown', function(e) {
    var elem;
    $this.classList.add('hidden');
    elem = _$('[data-starter*="' + $this.id + '"]');
    elem.classList.remove(elem.getAttribute('data-color-class'));
    elem.classList.remove('active');
    return e.preventDefault();
  });
  $this.buttons.toggle.on('mousedown', function(e) {
    var rect;
    rect = $this.getBoundingClientRect();
    $this.classList.toggle('full-space');
    if ($this.classList.contains('full-space')) {
      $this.setAttribute('data-cache', rect.top + "," + rect.left);
    } else {
      rect = $this.getAttribute('data-cache').split(',');
      $this.style.top = rect[0];
      $this.style.left = rect[1];
    }
    setTimeout(function() {
      return _$('.scroller', $this).reinit();
    }, 310);
    return e.preventDefault();
  });
  windowDrag = function(e) {
    var box, i, len, ref, sumX, sumY, w;
    box = $this.getBoundingClientRect();
    if (options.surrounded) {
      sumX = e.pageX - (e.pageX - box.left) + $this.clientWidth;
      sumY = e.pageY - (e.pageY - box.top) + $this.clientHeight;
      if ($('.desktop').clientHeight > sumY) {
        $this.Y = -(e.pageY - $this.y) < $this.box.top ? e.pageY - $this.y : -$this.box.top;
      } else {
        $this.Y = $('.desktop').clientHeight - $this.box.top - $this.box.height;
      }
      if ($('.desktop').clientWidth > sumX) {
        $this.X = -(e.pageX - $this.x) < $this.box.left ? e.pageX - $this.x : -$this.box.left;
      } else {
        $this.X = $('.desktop').clientWidth - $this.box.left - $this.box.width;
      }
    } else {
      $this.Y = -(e.pageY - $this.y) < $this.box.top ? e.pageY - $this.y : -$this.box.top;
      $this.X = -(e.pageX - $this.x) < $this.box.left ? e.pageX - $this.x : -$this.box.left;
    }
    if (_$('.window').length) {
      ref = _$('.window');
      for (i = 0, len = ref.length; i < len; i++) {
        w = ref[i];
        w.classList.remove('on-top');
      }
    } else {
      _$('.window').classList.remove('on-top');
    }
    $this.classList.add('on-top');
    $this.style.transform = "translate(" + $this.X + "px," + $this.Y + "px)";
    ACTIVE_WINDOW.style.top = $this.box.top + 'px';
    return ACTIVE_WINDOW.style.left = $this.box.left + 'px';
  };
  if (!$this.classList.contains('full')) {
    $this.header.on('mousedown', function(e) {
      if (!$this.classList.contains('hidden')) {
        $this.getCoordinates(e);
        $this.x = e.pageX;
        $this.y = e.pageY;
        if (ACTIVE_WINDOW === null) {
          ACTIVE_WINDOW = $this;
          $this.classList.add('unshadowed');
        }
        return document.on('mousemove', windowDrag);
      }
    });
    return document.on('mouseup', function(e) {
      var box;
      if (ACTIVE_WINDOW !== null) {
        box = ACTIVE_WINDOW.getBoundingClientRect();
        ACTIVE_WINDOW.style.top = (ACTIVE_WINDOW.box.top + ACTIVE_WINDOW.Y >= 0 ? ACTIVE_WINDOW.box.top + ACTIVE_WINDOW.Y - 0.2 : 0) + 'px';
        ACTIVE_WINDOW.style.left = (ACTIVE_WINDOW.box.left + ACTIVE_WINDOW.X >= 0 ? ACTIVE_WINDOW.box.left + ACTIVE_WINDOW.X - 0.1 : 0) + 'px';
        ACTIVE_WINDOW.style.transform = '';
        setTimeout(function() {
          if (ACTIVE_WINDOW !== null) {
            ACTIVE_WINDOW.classList.remove('unshadowed');
            return ACTIVE_WINDOW = null;
          }
        }, 100);
      }
      return document.off('mousemove', windowDrag);
    });
  }
};

_setAlignedMargin = function() {
  var block, i, len, ref, results;
  if (_$('.center-aligned').length) {
    ref = _$('.center-aligned');
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      block = ref[i];
      results.push(block.style.marginTop = (-block.clientHeight / 2) + 'px');
    }
    return results;
  } else {
    return _$('.center-aligned').style.marginTop = (-_$('.center-aligned').clientHeight / 2) + 'px';
  }
};

if (_$('.center-aligned')) {
  _setAlignedMargin();
}

TilityInitComponents = function() {
  var i, len, li, ref, results;
  document.on('keyup', function(e) {
    if (e.keyCode === 27) {
      return _$('.window.full').classList.add('hidden');
    }
  });
  window.on('resize', function() {
    return waitForFinalEvent(function() {
      var _s, i, j, len, len1, ref, ref1, results, results1;
      _setAlignedMargin();
      if (_windowWidth() > 800) {
        if (_$('.scroller').length) {
          ref = _$('.scroller');
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            _s = ref[i];
            results.push(_s.reinit());
          }
          return results;
        } else {
          return _$('.scroller').reinit();
        }
      } else {
        if (_$('.scroller').length) {
          ref1 = _$('.scroller');
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            _s = ref1[j];
            results1.push(_s.destroy());
          }
          return results1;
        } else {
          return _$('.scroller').destroy();
        }
      }
    }, 500, '');
  });
  if (_$('.bar ul li') !== null) {
    ref = _$('.bar ul li');
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      li = ref[i];
      results.push(li.addEventListener('click', function(e) {
        var elem;
        if (_$(this.getAttribute('data-starter')) !== void 0) {
          elem = _$(this.getAttribute('data-starter'));
          elem.classList.toggle('hidden');
          this.classList.add(this.getAttribute('data-color-class'));
          this.classList.add('active');
          if (_$('.scroller', elem) !== null && _$('.scroller', elem).reinit() !== void 0) {
            _$('.scroller', elem).reinit();
          }
        }
        return e.preventDefault();
      }));
    }
    return results;
  }
};
