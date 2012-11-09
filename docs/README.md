![Alloy](./img/alloy.png)

# ModalWindow Alloy Widget

## Overview

The `ModalWindow` widget provides a customizable modal window to be used for alert, confirm and customized messages.

## Manifest

- version: 1.0 (stable)
- github: https://github.com/davidecassenti/com.appcelerator.davidecassenti.modalwindow
- author: Davide Cassenti
- platforms: iOS, Android, MobileWeb

## Adding the ModalWindow widget to your Titanium project
- In your application `config.json` file, you must include the dependency:

```
"dependencies": {
    "com.appcelerator.davidecassenti.modalwindow": "1.0"
}
```

- Create the directory `app/widgets` - if it doesn't already exist
- Copy the widget folder inside `app/widgets`

## Add the widget to your View
There are two ways to use the widget: you can either use the tag `Require` (or the new `Widget`) in your view, or load the widget from the controller. The first is probably easier, but keep in mind that the widget **must be required outside the main Window tag**:

```
<Alloy>
    <Window class="container">
        [your window elements are here]
    </Window>
    <Require type="widget" src="com.appcelerator.davidecassenti.modalwindow" id="modal" />
</Alloy>
```

In this case, you can refeer to the widget using the ```$.modal``` variable.

If you don't want to put an invisible XML tag in your view, you can load the widget directly from the controller; in the controller code put this line:

```
var modal = Alloy.createWidget("com.appcelerator.davidecassenti.modalwindow");
```

In this case, use the variable `modal` to access the widget properties. The following examples will assume you used the first method to put the widget in your project.

## Use the widget
The ```ModalWindow``` widget provides three methods: `alert`, `confirm` and `message`.


#### alert(message, callback)
This method shows a simple alert window, with a single OK button and the required message. Clicking the OK button will call the callback function.

```
$.modal.alert("This is an alert", function() {
    Ti.API.info("User clicked OK");
});
```

#### confirm(message, yesCallback, noCallback)
This method will show a confirm window, with two buttons: `yes` and `no`. When a button is clicked, the relative callback function is called.

```
$.modal.confirm("Are you sure?", function() {
    Ti.API.info("User clicked YES");
}, function() {
    Ti.API.info("User clicked NO");
});
```

#### message(title, message, buttons)
This method shows a generic message with a customized title, message and a number of buttons between one and four. The `buttons` parameter is an array of objects, each with the following properties:

- type: type of the button (can be `ok`, `cancel` or `default`)
- text: the text to show on the button
- callback (optional): function to call when the button is clicked


```
$.modal.message("Choose…", "Click a button", [{
	type: "ok",
    text: "Click green!",
    callback: function() {
        doSomething();
    }
}, {
	type: "cancel",
    text: "Click red!",
    callback: function() {
        doSomething();
    }
}, {
	type: "default",
    text: "Click gray!",
    callback: function() {
        doSomething();
    }
}]);
```

### The callback functions
The callback function is invoked when the user clicks on the button; once the callback function is over, the modal window is automatically closed. This can be prevented by returning `false` in the callback function.

```
$.modal.alert("This is an alert", function() {
    Ti.API.info("User clicked OK");
    return false; // this prevents the window to close upon click
});
```

## Widget Customization
The elements of the modal window (e.g. title, buttons etc.) can be customized by using the appropriate styles inside the `app.tss` file.

The properties are changed as you would do with any normal element; however, some of the properties will not be changed. You can refeer to the table below to know which properties are 100% supported:

| Selector | Description | What can be customized |
|----------|-------------|------------------------|
|#modalwindow_header | Window header bar | backgroundColor, backgroundImage |
|#modalwindow_title | Window title text | color, font |
|#modalwindow_close | Window close icon | image |
|#modalwindow_body | Body of the window | backgroundColor |
|#modalwindow_message | Text of the message | color, font |
|#modalwindow_button_ok | Properties of the ok button | width, height, font, backgroundImage, backgroundColor, borderRadius |
|#modalwindow_button_cancel | Properties of the cancel button | width, height, font, backgroundImage |
|#modalwindow_button_default | Properties of the default button | width, height, font, backgroundImage |

Example (in `app.tss`):

```
"#modalwindow_header": {
    backgroundColor: '#c00'
},
"#modalwindow_title": {
    color: 'white'
},
"#modalwindow_button_ok": {
    backgroundImage: '/green.png',
    backgroundColor: 'transparent',
    borderRadius: 0
}
```





