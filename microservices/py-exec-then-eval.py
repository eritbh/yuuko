import ast

def comment_print(*things):
	print('#=>', *things)

def exec_then_eval(code):
	try:
		block = ast.parse(code, mode='exec')
	except Exception as e:
		print(repr(e))
		return

	try:
		last = ast.Expression(block.body.pop().value)
	except Exception as e:
		last = None

	_globals = {}
	_locals = {'print': comment_print}

	try:
		exec(compile(block, '<string>', mode='exec'), _globals, _locals)
		if last:
			print(repr(eval(compile(last, '<string>', mode='eval'), _globals, _locals)))
		else:
			print('<no returned value>')
	except Exception as e:
		print(repr(e))

try:
	code = Hook['params']['code']
except:
	code = ''

print('```py')
exec_then_eval(code)
print('```')
