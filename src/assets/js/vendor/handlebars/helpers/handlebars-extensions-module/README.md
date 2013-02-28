# Handlebars Extensions Module

TODO: removed  `order.js`, it's deprecated!!!!


## Overview

The goal of this project is to develop a comprehensive, well documented and unit tested set of Handlebars.js helpers and extensions, conveniently packaged into an AMD module. Unit testing is powered by the [Jasmine BDD](http://pivotal.github.com/jasmine/) framework and uses the [RequireJS](http://requirejs.org/) AMD module format.

### Dependencies

* [Handlerbars.js](http://handlebarsjs.com) [v1.0 RC 1](https://github.com/downloads/wycats/handlebars.js/handlebars-1.0.rc.1.js)
* [Underscore.js](http://underscorejs.org/) [1.33](https://github.com/documentcloud/underscore/blob/599d31101b7a7b896ff73e338d26ae698833f878/underscore.js)


## Usage & Examples

Check out the _*.spec.js_ files under the _/test/specs/_ folder to see different use cases and examples. For more in-depth explanation of the module's methods [RTFM](http://en.wikipedia.org/wiki/RTFM) (see Documentation section below :P).

## Documentation


###
<p><strong>toString</strong></p>

<p>Inline helper to convert and ensure that a string is always returned.</p>

<p>Examples</p>

<pre><code>&lt;span&gt;{{toString context}}&lt;/span&gt;
&lt;span&gt;{{toString context replaceWith="I am a banana!"}}&lt;/span&gt;
</code></pre>



###
<p><strong>eq</strong></p>

<p>General purpose equality helper. Provides both block and inline helper functionality.</p>

<p>If <em>context</em> equals <em>compareObject</em>, in Inline mode returns <em>ifTrue</em>, otherwise returns<br /><em>ifFalse</em>; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).</p>

<p>Examples</p>

<pre><code>&lt;!-- Inline mode --&gt;
&lt;span&gt;{{eq context "compareObject"}}&lt;/span&gt;&lt;!-- Outputs true or false --&gt;
&lt;span&gt;{{eq context "compareObject" ifTrue="Yay!" ifFalse="Boo!}}&lt;/span&gt;

&lt;!-- Block mode --&gt;
&lt;select&gt;
{{#eq context "compareObject"}}
&lt;option&gt;Yay!&lt;/option&gt;
{{/eq}}
&lt;/select&gt;

&lt;select&gt;
{{#eq context "compareObject"}}
&lt;option&gt;Yay!&lt;/option&gt;
{{else}}
&lt;option&gt;Boo!&lt;/option&gt;
{{/eq}}
&lt;/select&gt;
</code></pre>



###
<p><strong>notEq</strong></p>

<p>Inverse version of eq helper.</p>



###
<p><strong>has</strong></p>

<p>A "has" helper for Objects and Arrays, checks if <em>context</em> has a property or value that matches the <em>propertyName</em>.<br />Provides both block and inline helper functionality.</p>

<p>If the <em>context</em> is an Object and it contains a property named <em>propertyName</em>, in Inline mode returns <em>ifTrue</em>, otherwise returns<br /><em>ifFalse</em>; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).</p>

<p>If the <em>context</em> is an Array and it has a value equal to <em>propertyName</em>, in Inline mode returns <em>ifTrue</em>, otherwise returns<br /><em>ifFalse</em>; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).</p>

<pre><code>&lt;!-- Inline mode --&gt;
&lt;span&gt;{{has context "propertyName" ifTrue="Yay!"}}&lt;/span&gt;
&lt;span&gt;{{has context "propertyName" ifTrue="Yay!" ifFalse="Boo!}}&lt;/span&gt;

&lt;!-- Block mode --&gt;
&lt;select&gt;
{{#has context "propertyName"}}
&lt;option&gt;Yay!&lt;/option&gt;
{{/has}}
&lt;/select&gt;

&lt;select&gt;
{{#has context "propertyName"}}
&lt;option&gt;Yay!&lt;/option&gt;
{{else}}
&lt;option&gt;Boo!&lt;/option&gt;
{{/has}}
&lt;/select&gt;
</code></pre>



###
<p><strong>notHas</strong></p>

<p>Inverse version of has helper.</p>



###
<p><strong>gt</strong></p>

<p>Greater than inequality helper (a.k.a >, More than). Provides both block and inline helper functionality.</p>

<p>If the <em>context</em> is a Number and greater than <em>compareObject</em>, in Inline mode returns <em>ifTrue</em>, otherwise returns<br /><em>ifFalse</em>; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).</p>

<p>If the <em>context</em> is a String, Object or Array and its length is greater than <em>compareObject</em>, in Inline mode returns <em>ifTrue</em>, otherwise returns<br /><em>ifFalse</em>; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).</p>

<pre><code>&lt;!-- Inline mode --&gt;
&lt;span&gt;{{gt context "compareObject" ifTrue="Yay!" }}&lt;/span&gt;
&lt;span&gt;{{gt context "compareObject" ifTrue="Yay!" ifFalse="Boo!}}&lt;/span&gt;

&lt;!-- Block mode --&gt;
&lt;select&gt;
{{#gt context "compareObject"}}
&lt;option&gt;Yay!&lt;/option&gt;
{{/gt}}
&lt;/select&gt;

&lt;select&gt;
{{#gt context "compareObject"}}
&lt;option&gt;Yay!&lt;/option&gt;
{{else}}
&lt;option&gt;Boo!&lt;/option&gt;
{{/gt}}
&lt;/select&gt;
</code></pre>



###
<p><strong>gte</strong></p>

<p>Greater than or equal inequality helper (a.k.a >=, More than or equal). Provides both block and inline helper functionality.</p>

<p>If the <em>context</em> is a Number and greater than or equal to <em>compareObject</em>, in Inline mode returns <em>ifTrue</em>, otherwise returns<br /><em>ifFalse</em>; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).</p>

<p>If the <em>context</em> is a String, Object or Array and its length is greater than or equal to <em>compareObject</em>, in Inline mode returns <em>ifTrue</em>, otherwise returns<br /><em>ifFalse</em>; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).</p>

<pre><code>&lt;!-- Inline mode --&gt;
&lt;span&gt;{{gte context "compareObject" ifTrue="Yay!" }}&lt;/span&gt;
&lt;span&gt;{{gte context "compareObject" ifTrue="Yay!" ifFalse="Boo!}}&lt;/span&gt;

&lt;!-- Block mode --&gt;
&lt;select&gt;
{{#gte context "compareObject"}}
&lt;option&gt;Yay!&lt;/option&gt;
{{/gte}}
&lt;/select&gt;

&lt;select&gt;
{{#gte context "compareObject"}}
&lt;option&gt;Yay!&lt;/option&gt;
{{else}}
&lt;option&gt;Boo!&lt;/option&gt;
{{/gte}}
&lt;/select&gt;
</code></pre>



###
<p><strong>lt</strong></p>

<p>Less than inequality helper (a.k.a &lt;). Provides both block and inline helper functionality.</p>

<p>If the <em>context</em> is a Number and less than <em>compareObject</em>, in Inline mode returns <em>ifTrue</em>, otherwise returns<br /><em>ifFalse</em>; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).</p>

<p>If the <em>context</em> is a String, Object or Array and its length is less than <em>compareObject</em>, in Inline mode returns <em>ifTrue</em>, otherwise returns<br /><em>ifFalse</em>; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).</p>

<pre><code>&lt;!-- Inline mode --&gt;
&lt;span&gt;{{lt context "compareObject" ifTrue="Yay!" }}&lt;/span&gt;
&lt;span&gt;{{lt context "compareObject" ifTrue="Yay!" ifFalse="Boo!}}&lt;/span&gt;

&lt;!-- Block mode --&gt;
&lt;select&gt;
{{#lt context "compareObject"}}
&lt;option&gt;Yay!&lt;/option&gt;
{{/lt}}
&lt;/select&gt;

&lt;select&gt;
{{#lt context "compareObject"}}
&lt;option&gt;Yay!&lt;/option&gt;
{{else}}
&lt;option&gt;Boo!&lt;/option&gt;
{{/lt}}
&lt;/select&gt;
</code></pre>



###
<p><strong>lte</strong></p>

<p>Less than or equal inequality helper (a.k.a &lt;). Provides both block and inline helper functionality.</p>

<p>If the <em>context</em> is a Number and less than or equal to <em>compareObject</em>, in Inline mode returns <em>ifTrue</em>, otherwise returns<br /><em>ifFalse</em>; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).</p>

<p>If the <em>context</em> is a String, Object or Array and its length is less than or equal to <em>compareObject</em>, in Inline mode returns <em>ifTrue</em>, otherwise returns<br /><em>ifFalse</em>; in Block mode returns content in first block, otherwise returns content after {{else}} block (if defined).</p>

<pre><code>&lt;!-- Inline mode --&gt;
&lt;span&gt;{{lte context "compareObject" ifTrue="Yay!" }}&lt;/span&gt;
&lt;span&gt;{{lte context "compareObject" ifTrue="Yay!" ifFalse="Boo!}}&lt;/span&gt;

&lt;!-- Block mode --&gt;
&lt;select&gt;
{{#lte context "compareObject"}}
&lt;option&gt;Yay!&lt;/option&gt;
{{/lte}}
&lt;/select&gt;

&lt;select&gt;
{{#lte context "compareObject"}}
&lt;option&gt;Yay!&lt;/option&gt;
{{else}}
&lt;option&gt;Boo!&lt;/option&gt;
{{/lte}}
&lt;/select&gt;
</code></pre>



## Change Log

Nothing to see here yet. Move along.

## License

Copyright (c) 2012 Fernando Berrios

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
