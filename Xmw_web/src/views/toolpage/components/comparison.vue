<template>
	<div class="zxui-img-comparison">
		<div :id="id" class="comparison-slider">
			<img :style="{ width: width, height: height }" :src="src2" alt="" />
			<div class="comparison-reveal"><img :style="{ width: width, height: height }" :src="src1" alt="" /></div>
		</div>
	</div>
</template>
<script>
import { comparisonSlider } from './comparison.js';

function uuid(length) {
	return Number(
		Math.random()
			.toString()
			.substr(3, length) + Date.now()
	).toString(36);
}

export default {
	props: {
		id: {
			type: String,
			default: 'slider-' + uuid()
		},
		width: {
			type: String,
			default: 'auto'
		},
		height: {
			type: String,
			default: 'auto'
		},
		src1: {
			type: String,
			default: ''
		},
		src2: {
			type: String,
			default: ''
		},
		start: {
			type: String,
			default: '50'
		}
	},
	data() {
		return {};
	},
	computed: {},
	watch: {},
	mounted() {
		new comparisonSlider(document.getElementById(this.id), this.start);
	},
	destroyed() {},
	methods: {}
};
</script>
<style lang="scss">
$prefix: 'comparison';
$initial-reveal: 50%;
.zxui-img-comparison {
	.#{$prefix}-slider {
		*,
		&:before,
		&:after,
		*:before,
		*:after {
			box-sizing: border-box;
		}

		display: inline-block;
		position: relative;
		overflow: hidden;

		img,
		svg {
			vertical-align: bottom;
		}

		& > * {
			height: 100%;
		}

		& > img {
			max-width: 100%;
			height: auto;
		}
	}

	.#{$prefix}-reveal {
		position: absolute;
		left: 0;
		top: 0;
		right: 100% - $initial-reveal;
		overflow: hidden;
		z-index: 1;
		opacity: 0;
		transition: opacity 0.35s;
		border-right: 2px solid #fff;

		& > :first-child {
			width: 100% * 100% / $initial-reveal;
			max-width: none;
			height: 100%;
		}

		& > img:first-child {
			height: auto;
		}
	}

	.#{$prefix}-range {
		position: absolute;
		z-index: 2;
		top: 0;
		bottom: 0;
		height: 100%;
		margin: 0;
		left: -1px;
		width: calc(100% + 2px);
		cursor: pointer;
		-webkit-appearance: slider-horizontal !important;
		-moz-appearance: none;
		opacity: 0;
		-ms-touch-action: auto;
		touch-action: auto;

		&::-webkit-slider-thumb {
			-webkit-appearance: none;
			height: 300vh;
		}

		&::-moz-range-thumb {
			-webkit-appearance: none;
			height: 300vh;
		}

		&::-ms-tooltip {
			display: none;
		}
	}

	.#{$prefix}-handle {
		position: absolute;
		z-index: 2;
		pointer-events: none;
		opacity: 0;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, 0);
		color: #000;
		background: #ffffff;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		box-shadow: 0 0 6px rgba(0, 0, 0, 0);
		transition: background 0.3s, box-shadow 0.3s, opacity 0.5s 0.25s;

		&:before,
		&:after {
			content: '';
			position: absolute;
			width: 10px;
			height: 10px;
			top: 50%;
			border-top: solid 2px;
			border-left: solid 2px;
			transform-origin: 0 0;
		}

		&:before {
			left: 10px;
			transform: rotate(-45deg);
		}

		&:after {
			right: 0;
			transform: rotate(135deg);
		}
	}

	.#{$prefix}-range:focus ~ .#{$prefix}-handle {
		background: #ffffff;
		box-shadow: 0 0 3px rgba(0, 0, 0, 0.4);
	}

	.#{$prefix}-slider[data-comparison-label]:after,
	.#{$prefix}-reveal[data-comparison-label]:after {
		content: attr(data-comparison-label);
		position: absolute;
		top: 1.5rem;
		line-height: 1;
		padding: 0.5rem;
		border-radius: 0.125rem;
		background: #ffffff;
	}

	.#{$prefix}-slider[data-comparison-label]:after {
		right: 1.5rem;
	}

	.#{$prefix}-reveal[data-comparison-label]:after {
		left: 1.5rem;
	}

	.#{$prefix}-slider[data-comparison-label='']:after,
	.#{$prefix}-reveal[data-comparison-label='']:after {
		content: none;
	}

	.#{$prefix}-ready {
		.#{$prefix}-reveal,
		.#{$prefix}-handle {
			opacity: 1;
		}
	}
}
</style>
