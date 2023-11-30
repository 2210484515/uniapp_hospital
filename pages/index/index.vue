<template>
	<view class="container">
		<view class="main">
			<headerbg @sendDefault="getSonValue" :time="currentTime" :timeClock="clock"></headerbg>
			<view class="departmentName" @tap="departClick">
				<text v-if="departShow">{{departData.name}}</text>
				<input v-else class="uni-input" @blur="departBlur" placeholder="请输入科室的名称" />
			</view>
			<view class="departMain">
				<view class="depart">
					<!-- <image src="../../static/images/docker.jpg" mode="aspectFill"></image> -->
					<image :src="imageList || placeholderImage" mode="aspectFill" @click="chooseImage()""></image>
					<text class="departZy" style="margin-top: 10rpx;" v-if="dockerDutyShow"
						@tap="dockerDutyClick">{{doctorData.position}}</text>
					<input v-else class="uni-input" @blur="dockerDutyBlur" placeholder="请输入医生的职位"
						style="margin-top: 10rpx;" />
					<text v-if="dockerNameShow" class="departZy" @tap="dockerClick">{{doctorData.docName}}</text>
					<input v-else class="uni-input" @blur="dockerBlur" placeholder="请输入医生姓名" />
					<text class="departNr" style="margin-top: 15rpx;">个人经历介绍:</text>
					<view class="departNr" @tap="nrIntroClick">
						<text v-if="nrIntroShow">{{doctorData.description}}</text>
						<textarea v-else @blur="nrIntroBlur" placeholder="请输入医生的个人经历介绍" />
					</view>
				</view>
				<view class="depart" style="margin-left: 20rpx;">
					<text class="departIntroduce">科室介绍</text>
					<text v-if="departIntroShow" class="deIntroContent" @tap="departIntroClick">
						{{departData.description}}
					</text>
					<textarea v-else @blur="departIntroBlur" placeholder="请输入科室的介绍" />
				</view>
			</view>
			<view class="conculation">
				<text>正在就诊</text>
				<text v-for="(item, index) in patientNowQueueData" :key="index">{{item.patientName}}</text>
			</view>
			<view style="font-size: 18rpx;margin: 10rpx 35rpx 10rpx;">等待就诊</view>
			<uni-table class="unitable" ref="table" emptyText="暂无更多数据">
				<uni-tr v-for="(item, index) in patientQueueData" :key="index" :class="{'odd-row': isOdd(index)}">
					<uni-td>{{ item.id}}</uni-td>
					<uni-td>
						<view class="name">{{ item.patientName }}</view>
					</uni-td>
				</uni-tr>
			</uni-table>
			<view class="deviceIp">
				<image src="../../static/images/phone.png" mode="aspectFill">
					<text>{{deviceIp}}</text>
					<image src="../../static/images/share.png" mode="aspectFill">
						<text>{{localIp}}</text>
						<image src="../../static/images/collect.png" mode="aspectFill">
							<text>{{vsNumber}}</text>
							<image src="../../static/images/logo2.png" class="imgLogo" mode="aspectFill">
								<text>佳人生活国际有限公司</text>
			</view>
		</view>
	</view>
</template>

