# sticky-ads

### What is a sticky ad?
Sticky ads are the ads that follow you as you scroll down a page. These sticky ads in particular allow for multiple ads that all stick once you hit their trigger point. Originally this was built for a client and then extrapolated a bit in order to productize. 

### How does it work?
It's pretty simple, you target the parent container for where you want the ads to appear and they will get pulled into a generated container with some set styles.

```
$('article').stickyAds();
```
Default selector is ".ads" but if you can specify a different one by doing as follows:

```
$('article').stickyAds({ selector: 'aside.right' });
```


### TODOs
  - Add more options (widths, class, etc.)
  - Clean up adStates function
  - More testing