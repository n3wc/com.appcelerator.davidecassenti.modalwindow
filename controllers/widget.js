/********************************************************************************
 * Appcelerator Titanium Alloy
 * ModalWindow Widget
 *
 * Author: Davide Cassenti
 *
 * The ModalWindow widget provides a customizable modal window to be used for
 * alert and confirm messages.
 ********************************************************************************/

// used to know if the modal window is open, to avoid opening twice together
var open = false;

// Type of buttons available
var BUTTON_TYPE_OK = "ok";
var BUTTON_TYPE_CANCEL = "cancel";
var BUTTON_TYPE_DEFAULT = "default";

// The close button will always close the modal
$.modalwindow_close.addEventListener('click', closeModal);

// Internal variables
var listeners = [];
var buttonsContainer = null;

/*** EXPORTED FUNCTIONS ***/

/**
 * alert
 * Opens an 'Alert' window with a single 'Ok' button.
 *
 * @param string message The message to show in the window
 * @param function callback The callback to call when clicking the OK button (optional)
 *
 **/
exports.alert = function(message, callback) {
    // only open the new modal if there aren't open ones
    if(open)
        return;
    open = true; // mark the modal as open

    // set title and message
    $.modalwindow_title.text = "Alert";
    $.modalwindow_message.text = message;

    // set buttons
    resetButtons();
    addButton(BUTTON_TYPE_OK, "Ok", callback);

    // open the window ($.window points to the XML element)
    $.window.open();
};

exports.feedback = function(args, callback) {
    // only open the new modal if there aren't open ones
    if(open)
        return;
    open = true; // mark the modal as open

    // set title and message
    $.modalwindow_title.text = args.titleText?args.titleText:"Feedback";
    $.modalwindow_message.text = args.message?args.message:"";
    
	var textArea = Ti.UI.createTextArea({
	  borderWidth: 2,
	  borderColor: '#bbb',
	  borderRadius: 5,
	  color: '#888',
	  font: {fontSize:14},
	  keyboardType: args.keyboardType?args.keyboardType:Ti.UI.KEYBOARD_DEFAULT,
	  returnKeyType: Ti.UI.RETURNKEY_GO,
	  textAlign: 'left',
	  value: '',
	  width: '90%', 
	  height : '90dip'
	});
    $.modalwindow_body.add(textArea);
    var padding = Ti.UI.createView({height:'10dip'});
     $.modalwindow_body.add(padding);
    // set buttons
    resetButtons();
    addButton(BUTTON_TYPE_OK, args.buttonText?args.buttonText:"Ok", callback, textArea.value);
	
    // open the window ($.window points to the XML element)
    $.window.open();
};

/**
 * confirm
 * Opens an 'Confirm' window with a 'Yes' and a 'No' button.
 *
 * @param string message The message to show in the window
 * @param function yesCallback The callback to call when clicking the YES button (optional)
 * @param function noCallback The callback to call when clicking the NO button (optional)
 *
 **/
exports.confirm = function(message, yesCallback, noCallback) {
    // only open the new modal if there aren't open ones
    if(open)
        return;

    open = true; // mark the modal as open

    // set title and message
    $.modalwindow_title.text = "Confirm";
    $.modalwindow_message.text = message;

    // set buttons
    resetButtons();
    addButton(BUTTON_TYPE_OK, "Yes", yesCallback);
    addButton(BUTTON_TYPE_CANCEL, "No", noCallback);

    // open the window ($.window points to the XML element)
    $.window.open();
};

exports.message = function(title, message, buttons) {
	// sorry, no more than 4 buttons!
	if(!buttons.length || buttons.length > 4)
		return;

	// only open the new modal if there aren't open ones
    if(open)
        return;

    open = true; // mark the modal as open

    $.modalwindow_title.text = title;
    $.modalwindow_message.text = message;

    resetButtons();
    for(var b=0; b<buttons.length; b++) {
    	var btnOpt = buttons[b];
    	addButton(btnOpt.type, btnOpt.text, btnOpt.callback);
    }

    // open the window ($.window points to the XML element)
    $.window.open();
};

/*** INTERNAL FUNCTIONS ***/
/**
 * addButton
 * Add (enable) a button in the window
 *
 * @param string type The type of button to enable
 * @param string title The text for the button
 * @param function callback The callback to call when clicking button (optional)
 *
 **/
function addButton(type, title, callback, inputValue) {
	type = type.toLowerCase() || BUTTON_TYPE_DEFAULT;
	title = title || "Ok";

    var button = Alloy.createWidget('com.appcelerator.davidecassenti.modalwindow', 'button').getView('modalwindow_button_'+type);

    if(button && buttonsContainer) {
        button.title = title;

        // set the callback function
        var clickFn = closeModal;
        if(callback) {
            clickFn = function(e) {
                var dontClose = false;
                if(callback) {
                    // if the callback returns 'false', don't auto-close the modal
                    if(callback(e,inputValue) == false)
                        dontClose = true;
                }

                if(!dontClose)
                    closeModal();
            };
        }

        // set the click listener
        if(listeners[type]) {
            try {
                button.removeEventListener('click', listeners[type]);
            } catch(e) {}
        }
        listeners[type] = clickFn;
        button.addEventListener('click', clickFn);

        try {
        	buttonsContainer.add(button);
        } catch(e) {}

    }
}

/**
 * resetButtons
 * Hides all the buttons
 *
 **/
function resetButtons() {
	if (buttonsContainer) {
		try {
	    	$.modalwindow_body.remove(buttonsContainer);
	    	buttonsContainer = null;
	    } catch(e) {

	    }
	}

	buttonsContainer = Alloy.createWidget('com.appcelerator.davidecassenti.modalwindow', 'buttons_container').getView('buttons_container');
	if (buttonsContainer) {
		$.modalwindow_body.add(buttonsContainer);
	}
}

/**
 * closeModal
 * Close the modal window.
 *
 **/
function closeModal() {
    resetButtons();
    open = false; // very important!!!
    $.window.close();
}
