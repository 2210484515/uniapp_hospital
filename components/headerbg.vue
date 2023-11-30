<template>
	<view>
		<view class="top_bgimg" :style="'height:'+topBarHeight+'rpx;'">
			<view class="top_cont" :style="'height:'+ tabBarHeight+'rpx;margin-top:'+stateBarHeight+'rpx;'">
				<image src="../static/images/logo1.png" @tap="gotoPage">
				<view style="position: absolute;right: 25rpx;">{{time}}</view>
				<view style="position: absolute;top:60rpx;right: 70rpx;font-size: 30rpx;">{{timeClock}}</view>
			</view>
		</view>
<!-- 		<view :style="'height:'+topBarHeight+'rpx;'"></view> -->
	</view>
</template>

<script>
	export default {
		name: "headerbg",
		data() {
			return {
				topBarHeight: 80, //状态栏加导航栏高度
				stateBarHeight: 0, //导航栏高度
				tabBarHeight: 50, //状态栏高度
			};
		},
		props: {
			timeClock: {
				type: String,
				default: ''
			},
			time: {
				type: String,
				default: ''
			}
		},
		methods:{
			gotoPage(){
				uni.redirectTo({
					url:'/pages/index/subScreen'
				})
			}
		},
		mounted: function() {
			var self = this;
			uni.getSystemInfo({
				success: function(res) {
					self.stateBarHeight = res.statusBarHeight
					// #ifdef MP-WEIXIN
					let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
					let paddingSize = menuButtonInfo.top - self.stateBarHeight
					self.tabBarHeight = (menuButtonInfo.bottom - self.stateBarHeight) + paddingSize
					self.topBarHeight = menuButtonInfo.bottom + paddingSize
					// #endif

					// #ifdef APP-NVUE || APP-PLUS 
					let menuRect = wx.getMenuButtonBoundingClientRect()
					self.topBarHeight = menuRect.top + menuRect.height
					// #endif
					//向父组件传回头部高度
					self.$emit("sendDefault", self.topBarHeight)
				},
			})
		}
	}
</script>

<style lang="less">
	.top_bgimg {	
		color: black;
		font-size: 18rpx;
	}

	.top_cont {
		display: flex;
		align-items: center;
		box-sizing: border-box;
	}

	.top_cont image {
		width: 200rpx;
		height: 40rpx;
		margin: 6rpx 10rpx 0 0;
	}
</style>
