SCROLL = 200
ACTIVE_WINDOW = null

_$ = (selector, ctx)->
	if ctx
		result = ctx.querySelectorAll selector
	else result = document.querySelectorAll selector
	return if result.length > 1 then result else result[0]



_windowWidth = ->
	w = 0
	if window.innerWidth > window.outerWidth
		w = window.outerWidth
	else
		w = window.innerWidth
	return w

# ---------------------------------------------------------
# Extend object
# ---------------------------------------------------------

Object.prototype.on = (ev, handler)->
	this.addEventListener ev, handler

Object.prototype.off = (ev, handler)->
	if handler then this.removeEventListener ev, handler
	else this.removeEventListener ev

Object.prototype.updateScrollDef = (isPrivate)->

	this.def =
		# horizontal
		sw: this.scrollWidth - (
			if !isPrivate
				if this.wrapper then this._scroll else 0
			else 0
		)
		cw: this.clientWidth
		# vertical
		sh: this.scrollHeight - (
			if !isPrivate
				if this.wrapper then this._scroll else 0
			else 0
		)
		ch: this.clientHeight

	# horizontal
	this.def.coef = this.def.cw / this.def.sw
	this.def.scrollBarCoef = this.scrollbar.clientWidth / this.def.sw
	this.def.scrollBarCoefRev = this.def.sw / this.scrollbar.clientWidth
	this.def.diff = this.def.sw - this.def.cw
	# vertical
	this.def.coefH = this.def.ch / this.def.sh
	this.def.scrollBarCoefH = this.scrollbar.clientHeight / this.def.sh
	this.def.scrollBarCoefRevH = this.def.sh / this.scrollbar.clientHeight
	this.def.diffH = this.def.sh - this.def.ch

	# console.log this.classList

	if this.wrapper and this.classList.contains 'horizontal'
		this.wrapper.translateNode "#{this._scroll}px,0"
	else if this.wrapper and this.classList.contains 'vertical'
		this.wrapper.translateNode "0,#{this._scroll}px"

	if this.anchors and this.anchors[0] and this.classList.contains 'horizontal'
		this.anchors[0].setAttribute 'style', 'width:'+(this.def.coef*100)+'%;'
	if this.anchors and this.anchors[0] and this.classList.contains 'vertical'
		this.anchors[0].setAttribute 'style', 'height:'+(this.def.coefH*100)+'%;'


Object.prototype.updateDrags = ->
	if this.classList.contains 'horizontal'
		if this.def.sw <= this.def.cw
			this.anchors[0].parentNode.classList.add 'hidden'
		else
			this.anchors[0].parentNode.classList.remove 'hidden'
			this.anchors[0].setAttribute 'style', "
				width:#{((this.def.coef)*100)}%;
				left:#{(-this._scroll)*this.def.scrollBarCoef}px;
			"
	else if this.classList.contains 'vertical'
		if this.def.sh <= this.def.ch
			this.anchors[0].parentNode.classList.add 'hidden'
		else
			this.anchors[0].parentNode.classList.remove 'hidden'
			this.anchors[0].setAttribute 'style', "
				height:#{((this.def.coefH)*100)}%;
				top:#{(-this._scroll)*this.def.scrollBarCoefH}px;
			"

Object.prototype.translateNode = (str)->
	this.style.transform = "translate(#{str})"

