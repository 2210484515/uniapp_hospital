<template>
	<view class="uni-stat__select">
		<span v-if="label" class="uni-label-text hide-on-phone">{{label + '：'}}</span>
		<view class="uni-stat-box" :class="{'uni-stat__actived': current}">
			<view class="uni-select" :class="{'uni-select--disabled':disabled}">
				<view class="uni-select__input-box" @click="toggleSelector">
					<view v-if="current" class="uni-select__input-text">{{current}}</view>
					<view v-else class="uni-select__input-text uni-select__input-placeholder">{{typePlaceholder}}</view>
					<view v-if="current && clear && !disabled" @click.stop="clearVal" >
						<uni-icons type="clear" color="#c0c4cc" size="24"/>
					</view>
					<view v-else>
						<uni-icons :type="showSelector? 'top' : 'bottom'" size="14" color="#999" />
					</view>
				</view>
				<view class="uni-select--mask" v-if="showSelector" @click="toggleSelector" />
				<view class="uni-select__selector" v-if="showSelector">
					<view class="uni-popper__arrow"></view>
					<scroll-view scroll-y="true" class="uni-select__selector-scroll">
						<view class="uni-select__selector-empty" v-if="mixinDatacomResData.length === 0">
							<text>{{emptyTips}}</text>
						</view>
						<view v-else class="uni-select__selector-item" v-for="(item,index) in mixinDatacomResData" :key="index"
							@click="change(item)">
							<text :class="{'uni-select__selector__disabled': item.disable}">{{formatItemName(item)}}</text>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * DataChecklist 数据选择器
	 * @description 通过数据渲染的下拉框组件
	 * @tutorial https://uniapp.dcloud.io/component/uniui/uni-data-select
	 * @property {String} value 默认值
	 * @property {Array} localdata 本地数据 ，格式 [{text:'',value:''}]
	 * @property {Boolean} clear 是否可以清空已选项
	 * @property {Boolean} emptyText 没有数据时显示的文字 ，本地数据无效
	 * @property {String} label 左侧标题
	 * @property {String} placeholder 输入框的提示文字
	 * @property {Boolean} disabled 是否禁用
	 * @event {Function} change  选中发生变化触发
	 */

	export default {
		name: "uni-data-select",
		mixins: [uniCloud.mixinDatacom || {}],
		props: {
			localdata: {
				type: Array,
				default () {
					return []
				}
			},
			value: {
				type: [String, Number],
				default: ''
			},
			modelValue: {
				type: [String, Number],
				default: ''
			},
			label: {
				type: String,
				default: ''
			},
			placeholder: {
				type: String,
				default: '请选择'
			},
			emptyTips: {
				type: String,
				default: '无选项'
			},
			clear: {
				type: Boolean,
				default: true
			},
			defItem: {
				type: Number,
				default: 0
			},
			disabled: {
				type: Boolean,
				default: false
			},
			// 格式化输出 用法 field="_id as value, version as text, uni_platform as label" format="{label} - {text}"
			format: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				showSelector: false,
				current: '',
				mixinDatacomResData: [],
				apps: [],
				channels: [],
				cacheKey: "uni-data-select-lastSelectedValue",
			};
		},
		created() {
			this.debounceGet = this.debounce(() => {
				this.query();
			}, 300);
			if (this.collection && !this.localdata.length) {
				this.debounceGet();
			}
		},
		computed: {
			typePlaceholder() {
				const text = {
					'opendb-stat-app-versions': '版本',
					'opendb-app-channels': '渠道',
					'opendb-app-list': '应用'
				}
				const common = this.placeholder
				const placeholder = text[this.collection]
				return placeholder ?
					common + placeholder :
					common
			},
			valueCom(){
				// #ifdef VUE3
				return this.modelValue;
				// #endif
				// #ifndef VUE3
				return this.value;
				// #endif
			}
		},
		watch: {
			localdata: {
				immediate: true,
				handler(val, old) {
					if (Array.isArray(val) && old !== val) {
						this.mixinDatacomResData = val
					}
				}
			},
			valueCom(val, old) {
				this.initDefVal()
			},
			mixinDatacomResData: {
				immediate: true,
				handler(val) {
					if (val.length) {
						this.initDefVal()
					}
				}
			}
		},
		methods: {
			debounce(fn, time = 100){
				let timer = null
				return function(...args) {
					if (timer) clearTimeout(timer)
					timer = setTimeout(() => {
						fn.apply(this, args)
					}, time)
				}
			},
			// 执行数据库查询
			query(){
				this.mixinDatacomEasyGet();
			},
			// 监听查询条件变更事件
			onMixinDatacomPropsChange(){
				if (this.collection) {
					this.debounceGet();
				}
			},
			initDefVal() {
				let defValue = ''
				if ((this.valueCom || this.valueCom === 0) && !this.isDisabled(this.valueCom)) {
					defValue = this.valueCom
				} else {
					let strogeValue
					if (this.collection) {
						strogeValue = this.getCache()
					}
					if (strogeValue || strogeValue === 0) {
						defValue = strogeValue
					} else {
						let defItem = ''
						if (this.defItem > 0 && this.defItem <= this.mixinDatacomResData.length) {
							defItem = this.mixinDatacomResData[this.defItem - 1].value
						}
						defValue = defItem
					}
          if (defValue || defValue === 0) {
					  this.emit(defValue)
          }
				}
				const def = this.mixinDatacomResData.find(item => item.value === defValue)
				this.current = def ? this.formatItemName(def) : ''
			},

			/**
			 * @param {[String, Number]} value
			 * 判断用户给的 value 是否同时为禁用状态
			 */
			isDisabled(value) {
				let isDisabled = false;

				this.mixinDatacomResData.forEach(item => {
					if (item.value === value) {
						isDisabled = item.disable
					}
				})

				return isDisabled;
			},

			clearVal() {
				this.emit('')
				if (this.collection) {
					this.removeCache()
				}
			},
			change(item) {
				if (!item.disable) {
					this.showSelector = false
					this.current = this.formatItemName(item)
					this.emit(item.value)
				}
			},
			emit(val) {
				this.$emit('input', val)
				this.$emit('update:modelValue', val)
				this.$emit('change', val)
				if (this.collection) {
					this.setCache(val);
				}
			},
			toggleSelector() {
				if (this.disabled) {
					return
				}

				this.showSelector = !this.showSelector
			},
			formatItemName(item) {
				let {
					text,
					value,
					channel_code
				} = item
				channel_code = channel_code ? `(${channel_code})` : ''

				if (this.format) {
					// 格式化输出
					let str = "";
					str = this.format;
					for (let key in item) {
						str = str.replace(new RegExp(`{${key}}`,"g"),item[key]);
					}
					return str;
				} else {
					return this.collection.indexOf('app-list') > 0 ?
						`${text}(${value})` :
						(
							text ?
							text :
							`未命名${channel_code}`
						)
				}
			},
			// 获取当前加载的数据
			getLoadData(){
				return this.mixinDatacomResData;
			},
			// 获取当前缓存key
			getCurrentCacheKey(){
				return this.collection;
			},
			// 获取缓存
			getCache(name=this.getCurrentCacheKey()){
				let cacheData = uni.getStorageSync(this.cacheKey) || {};
				return cacheData[name];
			},
			// 设置缓存
			setCache(value, name=this.getCurrentCacheKey()){
				let cacheData = uni.getStorageSync(this.cacheKey) || {};
				cacheData[name] = value;
				uni.setStorageSync(this.cacheKey, cacheData);
			},
			// 删除缓存
			removeCache(name=this.getCurrentCacheKey()){
				let cacheData = uni.getStorageSync(this.cacheKey) || {};
				delete cacheData[name];
				uni.setStorageSync(this.cacheKey, cacheData);
			},
		}
	}
