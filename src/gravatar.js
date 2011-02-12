// (c) Copyright 2011 Nicolas Cavigneaux. All Rights Reserved.
// released under MIT License

// This lib allow you to retrieve email associated gravatar picture or profile.
// It requires MooTools >= 1.2

// Ensure MooTools and Tips are loaded
if (typeof MooTools == 'undefined') { throw 'MooTools must be loaded in order to use Gravatar!'}
if (typeof Bounga.MD5 == 'undefined') { throw 'Bounga.MD5 must be loaded in order to use Gravatar!'}

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
* class Bounga.Gravatar
* 
* Class to fetch gravatar picture and profile info from an email.
* 
* First parameter is the email string
* 
* Options are:
*  <table class='options'>
*    <tr>
*      <th>Name</th>
*      <th>Default value</th>
*      <th>Description</th>
*    </tr>
*    <tr>
*      <td>size</td>
*      <td>100</td>
*      <td>Default size you want to use for the picture.</td>
*    </tr>
*    <tr>
*      <td>extension</td>
*      <td>'.jpg'</td>
*      <td>Extension you want to use for the picture.</td>
*    </tr>
*    <tr>
*      <td>rating</td>
*      <td>'g'</td>
*      <td>
*         Gravatar allows users to self-rate their images so that they can indicate if an image is appropriate for a certain audience.
*         By default, only 'G' rated images are displayed. Available rating levels are:
*         <ul>
*           <li><strong>g</strong>: suitable for display on all websites with any audience type.</li>
*         	<li><strong>pg</strong>: may contain rude gestures, provocatively dressed individuals, the lesser swear words, or mild violence.</li>
*         	<li><strong>r</strong>: may contain such things as harsh profanity, intense violence, nudity, or hard drug use.</li>
*         	<li><strong>x</strong>: may contain hardcore sexual imagery or extremely disturbing violence.</li>
*         </ul>
*       </td>
*    </tr>
*    <tr>
*      <td>defaultImage</td>
*      <td>null</td>
*      <td>
*         <p>By default, if there is no image associated with the requested email hash it gives you back Gravatar default one. If you'd prefer to use your own default image, then you can easily do so by supplying the URL to an image.</p>
*         <p>In addition to allowing you to use your own image, Gravatar has a number of built in options which you can also use as defaults. Most of these work by taking the requested email hash and using it to generate a themed image that is unique to that email address. To use these options, just pass one of the following keywords as the parameter to an image request:</p>
*         <ul>
*         	<li><strong>404</strong>: do not load any image if none is associated with the email hash, instead return an HTTP 404 (File Not Found) response</li>
*         	<li><strong>mm</strong>: (mystery-man) a simple, cartoon-style silhouetted outline of a person (does not vary by email hash)</li>
*         	<li><strong>identicon</strong>: a geometric pattern based on an email hash</li>
*         	<li><strong>monsterid</strong>: a generated 'monster' with different colors, faces, etc</li>
*         	<li><strong>wavatar</strong>: generated faces with differing features and backgrounds</li>
*         	<li><strong>retro</strong>: awesome generated, 8-bit arcade-style pixelated faces</li>
*         </ul>
*     </td>
*    </tr>
*  </table>  
*
* Events are:
*  <table class='events'>
*    <tr>
*      <th>Name</th>
*      <th>Description</th>
*    </tr>
*    <tr>
*      <td>profileFetched</td>
*      <td>Fired when profil JSON was successfully retrieved.</td>
*    </tr>
*    <tr>
*      <td>profileFetchingFailed</td>
*      <td>Fired when profil JSON fetching failed.</td>
*    </tr>
*  </table>
*
* Usage examples :
*
* <pre>
* new Bounga.Gravatar('nico@bounga.org');
* </pre>
*
* If you want to change default settings all you need to do is pass an ‘options’ object:
*
* <pre>
* g = new Bounga.Gravatar("nico@bounga.org", {size: 200, extension: '.png',});
* g.addEvent('profileFetched', function() { $('name').appendText(g.profile.entry[0].preferredUsername) });
* $('email').appendText(g.email);
* $('url').appendText(g.url)
* $('gravatar').grab(g.to_img);
* </pre>
*
**/

/** section: base
*  new Bounga.Gravatar(email, [options])
*  - email (string): Email address you wan to get gravatar for.
*  - options (Hash): override default options
*  
*  Instanciate a new Bounga.Gravatar
*  
**/
Bounga.Gravatar = new Class({

	Implements: [Options, Events],
	
	options: {
		size: 100,
		extension: '.jpg',
		rating: 'g',
		defaultImage: null,
		profileURL: null
	},
	
	initialize: function(email, options) {
		this.setOptions(options);
		
		// Create MD5 hash for given email
    this.email = email.trim();
    this.md5 = this.email.toMD5();
    
    // Generate custom URL for email gravatar image
    var url_elts = ["http://www.gravatar.com/avatar/", this.md5, this.options.extension, "?s=", this.options.size, "&r=", this.options.rating];
    if (this.options.defaultImage != null) {
      url_elts.push("&d=");
      url_elts.push(encodeURI(this.options.defaultImage));
    }
    this.url = url_elts.join('');
    
    // Want to retireve user profile?
    this._fetchProfile();
    
    var alt = (this.profile != null ? this.profile.entry[0].preferredUsername : 'User') + "'s Avatar"
    this.to_img = new Element('img', {src: this.url, alt: alt});
    
    return this;
	},
	
	/** section: base
	*  Bounga.Gravatar#_fetchProfile -> null
	*  
	*  Get request on Gravatar API to fetch profile info.
	*  
	*  **_fetchProfile is automatically called** when you create a new instance
	*  so you don't need to call it by yourself.
	**/
	_fetchProfile: function() {
	  if (this.options.profileURL != null) {
  	  new Request.JSON({
  		  url: 'http://www.gravatar.com/' + this.md5 + ".json",
		  
  			onSuccess: function(profile) {
          this.profile = profile;
          this.fireEvent('profileFetched');
  			}.bind(this),
			
  			onFailure: function() {
  			  if (console) {
    			  console.log("Bounga.Gravatar profile fetching error");
    			  console.log(this.options.profileURL + this.md5 + ".json");
    			  this.fireEvent('profileFetchingFailed');
  				}
  			}.bind(this)
  		}).get();
		}
	}
});