Object.prototype.enableScroller = ->

	this.anchors = []
	this.arrows = []

	this.anchors[0] = $ '.scrollbar .scrollbar-anchor', this
	this.scrollbar = $ '.scrollbar .scrollbar-drag', this
	this.arrows[0] = $ '.scrollbar .scrollbar-arrow.left', this
	this.arrows[1] = $ '.scrollbar .scrollbar-arrow.right', this
	this.anchors[0].parent = this
	this.wrapper = $ '.scroll-wrapper', this
	this.wrapper.parent = this
	this._scroll = 0
	this.updateScrollDef()


	$this = this
	this.reinit = ->
		$this._scroll = 0
		if _windowWidth() > 800 then $this.addEventListeners()
		$this.updateScrollDef()
		$this.updateDrags()

	onmove = (e)->
		# if swipe
		if $this.eventFrom is 'wrapper'
			# horizontal
			if $this.classList.contains 'horizontal'
				s = (e.pageX - $this.catchedOffset) + if $this.eventFrom is 'wrapper' then $this.catchedLeftScroll else -($this.catchedLeftScroll * $this.def.scrollBarCoef)
				if s < 0 and s > -$this.def.diff
					$this._scroll = s
			# vertical
			else if $this.classList.contains 'vertical'
				s = (e.pageY - $this.catchedOffsetH) + if $this.eventFrom is 'wrapper' then $this.catchedLeftScroll else -($this.catchedLeftScroll * $this.def.scrollBarCoefH)
				if s < 0 and s > -$this.def.diffH
					$this._scroll = s

		# if scrollbar
		if $this.eventFrom is 'drag'
			# horizontal
			if $this.classList.contains 'horizontal'
				s = (e.pageX - $this.catchedOffset) + if $this.eventFrom is 'wrapper' then $this.catchedLeftScroll else -($this.catchedLeftScroll * $this.def.scrollBarCoef)
				s = s * $this.def.scrollBarCoefRev
				if -s < 0 and ((-s > -$this.def.diff) or (s < $this.def.diff))
					$this._scroll = -s
			# vertical
			else if $this.classList.contains 'vertical'
				s = (e.pageY - $this.catchedOffsetH) + if $this.eventFrom is 'wrapper' then $this.catchedLeftScroll else -($this.catchedLeftScroll * $this.def.scrollBarCoefH)
				s = s * $this.def.scrollBarCoefRevH
				if -s < 0 and ((-s > -$this.def.diffH) or (s < $this.def.diffH))
					$this._scroll = -s

		$this.updateScrollDef on
		$this.updateDrags()

	this.addEventListeners = ->
		this.wrapper.on 'mousedown', (e)->
			$this.catchedOffset = e.pageX
			$this.catchedOffsetH = e.pageY
			$this.catchedLeftScroll = $this._scroll
			$this.eventFrom = 'wrapper'
			$this.wrapper.on 'mousemove', onmove
			$this.classList.add 'catched'

		this.wrapper.on 'mouseup', (e)->
			$this.wrapper.off 'mousemove', onmove
			$this.classList.remove 'catched'

		this.anchors[0].on 'mousedown', (e)->
			$this.catchedOffset = e.pageX
			$this.catchedOffsetH = e.pageY
			$this.catchedLeftScroll = $this._scroll
			$this.eventFrom = 'drag'
			document.on 'mousemove', onmove

		document.on 'mouseup', (e)->
			document.off 'mousemove', onmove

		this.arrows[0].on 'click', (e)->
			e.preventDefault()
			# horizontal
			if $this.classList.contains 'horizontal'
				if $this._scroll+(SCROLL/10) < 0
					$this._scroll += SCROLL/10
				else $this._scroll += -$this._scroll
			# vertical
			else if $this.classList.contains 'vertical'
				if $this._scroll+(SCROLL/10) < 0
					$this._scroll += SCROLL/10
				else $this._scroll += -$this._scroll
			$this.updateScrollDef on
			$this.updateDrags()

		this.arrows[1].on 'click', (e)->
			e.preventDefault()
			# horizontal
			if $this.classList.contains 'horizontal'
				if $this._scroll-(SCROLL/10) > -$this.def.diff
					$this._scroll -= SCROLL/10
				else $this._scroll -= $this.def.diff-(-$this._scroll)
			# vertical
			else if $this.classList.contains 'vertical'
				if $this._scroll-(SCROLL/10) > -$this.def.diffH
					$this._scroll -= SCROLL/10
				else $this._scroll -= $this.def.diffH-(-$this._scroll)

			$this.updateScrollDef on
			$this.updateDrags()

		this.wheel (delta, direct)->

			coef = []
			coef[0] = if $this.def.diff - (-$this._scroll) > SCROLL then SCROLL else $this.def.diff - (-$this._scroll)
			coef[1] = if $this._scroll < -SCROLL then SCROLL else -$this._scroll
			coef[2] = if $this.def.diffH - (-$this._scroll) > SCROLL then SCROLL else $this.def.diffH - (-$this._scroll)
			coef[3] = if $this._scroll < -SCROLL then SCROLL else -$this._scroll

			if $this.classList.contains 'horizontal'
				if delta > 0 and $this._scroll > -$this.def.diff
					$this._scroll -= coef[0]
				else if delta < 0 and $this._scroll < 0
					$this._scroll += coef[1]
				$this.wrapper.translateNode "#{$this._scroll}px,0"
			
			else if $this.classList.contains 'vertical'
				if delta > 0 and $this._scroll > -$this.def.diffH
					$this._scroll -= coef[2]
				else if delta < 0 and $this._scroll < 0
					$this._scroll += coef[3]
				$this.wrapper.translateNode "0,#{$this._scroll}px"



			$this.updateDrags()

			return

	if _windowWidth() > 800 then this.addEventListeners()
	console.log _windowWidth()

	this.destroy = ->
		$this.removeEventListener 'onwheel'
		$this.removeEventListener 'onmousewheel'
		$this.removeEventListener 'mousewheel'
		$this.removeEventListener 'MozMousePixelScroll'
		$this.removeEventListener 'onmousewheel'
		$this.wrapper.removeEventListener 'onwheel'
		$this.wrapper.removeEventListener 'onmousewheel'
		$this.wrapper.removeEventListener 'mousewheel'
		$this.wrapper.removeEventListener 'MozMousePixelScroll'
		$this.wrapper.removeEventListener 'onmousewheel'


