
/* JavaScript content from js/plugins/android/DatePicker.js in folder common */
/**
 * Phonegap DatePicker Plugin Copyright (c) Greg Allen 2011 MIT Licensed
 * Reused and ported to Android plugin by Daniel van 't Oever
 */

/**
 * Constructor
 */
function DatePickerAndroid() {
  //this._callback;
}

/**
 * Android themes
 */
DatePickerAndroid.prototype.ANDROID_THEMES = {
  THEME_TRADITIONAL          : 1, // default
  THEME_HOLO_DARK            : 2,
  THEME_HOLO_LIGHT           : 3,
  THEME_DEVICE_DEFAULT_DARK  : 4,
  THEME_DEVICE_DEFAULT_LIGHT : 5
};

/**
 * show - true to show the ad, false to hide the ad
 */
DatePickerAndroid.prototype.show = function(options, cb, errCb) {

	if (options.date && options.date instanceof Date) {
		options.date = (options.date.getMonth() + 1) + "/" +
					   (options.date.getDate()) + "/" +
					   (options.date.getFullYear()) + "/" +
					   (options.date.getHours()) + "/" +
					   (options.date.getMinutes());
	}

	var now = new Date();
	var future = new Date();
	future.setMonth ( now.getMonth() + 6 );
	
	var defaults = {
		mode : 'date',
		date : '',
		minDate: now.getTime(),
		maxDate: future.getTime(),
		titleText: '',
		cancelText: '',
		okText: '',
		todayText: '',
		nowText: '',
		is24Hour: false,
        androidTheme : window.datePicker.ANDROID_THEMES.THEME_TRADITIONAL // Default theme
	};

	for (var key in defaults) {
		if (typeof options[key] !== "undefined") {
			defaults[key] = options[key];
		}
	}

	//this._callback = cb;

	var callback = function(message) {
		if(message != 'error'){
			var timestamp = Date.parse(message);
			if(isNaN(timestamp) == false) {
				cb(new Date(message));
			}
	        else {
	            cb();
	        }
		} else {
			// TODO error popup?
    	}
	}

	var errCallback = function(message) {
		if (typeof errCb === 'function') {
			errCb(message);
		}
	}

	cordova.exec(callback,
		errCallback,
		"DatePickerPlugin",
		defaults.mode,
		[defaults]
	);
};

var datePickerAndroid = new DatePickerAndroid();
module.exports = datePickerAndroid;

// Make plugin work under window.plugins
if (!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.datePickerAndroid) {
    window.plugins.datePickerAndroid = datePickerAndroid;
}
