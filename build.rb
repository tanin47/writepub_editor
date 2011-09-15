def run_command(cmd)
  puts cmd
  system(cmd)
end

def generate_minified_filename(f)
  dir = File.dirname(f)
  name = File.basename(f)
  
  tokens = name.split(".")
  
  if tokens.length == 1
    return "#{name}-min"
  else
    return "#{dir}/production/#{tokens[0..-2].join(".")}-min.#{tokens[-1]}"
  end
  
end

Dir[File.expand_path("../*.js", __FILE__)].each { |f| 
  run_command("java -jar yuicompressor-2.4.6.jar \"#{f}\" -o \"#{generate_minified_filename(f)}\" --charset utf-8")
}

Dir[File.expand_path("../*.css", __FILE__)].each { |f| 
  run_command("java -jar yuicompressor-2.4.6.jar \"#{f}\" -o \"#{generate_minified_filename(f)}\" --charset utf-8")
}