</script>

<style lang="scss">
	$uni-base-color: #6a6a6a !default;
	$uni-main-color: #333 !default;
	$uni-secondary-color: #909399 !default;
	$uni-border-3: #e5e5e5;


	/* #ifndef APP-NVUE */
	@media screen and (max-width: 500rpx) {
		.hide-on-phone {
			display: none;
		}
	}

	/* #endif */
	.uni-stat__select {
		display: flex;
		align-items: center;
		// padding: 15rpx;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
		width: 100%;
		flex: 1;
		box-sizing: border-box;
	}

	.uni-stat-box {
		width: 100%;
		flex: 1;
	}

	.uni-stat__actived {
		width: 100%;
		flex: 1;
		// outline: 1rpx solid #2979ff;
	}

	.uni-label-text {
		font-size: 18rpx;
		font-weight: bold;
		color: $uni-base-color;
		margin: auto 0;
		margin-right: 5rpx;
	}

	.uni-select {
		font-size: 18rpx;
		border: 1rpx solid $uni-border-3;
		box-sizing: border-box;
		border-radius: 4rpx;
		padding: 0 5rpx;
		padding-left: 10rpx;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		user-select: none;
		/* #endif */
		flex-direction: row;
		align-items: center;
		border-bottom: solid 1rpx $uni-border-3;
		width: 100%;
		flex: 1;
		height: 35rpx;

		&--disabled {
			background-color: #f5f7fa;
			cursor: not-allowed;
		}
	}

	.uni-select__label {
		font-size: 18rrpx;
		// line-height: 22rpx;
		height: 35rpx;
		padding-right: 10rpx;
		color: $uni-secondary-color;
	}

	.uni-select__input-box {
		height: 35rpx;
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		align-items: center;
	}
	.uni-select__input-box::after {
	    content: '\25BC';  /* 使用Unicode字符表示向下的箭头 */
	    position: absolute;
	    right: 0rpx; /* 调整箭头位置 */
	    color: #A8AEA9;  /* 修改箭头颜色 */
	    font-size: 35rpx; /* 修改箭头大小 */
	}

	.uni-select__input {
		flex: 1;
		font-size: 18rpx;
		height: 22rpx;
		line-height: 22rpx;
	}

	.uni-select__input-plac {
		font-size: 20rpx;
		color: $uni-secondary-color;
	}

	.uni-select__selector {
		/* #ifndef APP-NVUE */
		box-sizing: border-box;
		/* #endif */
		position: absolute;
		top: calc(100% + 12rpx);
		left: 0;
		width: 100%;
		background-color: #FFFFFF;
		border: 1rpx solid #EBEEF5;
		border-radius: 6rpx;
		box-shadow: 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1);
		z-index: 3;
		padding: 4rpx 0;
	}

	.uni-select__selector-scroll {
		/* #ifndef APP-NVUE */
		max-height: 200rpx;
		box-sizing: border-box;
		/* #endif */
	}

	/* #ifdef H5 */
	@media (min-width: 768rpx) {
		.uni-select__selector-scroll {
			max-height: 600rpx;
		}
	}
	/* #endif */

	.uni-select__selector-empty,
	.uni-select__selector-item {
		/* #ifndef APP-NVUE */
		display: flex;
		cursor: pointer;
		/* #endif */
		line-height: 35rpx;
		font-size: 20rpx;
		text-align: center;
		/* border-bottom: solid 1rpx $uni-border-3; */
		padding: 0rpx 10rpx;
	}

	.uni-select__selector-item:hover {
		background-color: #f9f9f9;
	}

	.uni-select__selector-empty:last-child,
	.uni-select__selector-item:last-child {
		/* #ifndef APP-NVUE */
		border-bottom: none;
		/* #endif */
	}

	.uni-select__selector__disabled {
		opacity: 0.4;
		cursor: default;
	}

	/* picker 弹出层通用的指示小三角 */
	.uni-popper__arrow,
	.uni-popper__arrow::after {
		position: absolute;
		display: block;
		width: 0;
		height: 0;
		border-color: transparent;
		border-style: solid;
		border-width: 10rpx;

	}

	.uni-popper__arrow {
		filter: drop-shadow(0 2rpx 12rpx rgba(0, 0, 0, 0.03));
		top: -6rpx;
		left: 10%;
		margin-right: 3rpx;
		border-top-width: 0;
		border-bottom-color: #EBEEF5;
	}

	.uni-popper__arrow::after {
		content: " ";
		top: 1rpx;
		margin-left: -6rpx;
		border-top-width: 0;
		border-bottom-color: #fff;
	}

	.uni-select__input-text {
		width: 100%;
		color: $uni-main-color;
		white-space: nowrap;
		text-overflow: ellipsis;
		-o-text-overflow: ellipsis;
		overflow: hidden;
	}

	.uni-select__input-placeholder {
		color: $uni-base-color;
		font-size: 20rpx;
	}

	.uni-select--mask {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		z-index: 2;
	}
</style>