Object.prototype.stylesToAttributes = ->

	return

Object.prototype.getCoordinates = (e)->
	this.box = this.getBoundingClientRect()

Object.prototype.makeWindow = (options)->

	$this = this

	options = options || {}

	options.surrounded = options.surrounded || off
	# options.sticky = (if options.sticky < 0 then -options.sticky else options.sticky) || 0

	$this.box = $this.getBoundingClientRect()
	$this.header = $ '.window-header', $this
	$this.X = 0
	# $this.stylesToAttributes()
		# $this.stye.height = $this.style.height
	# $this.style.width
	# console.dir $this.box

	$this.buttons =
		minimize: _$('.window-minimize', $this)
		toggle: _$('.window-toggle', $this)
		close: _$('.window-close', $this)

	$this.buttons.minimize.on 'mousedown', (e)->
		$this.classList.add 'hidden'
		e.preventDefault()

	$this.buttons.close.on 'mousedown', (e)->
		$this.classList.add 'hidden'
		elem = _$ '[data-starter*="'+$this.id+'"]'
		elem.classList.remove elem.getAttribute 'data-color-class'
		elem.classList.remove 'active'
		e.preventDefault()

	$this.buttons.toggle.on 'mousedown', (e)->
		rect = $this.getBoundingClientRect()
		$this.classList.toggle 'full-space'
		if $this.classList.contains 'full-space'
			$this.setAttribute 'data-cache', "#{rect.top},#{rect.left}"
		else
			rect = $this.getAttribute('data-cache').split ','
			$this.style.top = rect[0]
			$this.style.left = rect[1]
		setTimeout ->
			_$('.scroller', $this).reinit()
		, 310
		e.preventDefault()


	windowDrag = (e)->
		box = $this.getBoundingClientRect()
		# console.dir box

		if options.surrounded
			sumX = e.pageX - (e.pageX - box.left) + $this.clientWidth
			sumY = e.pageY - (e.pageY - box.top) + $this.clientHeight
			if $('.desktop').clientHeight > sumY
				$this.Y = if -(e.pageY-$this.y) < $this.box.top then e.pageY-$this.y else -$this.box.top
			else $this.Y = $('.desktop').clientHeight - $this.box.top - $this.box.height
			if $('.desktop').clientWidth > sumX
				$this.X = if -(e.pageX-$this.x) < $this.box.left then e.pageX-$this.x else -$this.box.left
			else $this.X = $('.desktop').clientWidth - $this.box.left - $this.box.width
		else
			$this.Y = if -(e.pageY-$this.y) < $this.box.top then e.pageY-$this.y else -$this.box.top
			$this.X = if -(e.pageX-$this.x) < $this.box.left then e.pageX-$this.x else -$this.box.left

		# $this.setAttribute 'style', "
		# 	transform: translate(#{$this.X}px,#{$this.Y}px);
		# "
		if _$('.window').length
			for w in _$('.window')
				w.classList.remove 'on-top'
		else _$('.window').classList.remove 'on-top'

		$this.classList.add 'on-top'

		$this.style.transform = "translate(#{$this.X}px,#{$this.Y}px)"

		ACTIVE_WINDOW.style.top = $this.box.top+'px'
		ACTIVE_WINDOW.style.left = $this.box.left+'px'


	if !$this.classList.contains 'full'

		$this.header.on 'mousedown', (e)->

			if !$this.classList.contains 'hidden'

				$this.getCoordinates(e)
				$this.x = e.pageX
				$this.y = e.pageY
				# console.log $this
				if ACTIVE_WINDOW is null
					ACTIVE_WINDOW = $this
					$this.classList.add 'unshadowed'
				document.on 'mousemove', windowDrag

		document.on 'mouseup', (e)->

			if ACTIVE_WINDOW isnt null
				box = ACTIVE_WINDOW.getBoundingClientRect()
				# ACTIVE_WINDOW.setAttribute 'style', "
				# 	transform: translate(0,0);
				# "
				ACTIVE_WINDOW.style.top = (
					if ACTIVE_WINDOW.box.top+ACTIVE_WINDOW.Y >= 0 then ACTIVE_WINDOW.box.top+ACTIVE_WINDOW.Y-0.2 else 0
				)+'px'
				ACTIVE_WINDOW.style.left = (
					if ACTIVE_WINDOW.box.left+ACTIVE_WINDOW.X >= 0 then ACTIVE_WINDOW.box.left+ACTIVE_WINDOW.X-0.1 else 0
				)+'px'
				ACTIVE_WINDOW.style.transform = ''
				setTimeout ->
					if ACTIVE_WINDOW isnt null
						ACTIVE_WINDOW.classList.remove 'unshadowed'
						ACTIVE_WINDOW = null
				, 100
			document.off 'mousemove', windowDrag
