#!/usr/bin/env ruby
require 'ftools'
require 'fssm'
LIB_PATH = File.join(File.dirname(__FILE__), 'lib')
BUILD_PATH = File.join(File.dirname(__FILE__), 'build')
WARN = "\n/////////////// DO NOT EDIT, FILE IS GENERATED ///////////////\n"
HEADER = File.read(File.join(LIB_PATH,'HEADER'))
FOOTER = File.read(File.join(LIB_PATH,'FOOTER'))    


class CSSTOKENIZERTasks
  def initialize
    @merged = []
    @compressed = ''
  end
  def build
    puts "building..."
    @busy = true
    @merged = []
    @compressed = ''
    make_build_dirs
    merge_scripts
    make_compressed
    make_files
    puts "...done!"    
  end
  def watch
    FSSM.monitor(LIB_PATH, '*.js') do
      update {|base, relative| CSSTOKENIZER.build }
      delete {|base, relative| CSSTOKENIZER.build }
      create {|base, relative| CSSTOKENIZER.build }
    end
     FSSM.monitor(LIB_PATH,'processors', '*.js') do
        update {|base, relative| CSSTOKENIZER.build }
        delete {|base, relative| CSSTOKENIZER.build }
        create {|base, relative| CSSTOKENIZER.build }
      end
  end
  
  private
  def merge_scripts    
    @merged << File.read(File.join(LIB_PATH,'tokenizer.js'))
    @merged = "#{WARN}#{HEADER}\n(function(window,undefined){\n#{@merged.join("\n").strip}\n})(this);\n#{FOOTER}"
  end
  def make_compressed
    require "yui/compressor"
    compressor = YUI::JavaScriptCompressor.new
    @compressed = compressor.compress(@merged)
  end
  def make_files
    File.open(File.join(BUILD_PATH,'sheetscribe.js'), 'w') do |f|
      f.write(@merged)
    end
    File.open(File.join(BUILD_PATH,'sheetscribe-compressed.js'), 'w') do |f| 
      f.write(@compressed)
    end
   
  end
  def make_build_dirs
      File.makedirs(BUILD_PATH)
  end
end
CSSTOKENIZER = CSSTOKENIZERTasks.new
desc "Build the necessary files"
task :build do 
  CSSTOKENIZER.build
end

desc "Watch the lib dir and regenerate as it changes"
task :watch do  
  CSSTOKENIZER.watch
end
