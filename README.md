# TabEmbed

This is TabEmbed, a minimalist, opinionated component to lay-out your contents within a tabbed interface.
It gives you a small, adaptive HTML/CSS base on which you can apply your design decisions.
The objective is to keep the component independent of its context and content but also to undo or overide as less as possible.
Naturally, it is handled by JavaScript (with a handy API) which takes all the advantages of CSS. JavaScript is only for sugar!

## JavaScript Options

All options are optional and set up with usable defaults. Change them according to your needs.

### `animation`

`Boolean` or `PlainObject` indicates if the component should use CSS animations when the elements are changing.

Default value is false.

### `hashchange`

`Boolean` indicates if the component takes into account the window's hash changes and should use the History object when the elements are changing.

Default value is false.

## JavaScript API

### `new TabEmbed(element[, options])`

Returns a new `TabEmbed` instance configured with the options described above.

```js
var t = new TabEmbed("#Product-TabEmbed");

// plays and uses any of the other documented API methods
```

### `length`

The number of elements in this component. **Read only**.

```js
var t = new TabEmbed("#Product-TabEmbed");

t.length;
// -> 3
```

### `elements`

The set of elements contained by this component. **Read only**.

```js
var t = new TabEmbed("#Product-TabEmbed");

t.elements;
// -> [
// ->   { index: 0, defaultSelected: true, disabled: false, selected: true, name: "Technical-Details", tab: [object HTMLLIElement], tabpanel: [object HTMLDivElement] },
// ->   { index: 1, defaultSelected: false, disabled: true, selected: false, name: "Features", tab: [object HTMLLIElement], tabpanel: [object HTMLDivElement] },
// ->   { index: 2, defaultSelected: false, disabled: false, selected: false, name: "Customer-Reviews", tab: [object HTMLLIElement], tabpanel: [object HTMLDivElement] }
// -> ]
```

### `selectedIndex`

The index of the selected element.  **Read only**.

The value `-1` is returned if no element is selected.

```js
var t = new TabEmbed("#Product-TabEmbed");

t.selectedIndex;
// -> 1
```

### `selectedElements`

The set of elemets that are selected. **Read only**.

```js
var t = new TabEmbed("#Product-TabEmbed");

t.selectedElements;
// -> [ … ]
```

### `element(index)`

Gets an element from the elements collection for this component.

```js
var t = new TabEmbed("#Product-TabEmbed");

t.element(0);
// -> { … }

t.element(2);
// -> undefined
```

### `namedElement(name)`

Gets the element from the elements collection with the specified name.

```js
var t = new TabEmbed("#Product-TabEmbed");

t.namedElement("Technical-Details");
// -> { … }

t.namedElement("Custmoer-Reviews");
// -> undefined
```

### `select(element)`

Selects an element from the collection of elements for this component.

```js
var t = new TabEmbed("#Product-TabEmbed");

t.select(t.elements[1]);

var p = t.element(1);
t.select(p);

var p = t.namedElement("Customer-Reviews");
t.select(p);
```
