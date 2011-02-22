// (c) Copyright 2011 Nicolas Cavigneaux. All Rights Reserved.
// released under MIT License

// This lib allow you to retrieve email associated gravatar picture or profile.
// It requires MooTools >= 1.2

// Ensure MooTools and Tips are loaded
if (typeof MooTools == 'undefined') { throw 'MooTools must be loaded in order to use Gravatar!'}

/**
* Bounga
*  
* Bounga's Namespace
**/
if (typeof Bounga == 'undefined') {
	Bounga = {};
}

/**
* class Bounga.Gravatar
*
* new Bounga.Gravatar(options)
*
* - options (Hash): set email (or MD5) and override default options
*  
* Instanciate a new Bounga.Gravatar to fetch gravatar image
* and profile info from the md5 or the email.
* 
* You must at least specify md5 or email option.
* If clear email is used you have to load Bounga.MD5 for MD5 hash generation.
* 
* **Options**
*
* Name         | Default value | Description
* -------------|:-------------:|------------
* size         | 100           | Default size you want to use for the image
* extension    | '.jpg'        | Extension you want to use for the image
* rating       | 'g'           | Gravatar allows users to self-rate their images so that they can indicate if an image is appropriate for a certain audience. By default, only 'G' rated images are displayed. Available rating levels are: **g** (any audience type), **pg** (may contain rude gestures, provocatively dressed individuals, the lesser swear words, or mild violence), **r** (may contain such things as harsh profanity, intense violence, nudity, or hard drug use), **x** (may contain hardcore sexual imagery or extremely disturbing violence)
* defaultImage | null          | By default, if there is no image associated with the requested email hash it gives you back Gravatar default one. If you'd prefer to use your own default image, then you can easily do so by supplying the URL to an image. In addition to allowing you to use your own image, Gravatar has a number of built in options which you can also use as defaults. Most of these work by taking the requested email hash and using it to generate a themed image that is unique to that email address. To use these options, just pass one of the following keywords as the parameter to an image request: **404** (do not load any image if none is associated with the email hash, instead return an HTTP 404 (File Not Found) response), **mm** ((mystery-man) a simple, cartoon-style silhouetted outline of a person (does not vary by email hash)), **identicon** (a geometric pattern based on an email hash), **monsterid** (a generated 'monster' with different colors, faces, etc), **retro** (awesome generated, 8-bit arcade-style pixelated faces)
* email        | null          | User clear email (not recommended)
* md5          | null          | User email MD5 hash
*
* **Events**
*
* Name                  | Description
* ----------------------|------------
* profileFetched        | Fired when profil JSON was successfully retrieved
* profileFetchingFailed | Fired when profil JSON fetching failed
*
* Usage examples :
*
*     new Bounga.Gravatar({email: 'nico@bounga.org'});
*     new Bounga.Gravatar({md5: '855c677aca7319a44da19fb583b9f320'});
*
* If you want to change default settings all you need to do is pass an ‘options’ object:
*
*     lang:javascript
*     g = new Bounga.Gravatar("nico@bounga.org", {size: 200, extension: '.png'});
*     g.addEvent('profileFetched', function() {
*       $('name').appendText(g.profile.entry[0].preferredUsername);
*     });
*     $('email').appendText(g.email);
*     $('url').appendText(g.url)
*     $('gravatar').grab(g.to_img);
*
**/
Bounga.Gravatar = new Class({

	Implements: [Options, Events],
	
	options: {
		size: 100,
		extension: '.jpg',
		rating: 'g',
		defaultImage: null,
		email: null,
		md5: null
	},
	
	initialize: function(options) {
		this.setOptions(options);
		
		if (this.options.md5 != null) {
		  this.md5 = this.options.md5
		}
		else {
		  if (typeof Bounga.MD5 == 'undefined') { throw 'Bounga.MD5 must be loaded in order to use Gravatar with clear email!'}
		  // Create MD5 hash for given email
      this.email = this.options.email.trim();
      this.md5 = this.email.toMD5();
		}
    
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
	
	/**
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