# ---------------------------------------------------------
# Auto init components
# ---------------------------------------------------------

_setAlignedMargin = ->
	if _$('.center-aligned').length
		for block in _$('.center-aligned')
			block.style.marginTop = (-block.clientHeight/2)+'px'
	else
		_$('.center-aligned').style.marginTop = (-_$('.center-aligned').clientHeight/2)+'px'

if _$('.center-aligned')
	_setAlignedMargin()

TilityInitComponents = ->

	document.on 'keyup', (e)->
		if e.keyCode is 27
			_$('.window.full').classList.add 'hidden'

	window.on 'resize', ->
		waitForFinalEvent ->
			_setAlignedMargin()

			# if _$('.window').length
			# 	for _s in _$('.window')
			# 		_s.style.width = windowWidth()+'px'
			# else
			# 	_$('.window').style.width = windowWidth()+'px'

			if _windowWidth() > 800
				if _$('.scroller').length
					for _s in _$('.scroller')
						_s.reinit()
				else
					_$('.scroller').reinit()
			else
				if _$('.scroller').length
					for _s in _$('.scroller')
						_s.destroy()
				else
					_$('.scroller').destroy()

		, 500, ''

	if _$('.bar ul li') isnt null
		for li in _$ '.bar ul li'
			li.addEventListener 'click', (e)->
				if _$(this.getAttribute('data-starter')) isnt undefined
					elem = _$ this.getAttribute 'data-starter'
					elem.classList.toggle 'hidden'
					this.classList.add this.getAttribute 'data-color-class'
					this.classList.add 'active'
					if _$('.scroller', elem) isnt null and _$('.scroller', elem).reinit() isnt undefined
						_$('.scroller', elem).reinit()
				e.preventDefault()