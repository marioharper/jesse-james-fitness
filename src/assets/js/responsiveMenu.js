window.ResponsiveMenu = function(){
	'use strict';

	//selectors
	var _MENU_CLASS = 'top-menu';
	var _MENU_BTN_CLASS = 'menu-btn';
	var _CLOSE_LARGER_THAN = 750;

	return {
		init: init
	}

	//////////

	function init(){
		// get the menu with the selector
		var menus = document.getElementsByClassName(_MENU_CLASS);

		for(var i = 0; i < menus.length; i++){
			var menu = menus[i];
			_buildMenu(menu);
		}
	}

	function _buildMenu(menu){
		var btn = menu.getElementsByClassName(_MENU_BTN_CLASS)[0];
		_addClickEvent(menu, btn);
		_addScreenSizeWatcher(menu);
		_addOutsideClickEvent(menu);
	}

	function _addClickEvent(menu, btn){
		btn.onclick = function(){
			menu.classList.toggle('expanded');
		}
	}

	function _addScreenSizeWatcher(menu){
		window.addEventListener("resize", resizeThrottler, false);

		var actualResizeHandler = function(){
	  	if(screen.width > _CLOSE_LARGER_THAN){
	  		menu.classList.remove('expanded');
	  	}
		}

		var resizeTimeout;
		function resizeThrottler() {
	    if ( !resizeTimeout ) {
	      resizeTimeout = setTimeout(function() {
	        resizeTimeout = null;
	        actualResizeHandler();
	      }, 132);
	    }
	  }
	}

	function _addOutsideClickEvent(menu){
		document.querySelector('html').onclick = function(){
			// close menu if its expanded and you click outside of it
			menu.classList.remove('expanded');
		}

		menu.onclick = function(event){
			// dont close the menu if you click anywhere inside of it
			event.stopPropagation();
		}
	}
};