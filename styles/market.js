import css from 'styled-jsx/css';
 
export default css.global`
*,
:after,
:before {
	box-sizing: border-box;
	border: 0 solid #e5e7eb
}

:after,
:before {
	--tw-content: ""
}

html {
	line-height: 1.5;
	-webkit-text-size-adjust: 100%;
	-moz-tab-size: 4;
	-o-tab-size: 4;
	tab-size: 4;
	font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
	font-feature-settings: normal;
	font-variation-settings: normal
}

body {
	margin: 0;
	line-height: inherit
}

hr {
	height: 0;
	color: inherit;
	border-top-width: 1px
}

abbr:where([title]) {
	-webkit-text-decoration: underline dotted;
	text-decoration: underline dotted
}

h1,
h2,
h3,
h4,
h5,
h6 {
	font-size: inherit;
	font-weight: inherit
}

a {
	color: inherit;
	text-decoration: inherit
}

b,
strong {
	font-weight: bolder
}

code,
kbd,
pre,
samp {
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
	font-size: 1em
}

small {
	font-size: 80%
}

sub,
sup {
	font-size: 75%;
	line-height: 0;
	position: relative;
	vertical-align: baseline
}

sub {
	bottom: -.25em
}

sup {
	top: -.5em
}

table {
	text-indent: 0;
	border-color: inherit;
	border-collapse: collapse
}

button,
input,
optgroup,
select,
textarea {
	font-family: inherit;
	font-feature-settings: inherit;
	font-variation-settings: inherit;
	font-size: 100%;
	font-weight: inherit;
	line-height: inherit;
	color: inherit;
	margin: 0;
	padding: 0
}

button,
select {
	text-transform: none
}

[type=button],
[type=reset],
[type=submit],
button {
	-webkit-appearance: button;
	background-color: transparent;
	background-image: none
}

:-moz-focusring {
	outline: auto
}

:-moz-ui-invalid {
	box-shadow: none
}

progress {
	vertical-align: baseline
}

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
	height: auto
}

[type=search] {
	-webkit-appearance: textfield;
	outline-offset: -2px
}

::-webkit-search-decoration {
	-webkit-appearance: none
}

::-webkit-file-upload-button {
	-webkit-appearance: button;
	font: inherit
}

summary {
	display: list-item
}

blockquote,
dd,
dl,
figure,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
p,
pre {
	margin: 0
}

fieldset {
	margin: 0
}

fieldset,
legend {
	padding: 0
}

menu,
ol,
ul {
	list-style: none;
	margin: 0;
	padding: 0
}

dialog {
	padding: 0
}

textarea {
	resize: vertical
}

input::-moz-placeholder,
textarea::-moz-placeholder {
	opacity: 1;
	color: #9ca3af
}

input::placeholder,
textarea::placeholder {
	opacity: 1;
	color: #9ca3af
}

[role=button],
button {
	cursor: pointer
}

:disabled {
	cursor: default
}

audio,
canvas,
embed,
iframe,
img,
object,
svg,
video {
	display: block;
	vertical-align: middle
}

img,
video {
	max-width: 100%;
	height: auto
}

[hidden] {
	display: none
}

*,
:after,
:before {
	--tw-border-spacing-x: 0;
	--tw-border-spacing-y: 0;
	--tw-translate-x: 0;
	--tw-translate-y: 0;
	--tw-rotate: 0;
	--tw-skew-x: 0;
	--tw-skew-y: 0;
	--tw-scale-x: 1;
	--tw-scale-y: 1;
	--tw-pan-x: ;
	--tw-pan-y: ;
	--tw-pinch-zoom: ;
	--tw-scroll-snap-strictness: proximity;
	--tw-gradient-from-position: ;
	--tw-gradient-via-position: ;
	--tw-gradient-to-position: ;
	--tw-ordinal: ;
	--tw-slashed-zero: ;
	--tw-numeric-figure: ;
	--tw-numeric-spacing: ;
	--tw-numeric-fraction: ;
	--tw-ring-inset: ;
	--tw-ring-offset-width: 0px;
	--tw-ring-offset-color: #fff;
	--tw-ring-color: rgba(59, 130, 246, .5);
	--tw-ring-offset-shadow: 0 0 #0000;
	--tw-ring-shadow: 0 0 #0000;
	--tw-shadow: 0 0 #0000;
	--tw-shadow-colored: 0 0 #0000;
	--tw-blur: ;
	--tw-brightness: ;
	--tw-contrast: ;
	--tw-grayscale: ;
	--tw-hue-rotate: ;
	--tw-invert: ;
	--tw-saturate: ;
	--tw-sepia: ;
	--tw-drop-shadow: ;
	--tw-backdrop-blur: ;
	--tw-backdrop-brightness: ;
	--tw-backdrop-contrast: ;
	--tw-backdrop-grayscale: ;
	--tw-backdrop-hue-rotate: ;
	--tw-backdrop-invert: ;
	--tw-backdrop-opacity: ;
	--tw-backdrop-saturate: ;
	--tw-backdrop-sepia:
}

::backdrop {
	--tw-border-spacing-x: 0;
	--tw-border-spacing-y: 0;
	--tw-translate-x: 0;
	--tw-translate-y: 0;
	--tw-rotate: 0;
	--tw-skew-x: 0;
	--tw-skew-y: 0;
	--tw-scale-x: 1;
	--tw-scale-y: 1;
	--tw-pan-x: ;
	--tw-pan-y: ;
	--tw-pinch-zoom: ;
	--tw-scroll-snap-strictness: proximity;
	--tw-gradient-from-position: ;
	--tw-gradient-via-position: ;
	--tw-gradient-to-position: ;
	--tw-ordinal: ;
	--tw-slashed-zero: ;
	--tw-numeric-figure: ;
	--tw-numeric-spacing: ;
	--tw-numeric-fraction: ;
	--tw-ring-inset: ;
	--tw-ring-offset-width: 0px;
	--tw-ring-offset-color: #fff;
	--tw-ring-color: rgba(59, 130, 246, .5);
	--tw-ring-offset-shadow: 0 0 #0000;
	--tw-ring-shadow: 0 0 #0000;
	--tw-shadow: 0 0 #0000;
	--tw-shadow-colored: 0 0 #0000;
	--tw-blur: ;
	--tw-brightness: ;
	--tw-contrast: ;
	--tw-grayscale: ;
	--tw-hue-rotate: ;
	--tw-invert: ;
	--tw-saturate: ;
	--tw-sepia: ;
	--tw-drop-shadow: ;
	--tw-backdrop-blur: ;
	--tw-backdrop-brightness: ;
	--tw-backdrop-contrast: ;
	--tw-backdrop-grayscale: ;
	--tw-backdrop-hue-rotate: ;
	--tw-backdrop-invert: ;
	--tw-backdrop-opacity: ;
	--tw-backdrop-saturate: ;
	--tw-backdrop-sepia:
}

.container {
	width: 100%
}

@media (min-width:640px) {
	.container {
		max-width: 640px
	}
}

@media (min-width:768px) {
	.container {
		max-width: 768px
	}
}

@media (min-width:960px) {
	.container {
		max-width: 960px
	}
}

@media (min-width:1024px) {
	.container {
		max-width: 1024px
	}
}

@media (min-width:1280px) {
	.container {
		max-width: 1280px
	}
}

@media (min-width:1536px) {
	.container {
		max-width: 1536px
	}
}

.fixed {
	position: fixed
}

.absolute {
	position: absolute
}

.relative {
	position: relative
}

.-bottom-3 {
	bottom: -.75rem
}

.-bottom-32 {
	bottom: -8rem
}

.-left-40 {
	left: -10rem
}

.-left-8 {
	left: -2rem
}

.-right-12 {
	right: -3rem
}

.-right-8 {
	right: -2rem
}

.-top-14 {
	top: -3.5rem
}

.-top-2 {
	top: -.5rem
}

.-top-3 {
	top: -.75rem
}

.-top-9 {
	top: -2.25rem
}

.bottom-16 {
	bottom: 4rem
}

.bottom-2 {
	bottom: .5rem
}

.left-2 {
	left: .5rem
}

.left-3 {
	left: .75rem
}

.left-4 {
	left: 1rem
}

.left-\[10\%\] {
	left: 10%
}

.left-\[370px\] {
	left: 370px
}

.right-0 {
	right: 0
}

.right-2 {
	right: .5rem
}

.right-4 {
	right: 1rem
}

.right-64 {
	right: 16rem
}

.right-\[-5\%\] {
	right: -5%
}

.right-\[2\%\] {
	right: 2%
}

.right-\[20px\] {
	right: 20px
}

.right-\[5\%\] {
	right: 5%
}

.top-0 {
	top: 0
}

.top-12 {
	top: 3rem
}

.top-16 {
	top: 4rem
}

.top-2 {
	top: .5rem
}

.top-3 {
	top: .75rem
}

.top-4 {
	top: 1rem
}

.top-48 {
	top: 12rem
}

.top-80 {
	top: 20rem
}

.top-\[10\%\] {
	top: 10%
}

.top-\[10px\] {
	top: 10px
}

.top-\[20px\] {
	top: 20px
}

.top-\[5\%\] {
	top: 5%
}

.top-\[7px\] {
	top: 7px
}

.top-\[8\%\] {
	top: 8%
}

.-z-50 {
	z-index: -50
}

.z-10 {
	z-index: 10
}

.z-20 {
	z-index: 20
}

.z-50 {
	z-index: 50
}

.z-\[100\] {
	z-index: 100
}

.m-0 {
	margin: 0
}

.m-2 {
	margin: .5rem
}

.m-\[2px\] {
	margin: 2px
}

.mx-2 {
	margin-left: .5rem;
	margin-right: .5rem
}

.mx-4 {
	margin-left: 1rem;
	margin-right: 1rem
}

.my-2 {
	margin-top: .5rem;
	margin-bottom: .5rem
}

.my-4 {
	margin-top: 1rem;
	margin-bottom: 1rem
}

.my-8 {
	margin-top: 2rem;
	margin-bottom: 2rem
}

.my-\[2\.5\%\] {
	margin-top: 2.5%;
	margin-bottom: 2.5%
}

.-mt-2 {
	margin-top: -.5rem
}

.-mt-3 {
	margin-top: -.75rem
}

.-mt-8 {
	margin-top: -2rem
}

.mb-2 {
	margin-bottom: .5rem
}

.mb-3 {
	margin-bottom: .75rem
}

.mb-4 {
	margin-bottom: 1rem
}

.mb-6 {
	margin-bottom: 1.5rem
}

.mb-\[15px\] {
	margin-bottom: 15px
}

.ml-2 {
	margin-left: .5rem
}

.ml-3 {
	margin-left: .75rem
}

.ml-4 {
	margin-left: 1rem
}

.ml-5 {
	margin-left: 1.25rem
}

.ml-6 {
	margin-left: 1.5rem
}

.ml-8 {
	margin-left: 2rem
}

.ml-\[14px\] {
	margin-left: 14px
}

.ml-\[2px\] {
	margin-left: 2px
}

.ml-\[6px\] {
	margin-left: 6px
}

.ml-auto {
	margin-left: auto
}

.mr-4 {
	margin-right: 1rem
}

.mr-auto {
	margin-right: auto
}

.mt-0 {
	margin-top: 0
}

.mt-1 {
	margin-top: .25rem
}

.mt-10 {
	margin-top: 2.5rem
}

.mt-11 {
	margin-top: 2.75rem
}

.mt-12 {
	margin-top: 3rem
}

.mt-14 {
	margin-top: 3.5rem
}

.mt-16 {
	margin-top: 4rem
}

.mt-2 {
	margin-top: .5rem
}

.mt-20 {
	margin-top: 5rem
}

.mt-24 {
	margin-top: 6rem
}

.mt-3 {
	margin-top: .75rem
}

.mt-32 {
	margin-top: 8rem
}

.mt-4 {
	margin-top: 1rem
}

.mt-5 {
	margin-top: 1.25rem
}

.mt-6 {
	margin-top: 1.5rem
}

.mt-7 {
	margin-top: 1.75rem
}

.mt-8 {
	margin-top: 2rem
}

.mt-9 {
	margin-top: 2.25rem
}

.mt-\[14px\] {
	margin-top: 14px
}

.mt-\[50px\] {
	margin-top: 50px
}

.mt-\[5px\] {
	margin-top: 5px
}

.mt-\[7px\] {
	margin-top: 7px
}

.mt-\[96px\] {
	margin-top: 96px
}

.block {
	display: block
}

.inline-block {
	display: inline-block
}

.flex {
	display: flex
}

.grid {
	display: grid
}

.hidden {
	display: none
}

.aspect-\[1400\/678\] {
	aspect-ratio: 1400/678
}

.\!h-\[36px\] {
	height: 36px !important
}

.\!h-auto {
	height: auto !important
}

.\!h-full {
	height: 100% !important
}

.h-0 {
	height: 0
}

.h-1 {
	height: .25rem
}

.h-16 {
	height: 4rem
}

.h-20 {
	height: 5rem
}

.h-6 {
	height: 1.5rem
}

.h-8 {
	height: 2rem
}

.h-9 {
	height: 2.25rem
}

.h-\[10\%\] {
	height: 10%
}

.h-\[100px\] {
	height: 100px
}

.h-\[120px\] {
	height: 120px
}

.h-\[162px\] {
	height: 162px
}

.h-\[182px\] {
	height: 182px
}

.h-\[200px\] {
	height: 200px
}

.h-\[235px\] {
	height: 235px
}

.h-\[250px\] {
	height: 250px
}

.h-\[275px\] {
	height: 275px
}

.h-\[300px\] {
	height: 300px
}

.h-\[34px\] {
	height: 34px
}

.h-\[35px\] {
	height: 35px
}

.h-\[35vh\] {
	height: 35vh
}

.h-\[362px\] {
	height: 362px
}

.h-\[40px\] {
	height: 40px
}

.h-\[48px\] {
	height: 48px
}

.h-\[80vh\] {
	height: 80vh
}

.h-full {
	height: 100%
}

.max-h-\[250px\] {
	max-height: 250px
}

.max-h-\[400px\] {
	max-height: 400px
}

.max-h-\[410px\] {
	max-height: 410px
}

.max-h-full {
	max-height: 100%
}

.min-h-\[12px\] {
	min-height: 12px
}

.min-h-\[32px\] {
	min-height: 32px
}

.min-h-\[52px\] {
	min-height: 52px
}

.min-h-\[600px\] {
	min-height: 600px
}

.\!w-\[36px\] {
	width: 36px !important
}

.\!w-full {
	width: 100% !important
}

.w-1\/2 {
	width: 50%
}

.w-1\/4 {
	width: 25%
}

.w-11 {
	width: 2.75rem
}

.w-20 {
	width: 5rem
}

.w-3\/4 {
	width: 75%
}

.w-6 {
	width: 1.5rem
}

.w-8 {
	width: 2rem
}

.w-9 {
	width: 2.25rem
}

.w-\[100px\] {
	width: 100px
}

.w-\[120px\] {
	width: 120px
}

.w-\[149px\] {
	width: 149px
}

.w-\[230px\] {
	width: 230px
}

.w-\[240px\] {
	width: 240px
}

.w-\[25\%\] {
	width: 25%
}

.w-\[250px\] {
	width: 250px
}

.w-\[280px\] {
	width: 280px
}

.w-\[290px\] {
	width: 290px
}

.w-\[300px\] {
	width: 300px
}

.w-\[320px\] {
	width: 320px
}

.w-\[330px\] {
	width: 330px
}

.w-\[335px\] {
	width: 335px
}

.w-\[345px\] {
	width: 345px
}

.w-\[34px\] {
	width: 34px
}

.w-\[48px\] {
	width: 48px
}

.w-\[80vw\] {
	width: 80vw
}

.w-\[82\.1875rem\] {
	width: 82.1875rem
}

.w-\[98\%\] {
	width: 98%
}

.w-full {
	width: 100%
}

.min-w-0 {
	min-width: 0
}

.min-w-\[128px\] {
	min-width: 128px
}

.max-w-\[110px\] {
	max-width: 110px
}

.max-w-\[1200px\] {
	max-width: 1200px
}

.max-w-\[250px\] {
	max-width: 250px
}

.max-w-\[300px\] {
	max-width: 300px
}

.max-w-\[320px\] {
	max-width: 320px
}

.max-w-\[600px\] {
	max-width: 600px
}

.max-w-\[60px\] {
	max-width: 60px
}

.max-w-full {
	max-width: 100%
}

.max-w-sm {
	max-width: 24rem
}

.flex-1 {
	flex: 1 1 0%
}

.shrink {
	flex-shrink: 1
}

.grow {
	flex-grow: 1
}

.grow-0 {
	flex-grow: 0
}

.translate-y-8 {
	--tw-translate-y: 2rem
}

.rotate-\[-32\.17deg\],
.translate-y-8 {
	transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))
}

.rotate-\[-32\.17deg\] {
	--tw-rotate: -32.17deg
}

.rotate-\[30deg\] {
	--tw-rotate: 30deg
}

.-scale-x-100,
.rotate-\[30deg\] {
	transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))
}

.-scale-x-100 {
	--tw-scale-x: -1
}

.transform {
	transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))
}

.transform-gpu {
	transform: translate3d(var(--tw-translate-x), var(--tw-translate-y), 0) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))
}

@keyframes fadeIn {
	0% {
		opacity: 0
	}

	to {
		opacity: 1
	}
}

.animate-fade-in {
	animation: fadeIn 2s ease-in-out forwards
}

@keyframes pulse {
	50% {
		opacity: .5
	}
}

.animate-pulse {
	animation: pulse 2s cubic-bezier(.4, 0, .6, 1) infinite
}

.cursor-pointer {
	cursor: pointer
}

.grid-cols-2 {
	grid-template-columns: repeat(2, minmax(0, 1fr))
}

.flex-col {
	flex-direction: column
}

.flex-wrap {
	flex-wrap: wrap
}

.items-start {
	align-items: flex-start
}

.items-end {
	align-items: flex-end
}

.items-center {
	align-items: center
}

.justify-start {
	justify-content: flex-start
}

.justify-center {
	justify-content: center
}

.justify-between {
	justify-content: space-between
}

.justify-evenly {
	justify-content: space-evenly
}

.gap-1 {
	gap: .25rem
}

.gap-10 {
	gap: 2.5rem
}

.gap-12 {
	gap: 3rem
}

.gap-2 {
	gap: .5rem
}

.gap-3 {
	gap: .75rem
}

.gap-4 {
	gap: 1rem
}

.gap-5 {
	gap: 1.25rem
}

.gap-6 {
	gap: 1.5rem
}

.gap-7 {
	gap: 1.75rem
}

.gap-8 {
	gap: 2rem
}

.gap-\[1\%\] {
	gap: 1%
}

.gap-\[25\%\] {
	gap: 25%
}

.gap-\[6px\] {
	gap: 6px
}

.divide-y-2>:not([hidden])~:not([hidden]) {
	--tw-divide-y-reverse: 0;
	border-top-width: calc(2px * calc(1 - var(--tw-divide-y-reverse)));
	border-bottom-width: calc(2px * var(--tw-divide-y-reverse))
}

.divide-moon-gold>:not([hidden])~:not([hidden]) {
	--tw-divide-opacity: 1;
	border-color: rgb(249 185 92/var(--tw-divide-opacity))
}

.divide-opacity-25>:not([hidden])~:not([hidden]) {
	--tw-divide-opacity: 0.25
}

.divide-opacity-30>:not([hidden])~:not([hidden]) {
	--tw-divide-opacity: 0.3
}

.overflow-hidden {
	overflow: hidden
}

.overflow-y-scroll {
	overflow-y: scroll
}

.truncate {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap
}

.break-words {
	overflow-wrap: break-word
}

.\!rounded-\[2px\] {
	border-radius: 2px !important
}

.\!rounded-sm {
	border-radius: .125rem !important
}

.rounded {
	border-radius: .25rem
}

.rounded-2xl {
	border-radius: 1rem
}

.rounded-\[3px\] {
	border-radius: 3px
}

.rounded-\[50\%\] {
	border-radius: 50%
}

.rounded-full {
	border-radius: 9999px
}

.rounded-lg {
	border-radius: .5rem
}

.rounded-md {
	border-radius: .375rem
}

.rounded-sm {
	border-radius: .125rem
}

.rounded-xl {
	border-radius: .75rem
}

.rounded-b-\[15px\] {
	border-bottom-right-radius: 15px;
	border-bottom-left-radius: 15px
}

.rounded-b-lg {
	border-bottom-right-radius: .5rem;
	border-bottom-left-radius: .5rem
}

.rounded-b-xl {
	border-bottom-right-radius: .75rem;
	border-bottom-left-radius: .75rem
}

.rounded-t-\[6px\] {
	border-top-left-radius: 6px;
	border-top-right-radius: 6px
}

.rounded-br-\[10px\] {
	border-bottom-right-radius: 10px
}

.rounded-br-\[12vw\] {
	border-bottom-right-radius: 12vw
}

.rounded-br-\[30px\] {
	border-bottom-right-radius: 30px
}

.rounded-br-\[75px\] {
	border-bottom-right-radius: 75px
}

.rounded-br-\[99px\] {
	border-bottom-right-radius: 99px
}

.rounded-tl-\[10px\] {
	border-top-left-radius: 10px
}

.rounded-tl-\[12vw\] {
	border-top-left-radius: 12vw
}

.rounded-tl-\[30px\] {
	border-top-left-radius: 30px
}

.rounded-tl-\[75px\] {
	border-top-left-radius: 75px
}

.rounded-tl-\[99px\] {
	border-top-left-radius: 99px
}

.border {
	border-width: 1px
}

.border-2 {
	border-width: 2px
}

.border-4 {
	border-width: 4px
}

.border-\[0\.5px\] {
	border-width: .5px
}

.border-\[0\.6px\] {
	border-width: .6px
}

.border-b-2 {
	border-bottom-width: 2px
}

.border-b-\[1px\] {
	border-bottom-width: 1px
}

.border-t-0 {
	border-top-width: 0
}

.border-none {
	border-style: none
}

.border-gray-100 {
	--tw-border-opacity: 1;
	border-color: rgb(243 244 246/var(--tw-border-opacity))
}

.border-moon-gold {
	--tw-border-opacity: 1;
	border-color: rgb(249 185 92/var(--tw-border-opacity))
}

.border-moon-white {
	--tw-border-opacity: 1;
	border-color: rgb(233 233 249/var(--tw-border-opacity))
}

.border-white {
	--tw-border-opacity: 1;
	border-color: rgb(255 255 255/var(--tw-border-opacity))
}

.border-yellow-200 {
	--tw-border-opacity: 1;
	border-color: rgb(254 240 138/var(--tw-border-opacity))
}

.border-b-moon-gold {
	--tw-border-opacity: 1;
	border-bottom-color: rgb(249 185 92/var(--tw-border-opacity))
}

.border-opacity-20 {
	--tw-border-opacity: 0.2
}

.border-opacity-40 {
	--tw-border-opacity: 0.4
}

.border-opacity-50 {
	--tw-border-opacity: 0.5
}

.border-opacity-60 {
	--tw-border-opacity: 0.6
}

.\!bg-moon-secondary {
	--tw-bg-opacity: 1 !important;
	background-color: rgb(215 89 79/var(--tw-bg-opacity)) !important
}

.bg-\[\#030712\] {
	--tw-bg-opacity: 1;
	background-color: rgb(3 7 18/var(--tw-bg-opacity))
}

.bg-\[\#1d1d1d\] {
	--tw-bg-opacity: 1;
	background-color: rgb(29 29 29/var(--tw-bg-opacity))
}

.bg-\[\#1e1b4b\] {
	--tw-bg-opacity: 1;
	background-color: rgb(30 27 75/var(--tw-bg-opacity))
}

.bg-\[\#251d2e\] {
	--tw-bg-opacity: 1;
	background-color: rgb(37 29 46/var(--tw-bg-opacity))
}

.bg-\[\#272a2d\] {
	--tw-bg-opacity: 1;
	background-color: rgb(39 42 45/var(--tw-bg-opacity))
}

.bg-\[\#301B3D\] {
	--tw-bg-opacity: 1;
	background-color: rgb(48 27 61/var(--tw-bg-opacity))
}

.bg-\[\#ffffff1d\] {
	background-color: #ffffff1d
}

.bg-\[\#ffffff30\] {
	background-color: #ffffff30
}

.bg-amber-700 {
	--tw-bg-opacity: 1;
	background-color: rgb(180 83 9/var(--tw-bg-opacity))
}

.bg-black {
	--tw-bg-opacity: 1;
	background-color: rgb(0 0 0/var(--tw-bg-opacity))
}

.bg-gray-200 {
	--tw-bg-opacity: 1;
	background-color: rgb(229 231 235/var(--tw-bg-opacity))
}

.bg-gray-800 {
	--tw-bg-opacity: 1;
	background-color: rgb(31 41 55/var(--tw-bg-opacity))
}

.bg-indigo-600 {
	--tw-bg-opacity: 1;
	background-color: rgb(79 70 229/var(--tw-bg-opacity))
}

.bg-indigo-700 {
	--tw-bg-opacity: 1;
	background-color: rgb(67 56 202/var(--tw-bg-opacity))
}

.bg-indigo-900 {
	--tw-bg-opacity: 1;
	background-color: rgb(49 46 129/var(--tw-bg-opacity))
}

.bg-main-background {
	--tw-bg-opacity: 1;
	background-color: rgb(9 0 19/var(--tw-bg-opacity))
}

.bg-moon-gold,
.bg-moon-orange {
	--tw-bg-opacity: 1;
	background-color: rgb(249 185 92/var(--tw-bg-opacity))
}

.bg-moon-secondary {
	--tw-bg-opacity: 1;
	background-color: rgb(215 89 79/var(--tw-bg-opacity))
}

.bg-red-600 {
	--tw-bg-opacity: 1;
	background-color: rgb(220 38 38/var(--tw-bg-opacity))
}

.bg-slate-900 {
	--tw-bg-opacity: 1;
	background-color: rgb(15 23 42/var(--tw-bg-opacity))
}

.bg-transparent {
	background-color: transparent
}

.bg-white {
	--tw-bg-opacity: 1;
	background-color: rgb(255 255 255/var(--tw-bg-opacity))
}

.bg-opacity-10 {
	--tw-bg-opacity: 0.1
}

.bg-opacity-20 {
	--tw-bg-opacity: 0.2
}

.bg-opacity-40 {
	--tw-bg-opacity: 0.4
}

.bg-opacity-60 {
	--tw-bg-opacity: 0.6
}

.bg-opacity-70 {
	--tw-bg-opacity: 0.7
}

.bg-opacity-80 {
	--tw-bg-opacity: 0.8
}

.bg-opacity-\[0\.04\] {
	--tw-bg-opacity: 0.04
}

.bg-opacity-\[0\.13\] {
	--tw-bg-opacity: 0.13
}

.bg-gradient-to-b {
	background-image: linear-gradient(to bottom, var(--tw-gradient-stops))
}

.bg-gradient-to-br {
	background-image: linear-gradient(to bottom right, var(--tw-gradient-stops))
}

.bg-gradient-to-r {
	background-image: linear-gradient(to right, var(--tw-gradient-stops))
}

.bg-gradient-to-tr {
	background-image: linear-gradient(to top right, var(--tw-gradient-stops))
}

.from-\[\#333\] {
	--tw-gradient-from: #333 var(--tw-gradient-from-position);
	--tw-gradient-to: rgba(51, 51, 51, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)
}

.from-black {
	--tw-gradient-from: #000 var(--tw-gradient-from-position);
	--tw-gradient-to: transparent var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)
}

.from-gray-900 {
	--tw-gradient-from: #111827 var(--tw-gradient-from-position);
	--tw-gradient-to: rgba(17, 24, 39, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)
}

.from-indigo-100 {
	--tw-gradient-from: #e0e7ff var(--tw-gradient-from-position);
	--tw-gradient-to: rgba(224, 231, 255, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)
}

.from-indigo-900 {
	--tw-gradient-from: #312e81 var(--tw-gradient-from-position);
	--tw-gradient-to: rgba(49, 46, 129, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)
}

.from-main-background {
	--tw-gradient-from: #090013 var(--tw-gradient-from-position);
	--tw-gradient-to: rgba(9, 0, 19, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)
}

.from-moon-gold {
	--tw-gradient-from: #f9b95c var(--tw-gradient-from-position);
	--tw-gradient-to: rgba(249, 185, 92, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)
}

.from-moon-secondary {
	--tw-gradient-from: #d7594f var(--tw-gradient-from-position);
	--tw-gradient-to: rgba(215, 89, 79, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)
}

.from-slate-900 {
	--tw-gradient-from: #0f172a var(--tw-gradient-from-position);
	--tw-gradient-to: rgba(15, 23, 42, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)
}

.from-yellow-600 {
	--tw-gradient-from: #ca8a04 var(--tw-gradient-from-position);
	--tw-gradient-to: rgba(202, 138, 4, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to)
}

.via-\[\#555\] {
	--tw-gradient-to: rgba(85, 85, 85, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), #555 var(--tw-gradient-via-position), var(--tw-gradient-to)
}

.via-amber-500 {
	--tw-gradient-to: rgba(245, 158, 11, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), #f59e0b var(--tw-gradient-via-position), var(--tw-gradient-to)
}

.via-black {
	--tw-gradient-to: transparent var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), #000 var(--tw-gradient-via-position), var(--tw-gradient-to)
}

.via-gray-800 {
	--tw-gradient-to: rgba(31, 41, 55, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), #1f2937 var(--tw-gradient-via-position), var(--tw-gradient-to)
}

.via-gray-900 {
	--tw-gradient-to: rgba(17, 24, 39, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), #111827 var(--tw-gradient-via-position), var(--tw-gradient-to)
}

.via-indigo-900 {
	--tw-gradient-to: rgba(49, 46, 129, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), #312e81 var(--tw-gradient-via-position), var(--tw-gradient-to)
}

.via-moon-orange {
	--tw-gradient-to: rgba(249, 185, 92, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), #f9b95c var(--tw-gradient-via-position), var(--tw-gradient-to)
}

.via-moon-secondary {
	--tw-gradient-to: rgba(215, 89, 79, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), #d7594f var(--tw-gradient-via-position), var(--tw-gradient-to)
}

.via-slate-900 {
	--tw-gradient-to: rgba(15, 23, 42, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), #0f172a var(--tw-gradient-via-position), var(--tw-gradient-to)
}

.via-yellow-500 {
	--tw-gradient-to: rgba(234, 179, 8, 0) var(--tw-gradient-to-position);
	--tw-gradient-stops: var(--tw-gradient-from), #eab308 var(--tw-gradient-via-position), var(--tw-gradient-to)
}

.to-\[\#333\] {
	--tw-gradient-to: #333 var(--tw-gradient-to-position)
}

.to-black {
	--tw-gradient-to: #000 var(--tw-gradient-to-position)
}

.to-gray-700 {
	--tw-gradient-to: #374151 var(--tw-gradient-to-position)
}

.to-indigo-100 {
	--tw-gradient-to: #e0e7ff var(--tw-gradient-to-position)
}

.to-indigo-900 {
	--tw-gradient-to: #312e81 var(--tw-gradient-to-position)
}

.to-main-background {
	--tw-gradient-to: #090013 var(--tw-gradient-to-position)
}

.to-moon-gold {
	--tw-gradient-to: #f9b95c var(--tw-gradient-to-position)
}

.to-moon-secondary {
	--tw-gradient-to: #d7594f var(--tw-gradient-to-position)
}

.to-orange-600 {
	--tw-gradient-to: #ea580c var(--tw-gradient-to-position)
}

.bg-\[length\:400px_400px\] {
	background-size: 400px 400px
}

.bg-cover {
	background-size: cover
}

.bg-clip-text {
	-webkit-background-clip: text;
	background-clip: text
}

.stroke-white {
	stroke: #fff
}

.object-cover {
	-o-object-fit: cover;
	object-fit: cover
}

.object-center {
	-o-object-position: center;
	object-position: center
}

.p-0 {
	padding: 0
}

.p-2 {
	padding: .5rem
}

.p-4 {
	padding: 1rem
}

.p-\[2px\] {
	padding: 2px
}

.\!px-3 {
	padding-left: .75rem !important;
	padding-right: .75rem !important
}

.\!px-5 {
	padding-left: 1.25rem !important;
	padding-right: 1.25rem !important
}

.px-1 {
	padding-left: .25rem;
	padding-right: .25rem
}

.px-2 {
	padding-left: .5rem;
	padding-right: .5rem
}

.px-3 {
	padding-left: .75rem;
	padding-right: .75rem
}

.px-4 {
	padding-left: 1rem;
	padding-right: 1rem
}

.px-5 {
	padding-left: 1.25rem;
	padding-right: 1.25rem
}

.px-6 {
	padding-left: 1.5rem;
	padding-right: 1.5rem
}

.px-\[10px\] {
	padding-left: 10px;
	padding-right: 10px
}

.py-1 {
	padding-top: .25rem;
	padding-bottom: .25rem
}

.py-2 {
	padding-top: .5rem;
	padding-bottom: .5rem
}

.py-2\.5 {
	padding-top: .625rem;
	padding-bottom: .625rem
}

.py-3 {
	padding-top: .75rem;
	padding-bottom: .75rem
}

.py-4 {
	padding-top: 1rem;
	padding-bottom: 1rem
}

.py-5 {
	padding-top: 1.25rem;
	padding-bottom: 1.25rem
}

.py-\[10\%\] {
	padding-top: 10%;
	padding-bottom: 10%
}

.py-\[4px\] {
	padding-top: 4px;
	padding-bottom: 4px
}

.py-\[5px\] {
	padding-top: 5px;
	padding-bottom: 5px
}

.py-\[6px\] {
	padding-top: 6px;
	padding-bottom: 6px
}

.pb-12 {
	padding-bottom: 3rem
}

.pb-2 {
	padding-bottom: .5rem
}

.pb-24 {
	padding-bottom: 6rem
}

.pb-32 {
	padding-bottom: 8rem
}

.pb-\[128px\] {
	padding-bottom: 128px
}

.pb-\[2px\] {
	padding-bottom: 2px
}

.pl-10 {
	padding-left: 2.5rem
}

.pl-3 {
	padding-left: .75rem
}

.pl-4 {
	padding-left: 1rem
}

.pl-5 {
	padding-left: 1.25rem
}

.pl-6 {
	padding-left: 1.5rem
}

.pr-2 {
	padding-right: .5rem
}

.pr-3 {
	padding-right: .75rem
}

.pr-6 {
	padding-right: 1.5rem
}

.pr-9 {
	padding-right: 2.25rem
}

.pr-\[7\%\] {
	padding-right: 7%
}

.pt-1 {
	padding-top: .25rem
}

.pt-10 {
	padding-top: 2.5rem
}

.pt-3 {
	padding-top: .75rem
}

.text-left {
	text-align: left
}

.text-center {
	text-align: center
}

.text-right {
	text-align: right
}

.font-GoodTimes {
	font-family: Good Times, sans-serif
}

.font-mono {
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace
}

.text-2xl {
	font-size: 1.5rem;
	line-height: 2rem
}

.text-3xl {
	font-size: 1.875rem;
	line-height: 2.25rem
}

.text-4xl {
	font-size: 2.25rem;
	line-height: 2.5rem
}

.text-\[110\%\] {
	font-size: 110%
}

.text-\[17px\] {
	font-size: 17px
}

.text-\[18px\] {
	font-size: 18px
}

.text-\[20px\] {
	font-size: 20px
}

.text-\[23px\] {
	font-size: 23px
}

.text-\[32px\] {
	font-size: 32px
}

.text-\[34px\] {
	font-size: 34px
}

.text-\[50\%\] {
	font-size: 50%
}

.text-\[75\%\] {
	font-size: 75%
}

.text-\[80\%\] {
	font-size: 80%
}

.text-\[90\%\] {
	font-size: 90%
}

.text-base {
	font-size: 1rem;
	line-height: 1.5rem
}

.text-lg {
	font-size: 1.125rem;
	line-height: 1.75rem
}

.text-sm {
	font-size: .875rem;
	line-height: 1.25rem
}

.text-xl {
	font-size: 1.25rem;
	line-height: 1.75rem
}

.text-xs {
	font-size: .75rem;
	line-height: 1rem
}

.font-bold {
	font-weight: 700
}

.font-extrabold {
	font-weight: 800
}

.font-light {
	font-weight: 300
}

.font-medium {
	font-weight: 500
}

.font-semibold {
	font-weight: 600
}

.uppercase {
	text-transform: uppercase
}

.capitalize {
	text-transform: capitalize
}

.italic {
	font-style: italic
}

.leading-5 {
	line-height: 1.25rem
}

.leading-6 {
	line-height: 1.5rem
}

.leading-\[25px\] {
	line-height: 25px
}

.leading-relaxed {
	line-height: 1.625
}

.tracking-wide {
	letter-spacing: .025em
}

.tracking-wider {
	letter-spacing: .05em
}

.tracking-widest {
	letter-spacing: .1em
}

.\!text-white {
	--tw-text-opacity: 1 !important;
	color: rgb(255 255 255/var(--tw-text-opacity)) !important
}

.text-\[\#6433b9\] {
	--tw-text-opacity: 1;
	color: rgb(100 51 185/var(--tw-text-opacity))
}

.text-black {
	--tw-text-opacity: 1;
	color: rgb(0 0 0/var(--tw-text-opacity))
}

.text-gray-100 {
	--tw-text-opacity: 1;
	color: rgb(243 244 246/var(--tw-text-opacity))
}

.text-gray-200 {
	--tw-text-opacity: 1;
	color: rgb(229 231 235/var(--tw-text-opacity))
}

.text-indigo-100 {
	--tw-text-opacity: 1;
	color: rgb(224 231 255/var(--tw-text-opacity))
}

.text-indigo-300 {
	--tw-text-opacity: 1;
	color: rgb(165 180 252/var(--tw-text-opacity))
}

.text-indigo-500 {
	--tw-text-opacity: 1;
	color: rgb(99 102 241/var(--tw-text-opacity))
}

.text-moon-gold,
.text-moon-orange {
	--tw-text-opacity: 1;
	color: rgb(249 185 92/var(--tw-text-opacity))
}

.text-moon-secondary {
	--tw-text-opacity: 1;
	color: rgb(215 89 79/var(--tw-text-opacity))
}

.text-moon-white {
	--tw-text-opacity: 1;
	color: rgb(233 233 249/var(--tw-text-opacity))
}

.text-red-400 {
	--tw-text-opacity: 1;
	color: rgb(248 113 113/var(--tw-text-opacity))
}

.text-transparent {
	color: transparent
}

.text-white {
	--tw-text-opacity: 1;
	color: rgb(255 255 255/var(--tw-text-opacity))
}

.text-yellow-200 {
	color: rgb(254 240 138/var(--tw-text-opacity))
}

.text-opacity-100,
.text-yellow-200 {
	--tw-text-opacity: 1
}

.text-opacity-60 {
	--tw-text-opacity: 0.6
}

.text-opacity-80 {
	--tw-text-opacity: 0.8
}

.text-opacity-90 {
	--tw-text-opacity: 0.9
}

.opacity-0 {
	opacity: 0
}

.opacity-100 {
	opacity: 1
}

.opacity-40 {
	opacity: .4
}

.opacity-50 {
	opacity: .5
}

.opacity-60 {
	opacity: .6
}

.opacity-70 {
	opacity: .7
}

.opacity-80 {
	opacity: .8
}

.opacity-90 {
	opacity: .9
}

.opacity-\[0\.15\] {
	opacity: .15
}

.opacity-\[1\] {
	opacity: 1
}

.\!shadow {
	--tw-shadow: 0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1) !important;
	--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color) !important;
	box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow) !important
}

.shadow {
	--tw-shadow: 0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1);
	--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
	box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)
}

.\!shadow-white {
	--tw-shadow-color: #fff !important;
	--tw-shadow: var(--tw-shadow-colored) !important
}

.shadow-moon-white {
	--tw-shadow-color: #e9e9f9;
	--tw-shadow: var(--tw-shadow-colored)
}

.shadow-white {
	--tw-shadow-color: #fff;
	--tw-shadow: var(--tw-shadow-colored)
}

.ring-1 {
	--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
	--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
	box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)
}

.ring-indigo-200 {
	--tw-ring-opacity: 1;
	--tw-ring-color: rgb(199 210 254/var(--tw-ring-opacity))
}

.ring-indigo-500 {
	--tw-ring-opacity: 1;
	--tw-ring-color: rgb(99 102 241/var(--tw-ring-opacity))
}

.ring-moon-gold,
.ring-moon-orange {
	--tw-ring-opacity: 1;
	--tw-ring-color: rgb(249 185 92/var(--tw-ring-opacity))
}

.ring-moon-white {
	--tw-ring-opacity: 1;
	--tw-ring-color: rgb(233 233 249/var(--tw-ring-opacity))
}

.ring-white {
	--tw-ring-opacity: 1;
	--tw-ring-color: rgb(255 255 255/var(--tw-ring-opacity))
}

.ring-opacity-50 {
	--tw-ring-opacity: 0.5
}

.blur {
	--tw-blur: blur(8px)
}

.blur,
.blur-2xl {
	filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)
}

.blur-2xl {
	--tw-blur: blur(40px)
}

.blur-\[85px\] {
	--tw-blur: blur(85px)
}

.blur-\[85px\],
.filter {
	filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)
}

.backdrop-blur-\[50px\] {
	--tw-backdrop-blur: blur(50px)
}

.backdrop-blur-\[50px\],
.backdrop-blur-md {
	-webkit-backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);
	backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)
}

.backdrop-blur-md {
	--tw-backdrop-blur: blur(12px)
}

.transition-all {
	transition-property: all;
	transition-timing-function: cubic-bezier(.4, 0, .2, 1);
	transition-duration: .15s
}

.transition-colors {
	transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
	transition-timing-function: cubic-bezier(.4, 0, .2, 1);
	transition-duration: .15s
}

.transition-opacity {
	transition-property: opacity;
	transition-timing-function: cubic-bezier(.4, 0, .2, 1);
	transition-duration: .15s
}

.duration-100 {
	transition-duration: .1s
}

.duration-150 {
	transition-duration: .15s
}

.duration-200 {
	transition-duration: .2s
}

.duration-300 {
	transition-duration: .3s
}

.duration-500 {
	transition-duration: .5s
}

.duration-\[1s\] {
	transition-duration: 1s
}

.ease-in {
	transition-timing-function: cubic-bezier(.4, 0, 1, 1)
}

.ease-in-out {
	transition-timing-function: cubic-bezier(.4, 0, .2, 1)
}

body,
html {
	padding: 0;
	margin: 0;
	font-family: Roboto Mono, monospace, sans-serif;
	background: #090013
}

* {
	box-sizing: border-box
}

html {
	color-scheme: dark
}

@font-face {
	font-family: Good Times;
	src: url(/_next/static/media/goodtimes.c059b8a5.otf) format("opentype")
}

@font-face {
	font-family: Roboto Mono;
	src: url(/_next/static/media/RobotoMono.2d05b25e.ttf)
}

footer {
	background: linear-gradient(270deg, hsla(0, 0%, 100%, 0) -.8%, hsla(0, 0%, 100%, .042) 49.61%, hsla(0, 0%, 100%, 0) 101.09%)
}

::-webkit-scrollbar {
	width: 12px
}

::-webkit-scrollbar-track {
	border-radius: 30px
}

::-webkit-scrollbar-thumb {
	background: #ffffff1d;
	border-radius: 30px
}

::-webkit-scrollbar-thumb:hover {
	background: #ffffff3b
}

.connect-button {
	background: #d7594f !important;
	font-family: Roboto Mono, monospace, sans-serif !important;
	padding: 14px 16px !important;
	border-radius: 2px !important;
	transition: .3s !important
}

.connect-button:hover {
	border-top-left-radius: 22px !important;
	border-bottom-right-radius: 22px !important;
	transition: .5s !important
}

.bridge-button {
	width: 100%;
	background: #6433b9 !important;
	font-family: Roboto Mono, monospace, sans-serif !important;
	padding: 14px 16px !important;
	border-radius: 2px !important;
	transition: .3s !important
}

.bridge-button:hover {
	border-top-left-radius: 22px !important;
	border-bottom-right-radius: 22px !important;
	transition: .5s !important
}

.web3-button {
	background: #1d1d1d75 !important;
	color: hsla(0, 0%, 100%, .596) !important;
	font-family: Roboto Mono, monospace, sans-serif !important;
	padding: 10px 12px !important;
	border-radius: 4px !important;
	transition: .3s !important
}

.web3-button:hover {
	border-top-left-radius: 22px !important;
	border-bottom-right-radius: 22px !important;
	background: #1d1d1dec !important;
	transition: .5s !important
}

.web3-button-primary:hover {
	color: #f9b916 !important;
	transition: .5s !important
}

.web3-button-secondary:hover {
	color: #d7594f !important;
	transition: .5s !important
}

.slide-menu-animation {
	animation: slide-top .5s cubic-bezier(.25, .46, .45, .94) both
}

@keyframes slide-top {
	0% {
		transform: translateY(100px)
	}

	to {
		transform: translateY(0)
	}
}

.placeholder\:text-sm::-moz-placeholder {
	font-size: .875rem;
	line-height: 1.25rem
}

.placeholder\:text-sm::placeholder {
	font-size: .875rem;
	line-height: 1.25rem
}

.placeholder\:opacity-40::-moz-placeholder {
	opacity: .4
}

.placeholder\:opacity-40::placeholder {
	opacity: .4
}

.hover\:translate-y-\[-4\%\]:hover {
	--tw-translate-y: -4%
}

.hover\:scale-105:hover,
.hover\:translate-y-\[-4\%\]:hover {
	transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))
}

.hover\:scale-105:hover {
	--tw-scale-x: 1.05;
	--tw-scale-y: 1.05
}

.hover\:scale-110:hover {
	--tw-scale-x: 1.1;
	--tw-scale-y: 1.1
}

.hover\:scale-110:hover,
.hover\:scale-\[1\.035\]:hover {
	transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))
}

.hover\:scale-\[1\.035\]:hover {
	--tw-scale-x: 1.035;
	--tw-scale-y: 1.035
}

.hover\:scale-\[1\.03\]:hover {
	--tw-scale-x: 1.03;
	--tw-scale-y: 1.03
}

.hover\:scale-\[1\.03\]:hover,
.hover\:scale-\[1\.35\]:hover {
	transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))
}

.hover\:scale-\[1\.35\]:hover {
	--tw-scale-x: 1.35;
	--tw-scale-y: 1.35
}

.hover\:rounded:hover {
	border-radius: .25rem
}

.hover\:border-yellow-600:hover {
	--tw-border-opacity: 1;
	border-color: rgb(202 138 4/var(--tw-border-opacity))
}

.hover\:bg-indigo-900:hover {
	--tw-bg-opacity: 1;
	background-color: rgb(49 46 129/var(--tw-bg-opacity))
}

.hover\:bg-slate-900:hover {
	--tw-bg-opacity: 1;
	background-color: rgb(15 23 42/var(--tw-bg-opacity))
}

.hover\:bg-gradient-to-b:hover {
	background-image: linear-gradient(to bottom, var(--tw-gradient-stops))
}

.hover\:text-4xl:hover {
	font-size: 2.25rem;
	line-height: 2.5rem
}

.hover\:text-\[\#e9e9f9\]:hover {
	--tw-text-opacity: 1;
	color: rgb(233 233 249/var(--tw-text-opacity))
}

.hover\:text-orange-500:hover {
	--tw-text-opacity: 1;
	color: rgb(249 115 22/var(--tw-text-opacity))
}

.hover\:text-white:hover {
	--tw-text-opacity: 1;
	color: rgb(255 255 255/var(--tw-text-opacity))
}

.hover\:text-opacity-80:hover {
	--tw-text-opacity: 0.8
}

.hover\:opacity-100:hover {
	opacity: 1
}

.hover\:ring:hover {
	--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
	--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color)
}

.hover\:ring-1:hover,
.hover\:ring:hover {
	box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)
}

.hover\:ring-1:hover {
	--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
	--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)
}

.focus\:ring:focus {
	--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
	--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color)
}

.focus\:ring-1:focus,
.focus\:ring:focus {
	box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)
}

.focus\:ring-1:focus {
	--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
	--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)
}

.group:hover .group-hover\:scale-110 {
	--tw-scale-x: 1.1;
	--tw-scale-y: 1.1;
	transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))
}

.group:hover .group-hover\:border-moon-gold {
	--tw-border-opacity: 1;
	border-color: rgb(249 185 92/var(--tw-border-opacity))
}

.group:hover .group-hover\:text-white {
	--tw-text-opacity: 1;
	color: rgb(255 255 255/var(--tw-text-opacity))
}

.group:hover .group-hover\:ring {
	--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
	--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
	box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)
}

.group:hover .group-hover\:drop-shadow-\[0px_0px_10px_\#d1d1d1\] {
	--tw-drop-shadow: drop-shadow(0px 0px 10px #d1d1d1)
}

.group:hover .group-hover\:drop-shadow-\[0px_0px_10px_\#d1d1d1\],
.group:hover .group-hover\:drop-shadow-\[0px_10px_15px_\#d1d1d1\] {
	filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)
}

.group:hover .group-hover\:drop-shadow-\[0px_10px_15px_\#d1d1d1\] {
	--tw-drop-shadow: drop-shadow(0px 10px 15px #d1d1d1)
}

.peer:focus~.peer-focus\:opacity-80 {
	opacity: .8
}

@media (min-width:640px) {
	.sm\:ml-2 {
		margin-left: .5rem
	}

	.sm\:inline-block {
		display: inline-block
	}

	.sm\:flex-row {
		flex-direction: row
	}

	.sm\:items-center {
		align-items: center
	}

	.sm\:gap-8 {
		gap: 2rem
	}

	.sm\:text-2xl {
		font-size: 1.5rem;
		line-height: 2rem
	}
}

@media (min-width:768px) {
	.md\:top-\[15\%\] {
		top: 15%
	}

	.md\:-mt-32 {
		margin-top: -8rem
	}

	.md\:mb-12 {
		margin-bottom: 3rem
	}

	.md\:ml-4 {
		margin-left: 1rem
	}

	.md\:ml-5 {
		margin-left: 1.25rem
	}

	.md\:mt-0 {
		margin-top: 0
	}

	.md\:mt-12 {
		margin-top: 3rem
	}

	.md\:mt-16 {
		margin-top: 4rem
	}

	.md\:mt-2 {
		margin-top: .5rem
	}

	.md\:mt-20 {
		margin-top: 5rem
	}

	.md\:mt-24 {
		margin-top: 6rem
	}

	.md\:mt-32 {
		margin-top: 8rem
	}

	.md\:mt-6 {
		margin-top: 1.5rem
	}

	.md\:block {
		display: block
	}

	.md\:flex {
		display: flex
	}

	.md\:grid {
		display: grid
	}

	.md\:hidden {
		display: none
	}

	.md\:h-\[500px\] {
		height: 500px
	}

	.md\:w-1\/3 {
		width: 33.333333%
	}

	.md\:w-\[260px\] {
		width: 260px
	}

	.md\:w-\[361px\] {
		width: 361px
	}

	.md\:w-\[400px\] {
		width: 400px
	}

	.md\:w-\[420px\] {
		width: 420px
	}

	.md\:max-w-\[500px\] {
		max-width: 500px
	}

	.md\:grid-flow-row {
		grid-auto-flow: row
	}

	.md\:grid-cols-2 {
		grid-template-columns: repeat(2, minmax(0, 1fr))
	}

	.md\:flex-row {
		flex-direction: row
	}

	.md\:flex-row-reverse {
		flex-direction: row-reverse
	}

	.md\:items-start {
		align-items: flex-start
	}

	.md\:justify-start {
		justify-content: flex-start
	}

	.md\:justify-center {
		justify-content: center
	}

	.md\:gap-12 {
		gap: 3rem
	}

	.md\:gap-3 {
		gap: .75rem
	}

	.md\:gap-5 {
		gap: 1.25rem
	}

	.md\:gap-\[34px\] {
		gap: 34px
	}

	.md\:bg-white {
		--tw-bg-opacity: 1;
		background-color: rgb(255 255 255/var(--tw-bg-opacity))
	}

	.md\:bg-opacity-5 {
		--tw-bg-opacity: 0.05
	}

	.md\:px-0 {
		padding-left: 0;
		padding-right: 0
	}

	.md\:px-10 {
		padding-left: 2.5rem;
		padding-right: 2.5rem
	}

	.md\:px-2 {
		padding-left: .5rem;
		padding-right: .5rem
	}

	.md\:px-\[2\%\] {
		padding-left: 2%;
		padding-right: 2%
	}

	.md\:py-10 {
		padding-top: 2.5rem;
		padding-bottom: 2.5rem
	}

	.md\:py-\[5\%\] {
		padding-top: 5%;
		padding-bottom: 5%
	}

	.md\:py-\[7px\] {
		padding-top: 7px;
		padding-bottom: 7px
	}

	.md\:pl-12 {
		padding-left: 3rem
	}

	.md\:pl-36 {
		padding-left: 9rem
	}

	.md\:pr-5 {
		padding-right: 1.25rem
	}

	.md\:pt-12 {
		padding-top: 3rem
	}

	.md\:text-left {
		text-align: left
	}

	.md\:text-3xl {
		font-size: 1.875rem;
		line-height: 2.25rem
	}

	.md\:text-4xl {
		font-size: 2.25rem;
		line-height: 2.5rem
	}

	.md\:text-base {
		font-size: 1rem;
		line-height: 1.5rem
	}

	.md\:leading-relaxed {
		line-height: 1.625
	}

	.md\:tracking-wide {
		letter-spacing: .025em
	}

	.md\:placeholder\:text-base::-moz-placeholder {
		font-size: 1rem;
		line-height: 1.5rem
	}

	.md\:placeholder\:text-base::placeholder {
		font-size: 1rem;
		line-height: 1.5rem
	}
}

@media (min-width:960px) {
	.tablet\:sticky {
		position: sticky
	}

	.tablet\:mr-4 {
		margin-right: 1rem
	}

	.tablet\:mt-0 {
		margin-top: 0
	}

	.tablet\:mt-4 {
		margin-top: 1rem
	}

	.tablet\:w-full {
		width: 100%
	}

	.tablet\:min-w-\[370px\] {
		min-width: 370px
	}

	.tablet\:max-w-\[450px\] {
		max-width: 450px
	}

	.tablet\:flex-shrink {
		flex-shrink: 1
	}

	.tablet\:flex-row {
		flex-direction: row
	}

	.tablet\:pb-0 {
		padding-bottom: 0
	}
}

@media (min-width:1024px) {
	.lg\:absolute {
		position: absolute
	}

	.lg\:left-\[calc\(-90\%-30rem\)\] {
		left: calc(-90% - 30rem)
	}

	.lg\:top-\[calc\(50\%-30rem\)\] {
		top: calc(50% - 30rem)
	}

	.lg\:my-10 {
		margin-top: 2.5rem;
		margin-bottom: 2.5rem
	}

	.lg\:ml-12 {
		margin-left: 3rem
	}

	.lg\:ml-4 {
		margin-left: 1rem
	}

	.lg\:ml-6 {
		margin-left: 1.5rem
	}

	.lg\:ml-8 {
		margin-left: 2rem
	}

	.lg\:ml-\[13px\] {
		margin-left: 13px
	}

	.lg\:mt-10 {
		margin-top: 2.5rem
	}

	.lg\:mt-12 {
		margin-top: 3rem
	}

	.lg\:mt-20 {
		margin-top: 5rem
	}

	.lg\:mt-32 {
		margin-top: 8rem
	}

	.lg\:mt-4 {
		margin-top: 1rem
	}

	.lg\:mt-6 {
		margin-top: 1.5rem
	}

	.lg\:mt-7 {
		margin-top: 1.75rem
	}

	.lg\:block {
		display: block
	}

	.lg\:inline-block {
		display: inline-block
	}

	.lg\:grid {
		display: grid
	}

	.lg\:hidden {
		display: none
	}

	.lg\:h-\[374px\] {
		height: 374px
	}

	.lg\:h-\[443\.38px\] {
		height: 443.38px
	}

	.lg\:min-h-\[38px\] {
		min-height: 38px
	}

	.lg\:w-8 {
		width: 2rem
	}

	.lg\:w-\[300px\] {
		width: 300px
	}

	.lg\:w-\[350px\] {
		width: 350px
	}

	.lg\:w-\[355px\] {
		width: 355px
	}

	.lg\:min-w-\[142px\] {
		min-width: 142px
	}

	.lg\:max-w-\[320px\] {
		max-width: 320px
	}

	.lg\:max-w-md {
		max-width: 28rem
	}

	.lg\:max-w-none {
		max-width: none
	}

	.lg\:grid-flow-row {
		grid-auto-flow: row
	}

	.lg\:grid-cols-2 {
		grid-template-columns: repeat(2, minmax(0, 1fr))
	}

	.lg\:gap-12 {
		gap: 3rem
	}

	.lg\:gap-16 {
		gap: 4rem
	}

	.lg\:gap-6 {
		gap: 1.5rem
	}

	.lg\:gap-7 {
		gap: 1.75rem
	}

	.lg\:gap-9 {
		gap: 2.25rem
	}

	.lg\:rounded-xl {
		border-radius: .75rem
	}

	.lg\:rounded-br-\[10vw\] {
		border-bottom-right-radius: 10vw
	}

	.lg\:rounded-tl-\[10vw\] {
		border-top-left-radius: 10vw
	}

	.lg\:px-3 {
		padding-left: .75rem;
		padding-right: .75rem
	}

	.lg\:px-\[30px\] {
		padding-left: 30px;
		padding-right: 30px
	}

	.lg\:py-2 {
		padding-top: .5rem;
		padding-bottom: .5rem
	}

	.lg\:py-5 {
		padding-top: 1.25rem;
		padding-bottom: 1.25rem
	}

	.lg\:pl-2 {
		padding-left: .5rem
	}

	.lg\:pr-4 {
		padding-right: 1rem
	}

	.lg\:pt-12 {
		padding-top: 3rem
	}

	.lg\:pt-16 {
		padding-top: 4rem
	}

	.lg\:text-3xl {
		font-size: 1.875rem;
		line-height: 2.25rem
	}

	.lg\:text-4xl {
		font-size: 2.25rem;
		line-height: 2.5rem
	}

	.lg\:text-5xl {
		font-size: 3rem;
		line-height: 1
	}

	.lg\:text-\[32px\] {
		font-size: 32px
	}

	.lg\:text-base {
		font-size: 1rem;
		line-height: 1.5rem
	}

	.lg\:text-lg {
		font-size: 1.125rem;
		line-height: 1.75rem
	}

	.lg\:text-xl {
		font-size: 1.25rem;
		line-height: 1.75rem
	}

	.lg\:opacity-30 {
		opacity: .3
	}

	.lg\:opacity-50 {
		opacity: .5
	}

	.lg\:opacity-70 {
		opacity: .7
	}

	.lg\:blur-3xl {
		--tw-blur: blur(64px);
		filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)
	}

	.hover\:lg\:bg-gradient-to-br:hover,
	.lg\:hover\:bg-gradient-to-br:hover {
		background-image: linear-gradient(to bottom right, var(--tw-gradient-stops))
	}

	.lg\:hover\:ring-1:hover {
		--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
		--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color)
	}

	.lg\:hover\:ring-1:hover,
	.lg\:hover\:ring-2:hover {
		box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)
	}

	.lg\:hover\:ring-2:hover {
		--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
		--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color)
	}
}

@media (min-width:1280px) {
	.xl\:left-\[413px\] {
		left: 413px
	}

	.xl\:left-\[calc\(-40\%-30rem\)\] {
		left: calc(-40% - 30rem)
	}

	.xl\:right-72 {
		right: 18rem
	}

	.xl\:top-96 {
		top: 24rem
	}

	.xl\:-mt-16 {
		margin-top: -4rem
	}

	.xl\:-mt-4 {
		margin-top: -1rem
	}

	.xl\:ml-10 {
		margin-left: 2.5rem
	}

	.xl\:mt-9 {
		margin-top: 2.25rem
	}

	.xl\:h-\[320px\] {
		height: 320px
	}

	.xl\:h-\[499\.58px\] {
		height: 499.58px
	}

	.xl\:h-\[6px\] {
		height: 6px
	}

	.xl\:w-\[189px\] {
		width: 189px
	}

	.xl\:w-\[320px\] {
		width: 320px
	}

	.xl\:w-\[390px\] {
		width: 390px
	}

	.xl\:w-\[400px\] {
		width: 400px
	}

	.xl\:w-\[520px\] {
		width: 520px
	}

	.xl\:max-w-\[420px\] {
		max-width: 420px
	}

	.xl\:max-w-\[600px\] {
		max-width: 600px
	}

	.xl\:max-w-\[90px\] {
		max-width: 90px
	}

	.xl\:grid-cols-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr))
	}

	.xl\:gap-14 {
		gap: 3.5rem
	}

	.xl\:gap-20 {
		gap: 5rem
	}

	.xl\:gap-28 {
		gap: 7rem
	}

	.xl\:gap-9 {
		gap: 2.25rem
	}

	.xl\:px-3 {
		padding-left: .75rem;
		padding-right: .75rem
	}

	.xl\:px-4 {
		padding-left: 1rem;
		padding-right: 1rem
	}

	.xl\:py-2 {
		padding-top: .5rem;
		padding-bottom: .5rem
	}

	.xl\:py-3 {
		padding-top: .75rem;
		padding-bottom: .75rem
	}

	.xl\:pb-24 {
		padding-bottom: 6rem
	}

	.xl\:pl-44 {
		padding-left: 11rem
	}

	.xl\:pt-20 {
		padding-top: 5rem
	}

	.xl\:text-4xl {
		font-size: 2.25rem;
		line-height: 2.5rem
	}

	.xl\:text-6xl {
		font-size: 3.75rem;
		line-height: 1
	}

	.xl\:text-base {
		font-size: 1rem;
		line-height: 1.5rem
	}

	.xl\:text-lg {
		font-size: 1.125rem;
		line-height: 1.75rem
	}

	.xl\:leading-loose {
		line-height: 2
	}

	.xl\:hover\:ring-4:hover {
		--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
		--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);
		box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)
	}
}

@media (min-width:1536px) {
	.\32xl\:left-\[553px\] {
		left: 553px
	}

	.\32xl\:left-\[calc\(-5\%-30rem\)\] {
		left: calc(-5% - 30rem)
	}

	.\32xl\:top-\[calc\(50\%-30rem\)\] {
		top: calc(50% - 30rem)
	}

	.\32xl\:-mt-0 {
		margin-top: 0
	}

	.\32xl\:ml-12 {
		margin-left: 3rem
	}

	.\32xl\:mt-48 {
		margin-top: 12rem
	}

	.\32xl\:mt-\[26px\] {
		margin-top: 26px
	}

	.\32xl\:mt-\[50px\] {
		margin-top: 50px
	}

	.\32xl\:block {
		display: block
	}

	.\32xl\:hidden {
		display: none
	}

	.\32xl\:h-\[564px\] {
		height: 564px
	}

	.\32xl\:w-11 {
		width: 2.75rem
	}

	.\32xl\:w-\[441px\] {
		width: 441px
	}

	.\32xl\:w-\[536px\] {
		width: 536px
	}

	.\32xl\:max-w-\[658px\] {
		max-width: 658px
	}

	.\32xl\:max-w-\[700px\] {
		max-width: 700px
	}

	.\32xl\:gap-11 {
		gap: 2.75rem
	}

	.\32xl\:gap-16 {
		gap: 4rem
	}

	.\32xl\:gap-40 {
		gap: 10rem
	}

	.\32xl\:pb-48 {
		padding-bottom: 12rem
	}

	.\32xl\:pl-52 {
		padding-left: 13rem
	}

	.\32xl\:text-7xl {
		font-size: 4.5rem;
		line-height: 1
	}
}
`