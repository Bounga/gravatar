
// (c) Copyright 2009 Nicolas Cavigneaux. All Rights Reserved.
// released under MIT License

// This lib allow you to create tooltips for any element.
// Tooltips data can be fetched locally or remote using AJAX
// It requires MooTools >= 1.2

// Ensure MooTools and Tips are loaded
if (typeof MooTools == 'undefined') { throw 'MooTools must be loaded in order to use ToolTips!'}
if (typeof Tips == 'undefined') { throw 'MooTools Tips must be loaded in order to use ToolTips!'}

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
* class Bounga.ToolTips
* 
* Class to add "ToolTips" behavior to HTML elements. You can use a collection of elements, 
* a string Selector or an Element to apply the tooltips to.
*  
* Default options are:
*  <table class='options'>
*    <tr>
*      <th>Name</th>
*      <th>Default value</th>
*      <th>Description</th>
*    </tr>
*    <tr>
*      <td>url</td>
*      <td>null</td>
*      <td>
*         URL used to retrieve a tooltip text based on an associated tooltip title attribute using AJAX.
*         When using local data, title attribute is used for tooltip title and href attribute is used for
*         tooltip content. You can use a rel attribute to overwrite this content.
*      </td>
*    </tr>
*    <tr>
*      <td>showDelay</td>
*      <td>100</td>
*      <td>Delay to apply before showing the tooltip</td>
*    </tr>
*    <tr>
*      <td>hideDelay</td>
*      <td>100</td>
*      <td>Delay to apply before hiding the tooltip</td>
*    </tr>
*    <tr>
*      <td>className</td>
*      <td>null</td>
*      <td>CSS class for tooltip container</td>
*    </tr>
*    <tr>
*      <td>offsets</td>
*      <td>{ x : 16, y : 16 }</td>
*      <td>The distance between your tooltip and the mouse</td>
*    </tr>
*    <tr>
*      <td>fixed</td>
*      <td>false</td>
*      <td>If set to true, the toolTip will not follow the mouse</td>
*    </tr>
*    <tr>
*      <td>onShow</td>
*      <td>null</td>
*      <td>Function which is fired when the tooltip is shown</td>
*    </tr>
*    <tr>
*      <td>onHide</td>
*      <td>null</td>
*      <td>Function which is fired when the tooltip is being hidden</td>
*    </tr>
*  </table>  
*
* Usage examples :
*
* <pre>
* new Bounga.ToolTips();
* </pre>
*
* If you want to change default settings all you need to do is pass a selector and an ‘options’ object:
*
* <pre>
* new Bounga.ToolTips('span.my_tooltips');
* new Bounga.ToolTips('.tooltips', {showDelay: 0, hideDelay: 200});
* new Bounga.ToolTips('.tooltips', {url: '/definitions/'});
* new Bounga.ToolTips('.tooltips', {onShow: function() { alert('Here is the tooltip') }});
* </pre>
* 
**/

/** section: base
*  new Bounga.ToolTips([elements = '.tooltip'[, options]])
*  - elements (mixed): A collection of elements, a string Selector or an Element to apply the tooltips to.
*    Uses '.tooltips' by default
*  - options (Hash): override default options
*  
*  Creates a new Bounga.ToolTips
*  
**/
Bounga.ToolTips = new Class({

	Implements: [Options],
	boundElement: null,
	tips: null,
	elements: '.tooltip',
	options: {
		'url': null,
		'showDelay': 100,
		'hideDelay': 100,
		'className': null,
		'offsets': {'x': 16, 'y': 16},
		'fixed': false,
		'onShow': null,
		'onHide': null
	},

	initialize: function(elements, options){
		this.setOptions(options);

		// Gets all elements that must be tooltiped
		if ($chk(elements)) { this.elements = elements; };
		var tooltips = $$(this.elements);

    // Using remote data
		if (this.options.url != null) {
			tooltips.each(function(el) {
				// Sets tooltip title
				var title = el.get('html');
				el.store('tip:title', title);

				// Polls server to retrieve associated text
				var params = $H({ word: title }).toQueryString();
				new Request({
					url: this.options.url,
					method: 'get',
					data: params,
					onSuccess: function(res) {
						el.store('tip:text', res);
					},
					onFailure: function(transport) {
					  if (console) {
  						console.log("Bounga.ToolTips error:\n" +
  												transport.status + ": " +
  												transport.statusText + "\n" +
  												transport.responseText);
						};
					}
				}).send();
			});
		}

		// Instantiates MooTools Tips
		this.tips = new Tips(this.elements, {
		  showDelay: this.options.showDelay,
		  hideDelay: this.options.hideDelay,
		  className: this.options.className,
		  offsets: this.options.offsets,
		  fixed: this.options.fixed
		});
		
		// Sets callbacks functions
		if (this.options.onShow != null) {
		  this.tips.addEvent('show', this.options.onShow);
	  };
	  if (this.options.onHide != null) {
      this.tips.addEvent('hide', this.options.onHide);
    };

		return this;
	},

	/** section: base
	*  Bounga.ToolTips#detach -> null
	*  
	*  Detachs ToolTips instance. Your tooltips won't be shown anymore.
	*  
	*  It can be re-attach later.
	**/
	detach: function() {
		this.tips.detach(this.elements);
	},

	/** section: base
	*  Bounga.ToolTips#attach -> null
	*  
	*  Attachs ToolTips instance. Your tooltips will be shown again.
	*  
	*  **attach is automatically called** when you create a new instance so you'll use this method only
	*  if you've already detached your ToolTips instance.
	**/
	attach: function() {
		this.tips.attach(this.elements);
	}
});