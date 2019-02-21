alias old_puts puts
def puts(*things)
	things.each do |thing|
		old_puts "#=> #{thing}"
	end
	nil
end

old_puts '```rb'
begin
	result = eval Hook['params']['code'] || ''
	old_puts result.inspect
rescue Exception => e
	old_puts "#{e.class.name}: #{e.message}"
end
old_puts '```'
