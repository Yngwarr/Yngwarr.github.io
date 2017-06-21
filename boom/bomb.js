javascript:(
	function()
	{
		var div = document.querySelector('.page-container');
		div.innerHTML = '<div style="position: absolute; width: 100vw; height: 10vw; opacity: 0.5; top: 0; "><iframe src="http://yngwarr.github.io/boom/" style="width: 100%; height: 100%"></iframe></div>'
			+ div.innerHTML;

		var iframe = document.querySelector('iframe');
		iframe.style.backgroundColor = 'transparent';
		iframe.frameBorder = 0;
		iframe.allowTransparency = true;

		document.querySelector('.nav-wrapper').addEventListener('click', () => {
			if (!iframe.style.display || iframe.style.display !== 'none') {
				iframe.style.display = 'none';
			} else {
				iframe.style.display = '';
			}
		});
	})
();