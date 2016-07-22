/*
 *  jquery-boilerplate - v4.1.0
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */
;( function( $, window, document, undefined ) {
  "use strict";
  var pluginName = "stickyAds",
    defaults = {
      adMargin: "20px",
      selector: "aside.right"
    };

  // The actual plugin constructor
  function Plugin (element, options) {
    this.element = element;

    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend( {}, defaults, options );
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend( Plugin.prototype, {
    init: function() {

      // Place initialization logic here
      // You already have access to the DOM element and
      // the options via the instance, e.g. this.element
      // and this.settings
      // you can add more functions like the one below and
      // call them like the example below
      $(this.element).addClass('sticky-ads-engaged');
      this.testStuff(this.settings.selector)
      this._createAdWrap();
      this.calculateHeights();
      this._actionHandler();

      // place ads in generated html block
      // calculate the correct heights
      // set the class conditions
    },

    testStuff: function(test) {
      console.log(test);
    },

    adStates: function() {

      // TODO: god I gotta clean all this shit up
      var OFFSET = 0;
      var $el = $(this.element)
      var asideHeight = $el.find('.aside-wrap').height();
      var $ads = $el.children('.aside-wrap').children('.ad-wrap'),
          adPercent = asideHeight / $ads.length;
      var adNumber = Math.floor(($(window).scrollTop() - $el.offset().top + OFFSET) / adPercent),
          $target = $ads.eq(adNumber),
          $asideRight = $target.find('aside.right');


      if(adNumber >= 0) {
        var $previousTarget = $ads.eq(adNumber - 1),
            $previousAside = $previousTarget.find('aside.right');
      } else if (adNumber === (-1)) {
        var $previousTarget = $ads.eq(0),
            $previousAside = $previousTarget.find('aside.right');
      } 
      if (adNumber < $ads.length) {
        var $futureTarget = $ads.eq(adNumber + 1),
            $futureAside = $futureTarget.find('aside.right');
      }

      if (adNumber >= 0 && adNumber < $ads.length) {
        if ($(window).scrollTop() >= ($target.offset().top - OFFSET) && $(window).scrollTop() < ($target.offset().top + $target.height() - $target.find('aside.right').height() - 80)) {
          // within ad-wrap where ad should be sticky
          if (!$asideRight.hasClass('sticky')) {
            $('aside.right.sticky').removeClass('sticky');
            $asideRight.addClass('sticky');
          
            // check previous and next ad for correct classes
            if(adNumber > 0 && !$previousAside.hasClass('stopped')) {
              $previousAside.addClass('stopped');
            } else if ($futureAside.hasClass('sticky')) {
              $futureAside.removeClass('sticky');
            }
          }
          if ($asideRight.hasClass('stopped')) {
            $asideRight.removeClass('stopped');
          }
        } else if ($(window).scrollTop() >= $target.offset().top + $target.height() - $target.find('aside.right').height() - 80) {
          // within ad-wrap where the current ad should be stopped 
          if (!$asideRight.hasClass('stopped')) {
            $('aside.right.stopped').removeClass('stopped');
            $asideRight.addClass('stopped');
          }
          if ($asideRight.hasClass('sticky')) {
            $asideRight.removeClass('sticky');
          }

          // check previous and next ad for correct classes
          if(adNumber > 0 && !$previousAside.hasClass('stopped')) {
            $previousAside.addClass('stopped');
          } 
          if ($futureAside.hasClass('sticky')) {
            $futureAside.removeClass('sticky');
          }
        }
        else {
          // current ad should have no additional classes
          if ($asideRight.hasClass('stopped')) {
            $asideRight.removeClass('stopped');
          }
          if ($asideRight.hasClass('sticky')) {
            $asideRight.removeClass('sticky');
          }
        }
      }
      if (adNumber === -1) {
        $previousAside.removeClass('sticky');
        $previousAside.removeClass('stopped');
        $futureAside.removeClass('sticky');
        $futureAside.removeClass('stopped');
      } 
    },

    _actionHandler: function() {
      // TODO: calculateHeights is not a function...
      //       ...why?

      var $el = $(this.element);
      $(window).resize(function() {
        $el.stickyAds('calculateHeights');
      });
      $(document).on('scroll', function() {
        // console.log('scroll');
        $el.stickyAds('adStates');
      });
    },

    _createAdWrap: function() {
      // grab the elements (based on the selector)
      // and put the into the generated container
      // based on page height and number of ads
      // decide the breaks
      // TODO: better element appending with
      //       optional class names.
      var $el = $(this.element);
      $el.append('<div class="aside-wrap"></div>');
      $el.find(this._defaults.selector).detach().prependTo($('.aside-wrap'));
      $el.find(this._defaults.selector).wrap('<div class="ad-wrap"></div>')
    },

    _debounce: function(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },

    // Ad position checks
    _isAdAboveBreak: function() {
      // check if ad is above the active point
    },

    _isAdAtBreak: function() {
      // check if ad has hit the active point
    },

    _isAdAtBottom: function() {
      // check if ad has hit the bottom
    },

    _stateCheck: function() {
      // figure out where the scroll position is
      // in relation to ads
    },

    calculateHeights: function() {
      // based on page height and number of ads
      // decide the breaks
      var $el = $(this.element),
          contentHeight = $el.height(),
          asideWrap = $el.find('.aside-wrap'),
          ads = asideWrap.find('.ad-wrap'),
          percentageHeight = 100 / ads.length;

      asideWrap.css({ 'height':contentHeight + 'px' });
      for(var item in ads) {
        ads.css({ 'height':percentageHeight + '%' });
      }
    }
  });


  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    var args = arguments;

    // Is the first parameter an object (options), or was omitted,
    // instantiate a new instance of the plugin.
    if (options === undefined || typeof options === 'object') {
      return this.each(function () {

        // Only allow the plugin to be instantiated once,
        // so we check that the element has no plugin instantiation yet
        if (!$.data(this, 'plugin_' + pluginName)) {

          // if it has no instance, create a new one,
          // pass options to our plugin constructor,
          // and store the plugin instance
          // in the elements jQuery data object.
          $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
        }
      });

    // If the first parameter is a string and it doesn't start
    // with an underscore or "contains" the `init`-function,
    // treat this as a call to a public method.
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

      // Cache the method call
      // to make it possible
      // to return a value
      var returns;

      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);

        // Tests that there's already a plugin-instance
        // and checks that the requested public method exists
        if (instance instanceof Plugin && typeof instance[options] === 'function') {

          // Call the method of our plugin instance,
          // and pass it the supplied arguments.
          returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
        }

        // Allow instances to be destroyed via the 'destroy' method
        if (options === 'destroy') {
          $.data(this, 'plugin_' + pluginName, null);
        }
      });

      // If the earlier cached method
      // gives a value back return the value,
      // otherwise return this to preserve chainability.
      return returns !== undefined ? returns : this;
    }
  };
})( jQuery, window, document );