<script>
	import headerbg from "@/components/headerbg.vue"
	import {
		getDepartment
	} from "@/api/index.js"
	import {
		getDoctor
	} from "@/api/index.js"
	import {
		getQueue
	} from "@/api/index.js"
	export default {
		data() {
			return {
				imageList: '',
				placeholderImage: '../../static/images/docker.jpg' ,
				departData: {},
				doctorData: {},
				currentTime: '',
				clock: '',
				deviceIp: '192.168.21.255',
				localIp: '192.168.21',
				vsNumber: '141',
				departShow: true,
				nrIntroShow: true,
				dockerNameShow: true,
				dockerDutyShow: true,
				departIntroShow: true,
				patientNowQueueData: [],
				patientQueueData: []
			}
		},
		onShow() {
			this.getTimeMsg();
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
			chooseImage() {
			      uni.chooseImage({
			        count: 1,
			        success: (res) => {
			          this.imageList = res.tempFilePaths[0];
			          // 在这里执行上传图片的逻辑
			        }
			      });
			    },
			//每5调用一次
			getTimeMsg() {
				this.getDepartMentmsg(1)
				this.getDoctormsg(1)
				this.getQueueMsg(1)
				setInterval(() => {
					this.getDepartMentmsg(1)
					this.getDoctormsg(1)
					this.getQueueMsg(1)
				}, 5000);
			},
			getSonValue(res) {
				this.topBarHeight = res;
				console.log(res)
			}, //调用部门信息
			getDepartMentmsg(id) {
				getDepartment(id).then(res => {
					if (res.code == 200) {
						this.departData = res.data
					}
				})
			},
			//调用医生信息
			getDoctormsg(id) {
				getDoctor(id).then(res => {
					if (res.code == 200) {
						this.doctorData = res.data
					}
				})
			},
			//调用病人排队信息
			getQueueMsg(id) {
				getQueue(
					"id=" + id
				).then(res => {
					if (res.code == 200) {
						this.patientQueueData = [];
						this.patientNowQueueData = [];
						for (var i = 0; i < res.data.length; i++) {
							if (res.data[i].status == 3) {
								this.$set(this.patientQueueData, i, res.data[i]);
							} else {
								this.$set(this.patientNowQueueData, i, res.data[i]);
							}
						}
						this.patientQueueData = this.patientQueueData.filter(item => item.id !==
							''); //清除数据列表中的空数据 
					}
				})
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
			isOdd(index) {
				return index % 2 !== 0;
			},
			departClick() {
				this.departShow = false
			},
			nrIntroClick() {
				this.nrIntroShow = false
			},
			dockerClick() {
				this.dockerNameShow = false
			},
			dockerDutyClick() {
				this.dockerDutyShow = false
			},
			departIntroClick() {
				this.departIntroShow = false
			},
			departBlur() {
				this.departShow = true
			},
			dockerBlur() {
				this.dockerNameShow = true
			},
			dockerDutyBlur() {
				this.dockerDutyShow = true
			},
			nrIntroBlur() {
				this.nrIntroShow = true
			},
			departIntroBlur() {
				this.departIntroShow = true
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

	.main {
		margin: auto;
		height: 97%;
		width: 96%;
		background-color: white;
		margin-top: 15rpx;
	}

	.departmentName {
		display: flex;
		justify-content: center;
		font-size: 30rpx;
		margin-top: 30rpx;
		height: 50rpx;
	}

	.departMain {
		display: flex;
		width: 97%;
		height: 50%;
		margin: auto;
	}

	.depart {
		width: 49%;
		height: 100%;
		display: flex;
		font-size: 18rpx;
		flex-direction: column;

		.departZy {
			text-align: center;
			width: 80%;
			margin-top: 5rpx;
			height: 35rpx;
		}

		.departNr {
			line-height: 30rpx;
			font-size: 18rpx;
		}

		.uni-input {
			width: 300rpx;
			height: 35rpx;
			margin-top: 5rpx;
		}

		.departIntroduce {
			margin-top: 20rpx;
			margin-bottom: 20rpx;
		}

		.deIntroContent {
			font-size: 18rpx;
			line-height: 30rpx;
		}
	}

	.depart textarea {
		font-size: 18rpx;
		width: 100%;
	}

	.depart image {
		width: 80%;
		height: 300rpx;
	}

	.uni-input {
		width: 300rpx;
		height: 100%;
		text-align: center;
		margin-top: -5rpx;
	}

	.conculation {
		margin: auto;
		width: 96%;
		height: 45rpx;
		background-color: #D8D8D8;
		margin-top: 20rpx;
		display: flex;
		font-size: 18rpx;
	}

	.conculation text {
		width: 50%;
		margin-left: 20rpx;
		margin-top: 10rpx;
	}

	.unitable {
		font-size: 18rpx;
		display: flex;
		flex-direction: column;
		width: 96%;
		margin: auto;
		background-color: #D8D8D8;
	}

	.unitable uni-tr {
		display: flex;
		height: 45rpx;
		line-height: 45rpx;
		padding-left: 20rpx;
	}

	.unitable uni-td {
		width: 50%;

		.name {
			margin-left: 10rpx;
		}
	}

	.odd-row {
		background-color: #EFEFEF;
	}

	.deviceIp {
		width: 96%;
		height: 40rpx;
		margin: auto;
		margin-top: 20rpx;
		display: flex;
		font-size: 18rpx;

		image {
			width: 20rpx;
			height: 20rpx;
			margin-top: 2rpx;
		}

		text {
			margin-right: 20rpx;
		}

		.imgLogo {
			width: 40rpx;
			margin-top: -10rpx;
			height: 40rpx;
		}
	}
</style>