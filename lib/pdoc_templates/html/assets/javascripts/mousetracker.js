
// (c) Copyright 2009 Nicolas Cavigneaux. All Rights Reserved.
// released under MIT License

// This lib allow you to create mouse tracker (div or image that follows your mouse moves)
// It requires MooTools >= 1.2

// Ensure MooTools is loaded
if (typeof MooTools == 'undefined') { throw 'MooTools must be loaded in order to use MouseTracker!'}

/**
 *  == base ==
 *  The main section
**/

/** section: base
 * Bounga
 *  
**/
if (typeof Bounga == 'undefined') {
 Bounga = {};
}

/** section: base
 * class Bounga.MouseTracker
 * 
 * Class to add "MouseTracker" behavior to your mouse. no HTML markup is needed.
 *  
 * It creates a div or an image (depending on given options) that will follow your mouse gestures.
 * 
 * Default options are:
 *  <table class='options'>
 *  <tr>
 *    <th>Name</th>
 *    <th>Default value</th>
 *    <th>Description</th>
 *  </tr>
 *    <tr>
 *      <td>id</td>
 *      <td>null</td>
 *      <td>DOM id for the tracker</td>
 *    </tr>
 *    <tr>
 *      <td>class</td>
 *      <td>null</td>
 *      <td>CSS class for the tracker</td>
 *    </tr>
 *    <tr>
 *      <td>delay</td>
 *      <td>200</td>
 *      <td>Delay between the end of your mouse gesture and the beginning of the tracker moves</td>
 *    </tr>
 *    <tr>
 *      <td>offset</td>
 *      <td>{ x : -20, y : 20 }</td>
 *      <td>Offset to apply between your mouse pointer and the tracker</td>
 *    </tr>
 *    <tr>
 *      <td>top</td>
 *      <td>-1000</td>
 *      <td>Initial 'top' value</td>
 *    </tr>
 *    <tr>
 *      <td>left</td>
 *      <td>-1000</td>
 *      <td>Initial left value</td>
 *    </tr>
 *    <tr>
 *      <td>position</td>
 *      <td>'absolute'</td>
 *      <td>Positioning method (absolute or relative). Should be left as 'absolute' unless you know what you're doing</td>
 *    </tr>
 *    <tr>
 *      <td>color</td>
 *      <td>'#666'</td>
 *      <td>Color that will be use to fill the tracker div</td>
 *    </tr>
 *    <tr>
 *      <td>size</td>
 *      <td>20</td>
 *      <td>Size (height and width) to use for the tracker div</td>
 *    </tr>
 *    <tr>
 *      <td>z-index</td>
 *      <td>20</td>
 *      <td>Tracker z-index</td>
 *    </tr>
 *    <tr>
 *      <td>image</td>
 *      <td>null</td>
 *      <td>Path to the image to use (replaces the div)</td>
 *    </tr>
 *  </table>  
 *
 * Usage examples :
 *
 * <pre>
 * new MouseTracker();
 * </pre>
 *
 * If you want to change default settings all you need to do is pass an ‘options’ object:
 *
 * <pre>
 * new Bounga.MouseTracker({delay: 400, color: '#33FF00'});
 * new Bounga.MouseTracker({delay: 300, color: '#FF3300', 'offset': {x: 30, y: -20 }, 'size': 10});
 * new Bounga.MouseTracker({delay: 200, color: '#3300FF', 'offset': {x: 10, y: 0}, 'size': 35});
 * new Bounga.MouseTracker({delay: 0, image: 'cat.gif'});
 * </pre>
 * 
 **/
 
 /** section: base
 *  new Bounga.MouseTracker([options])
 *  - options (Hash): override default options
 *  
 *  Creates a new Bounga.MouseTracker
 *  
 **/
Bounga.MouseTracker = new Class({
  
    Implements: [Options],
    points: [],
    tracepoints: [],
    boundElement: null,
    options: {
      'id': null,
      'class': null,
      'delay': 200,
      'offset': { x : -20, y : 20 },
      'top': -1000,
      'left': -1000,
      'position': 'absolute',
      'color': '#666',
      'size': 20,
      'z-index': 20,
      'image': null
    },
 
    initialize: function(options){
      this.setOptions(options);
      
      // Common options for images and divs
      var common_options = {
        'id': this.options['id'],
        'class': this.options['class'],
        'styles': {
          'position': this.options.position,
          'top': this.options.top,
          'left': this.options.left,
          'z-index': this.options['z-index']
        }
      };
      
      // Wants an image ?
      if ($chk(this.options.image)) {
        var image_options = {'src': this.options.image};
        this.cursor = new Element('img', $merge(common_options, image_options));
      }
      // or wants a div
      else {
        var div_options = {
          'styles': {
            'height': this.options.size,
            'width': this.options.size,
            'background-color': this.options.color
          }
        };
        this.cursor = new Element('div', $merge(common_options, div_options));
      }
      this.cursor.inject(document.body);
 
      this.boundElement = this.listener.bindWithEvent(this);
      window.addEvent('mousemove',this.boundElement);
      
      return this;
    },
 
    listener: function(event){
      $clear(this.timeout);
      this.points.push($merge(event.page, { t: new Date().getTime() }));
      this.timeout = this.traceback.delay(this.options.delay,this);
    },
 
    traceback: function(){
      this.tracepoints = $A(this.points);
      this.points = [];
      this.animate();
    },
 
    animate: function(){
      var l = this.tracepoints.length;
      if(l){
        var p = this.tracepoints.shift();
        this.cursor.setStyles({
          'top': p.y + this.options.offset.y,
          'left': p.x + this.options.offset.x
        });
        if(l > 1){
          var d = this.tracepoints[0].t - p.t;
          this.animate.delay(d,this);
        }
      }
    },
    
    /** section: base
     *  Bounga.MouseTracker#detach -> null
     *  
     *  Detachs MouseTracker instance. Your mouse won't be track anymore by this MouseTracker instance.
     *  
     *  It can be re-attach later.
     **/
    detach: function() {
      window.removeEvent('mousemove',this.boundElement);
    },
    
    /** section: base
     *  Bounga.MouseTracker#attach -> null
     *  
     *  Attachs MouseTracker instance. Your mouse will be track by this MouseTracker instance.
     *  
     *  **attach is automatically called** when you create a new instance so you'll use this method if
     *  you've already detached your MouseTracker instance.
     **/
    detach: function() {
      window.removeEvent('mousemove',this.boundElement);
    }
});