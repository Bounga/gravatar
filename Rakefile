require 'rake'
require 'rake/testtask'
require 'rake/rdoctask'

desc "Generates documentation"
task :doc => :dist do
  require 'pdoc'
  
  PDoc.run({
    :source_files => Dir.glob(File.join("src", "**", "*.js")),
    :destination => 'doc',
    :syntax_highlighter => :pygments,
    :markdown_parser => :maruku,
    :pretty_urls => false,
    :bust_cache => true,
    :name => "Bounga's Gravatar lib",
    :short_name => 'Gravatar',
    :home_url => 'http://bitbucket.org/Bounga/gravatar/',
    :version => "0.1.0",
    :copyright_notice => 'This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/MIT/">MIT License</a>.' 
  })
end

desc "Alias for doc"
task :default => :doc


desc "Build all dist files"
task :build => :'build:packed'

desc "Alias for build"
task :dist => :build

DIST_DIRECTORY      = 'dist'
DIST_FILES          = %w(gravatar.js)
DIST_OUTPUT         = File.join(DIST_DIRECTORY, 'gravatar.js')
PACKED_DIST_OUTPUT  = File.join(DIST_DIRECTORY, 'gravatar_packed.js')

YUI_COMPRESSOR      = 'java -jar lib/yuicompressor/yuicompressor-2.3.5.jar'

namespace :build do
  def concat_files(files, output)
    FileUtils.mkdir_p(File.dirname(output))
    
    file = File.new(output, 'w')
    files.each do |f|
      file << "\n" << File.read(File.join('src', f))
    end
    file.close
  end
  
  desc "Builds dist file (not compressed)"
  task :unpacked do
    concat_files(DIST_FILES, DIST_OUTPUT)
  end
  
  desc "Builds base dist file (compressed by yui compressor)"
  task :packed => :unpacked do
    system "#{YUI_COMPRESSOR} #{DIST_OUTPUT} > #{PACKED_DIST_OUTPUT}"
  end 
end