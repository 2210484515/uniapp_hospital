<template>
	<view class="container">
		<view class="main">
			<headerbg @sendDefault="getSonValue" :time="currentTime" :timeClock="clock"></headerbg>
			<view class="select">
				<view class="label">科室:</view>
				<uni-data-select v-model="value" :localdata="range" @change="change" class="data"></uni-data-select>
			</view>
			<!--4 两个按钮 一个确认，一个取消-->
			<view class="button">
				<button type="submit" class="bon1" @click="onSubmit()" size="default">确认</button>
				<button type="reset" class="bon2" @click="onReset()" size="default">取消</button>
			</view>

		</view>


	</view>

</template>

<script>
	import headerbg from "@/components/headerbg.vue"
	export default {
		data() {
			return {
				currentTime: '',
				clock: '',
				value: 0,
				range: [{
						value: 1,
						text: "科室1"
					},
					{
						value: 2,
						text: "科室2"
					},
					{
						value: 3,
						text: "科室3"
					},
				],
			}
		},
		onLoad() {

		},
		components: {
			headerbg
		},
		created() {
			this.getCurrentTime();
			setInterval(() => {
				this.getCurrentTime();
			}, 1000);
		},
		methods: {
			getSonValue(res) {
				this.topBarHeight = res;
				console.log(res)
			},
			getCurrentTime() {
				let date = new Date();
				let year = date.getFullYear();
				// 在日期格式中，月份是从0开始的，因此要加0，使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
				let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
				let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
				let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
				let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
				let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				//获取星期几（0-6），其中0表示周日，1表示周一
				let dayOfWeek = date.getDay();
				//定义一个数组来存储星期几的名称
				let weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
				let currentDayOfWeek = weekDays[dayOfWeek];
				// 拼接
				this.currentTime = year + "年" + month + "月" + day + "日 " + currentDayOfWeek;
				this.clock = hours + ": " + minutes;
			},
			onSubmit() {
				console.log("确认");
				try {
					// 保存选择的科室
					const selectedDepartment = this.value ? this.range[this.value - 1].text : '未选择科室'; // 假设value是从1开始的
					localStorage.setItem('selectedDepartment', selectedDepartment);

					console.log('保存成功');

					// 在主界面底部显示提示框
					const success = true; // 假设设置成功

					uni.setTabBarBadge({
						index: 0, // 主界面的索引，假设是第一个页面
						text: success ? '连接成功' : '连接失败'
					});

					// 跳转到主界面
					uni.redirectTo({
						url: './test/test'
					});
				} catch (error) {
					// 异常处理代码
					console.error('发生异常：', error);
				}
			},
			onReset() {
				uni.redirectTo({
					url: '../index/index'
				});
			},
			change() {
				console.log('Selected value:', this.value)
			},
		}
	}
</script>

<style lang="scss">
	.container {
		height: 100vh;
		width: 100%;
		background-color: #EFEFEF;
	}

	.uni-select__input-placeholder {
		font-size: 30rpx;
	}

	.main {
		margin: auto;
		height: 97%;
		width: 96%;
		background-color: white;
		margin-top: 15rpx;
	}

	.select {
		display: flex;
		margin: auto;
		margin-top: 100rpx;
		width: 60%;
	}

	.data {
		margin-left: 50rpx;
		width: 300rpx;
	}

	.label {
		font-size: 25rpx;

	}

	.button {
		display: flex;
		margin-left: 150rpx;
		margin-top: 100rpx;
	}

	.bon1,
	.bon2 {
		width: 100rpx;
		font-size: 18rpx;
		background-color: #84534f;
		color: #fff;
		margin: 0 50rpx;

	}
</style>
