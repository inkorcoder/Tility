# ---------------------------------------------------------
# variables
# ---------------------------------------------------------



# ---------------------------------------------------------
# helpers
# ---------------------------------------------------------

$$ = (selector)->
	result = null
	if selector[0] is '#'
		result = document.getElementById selector.substr(1)
	else
		result = document.body.getElementsByClassName selector.substr(1)
	return if result.length > 1 then result else result[0]

$ = (selector, ctx)->
	if ctx
		result = ctx.querySelectorAll selector
	else result = document.querySelectorAll selector
	return if result.length > 1 then result else result[0]

windowWidth = ->
	w = 0
	if window.innerWidth > window.outerWidth
		w = window.outerWidth
	else
		w = window.innerWidth
	return w

windowHeight = ->
	w = 0
	if window.innerHeight > window.outerHeight
		w = window.outerHeight
	else
		w = window.innerHeight
	return w

# ---------------------------------------------------------
# Main
# ---------------------------------------------------------


document.on 'DOMContentLoaded', ->

	# scroller = $ '#scroller1'
	# scroller2 = $ '#scroller2'

	# console.log scroller1, scroller2

	$('#scroller1').enableScroller()
	$('#scroller2').enableScroller()
	$('#scroller3').enableScroller()

	$ '#skype'
		.makeWindow
			surrounded: on

	$ '#tiles'
		.makeWindow()

	# 		# sticky: 20

	$ '#window'
		.makeWindow()




	TilityInitComponents()

	# window.on 'resize', ->
	# 	waitForFinalEvent ->
	# 		$('#scroller1').reinit()
	# 		$('#scroller2').reinit()
	# 	, 500, ''

	# window.dispatchEvent new Event 'resize'
	return
