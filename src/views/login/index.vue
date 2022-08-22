<template>
	<div class="bg" :style="{'background-image':'url('+bg+')'}">
		<div class="login_main">
			<!-- 登录框 -->
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
				class="demo-ruleForm">
				<el-form-item>
					<span>管理系统</span>
				</el-form-item>

				<!-- 用户名 -->
				<el-form-item label="" prop="name">
					<el-input prefix-icon="el-icon-user" placeholder="用户名" v-model="ruleForm.name" autocomplete="off">
					</el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item label="" prop="pass">
					<el-input type="password" prefix-icon="el-icon-lock" placeholder="密码" v-model="ruleForm.pass"
						autocomplete="off"></el-input>
				</el-form-item>
				<!-- 验证码 -->
				<el-form-item label="" prop="code">
					<el-input v-model="ruleForm.code" prefix-icon="el-icon-warning-outline" placeholder="验证码"
						autocomplete="off" style="width: 230px;"></el-input>

					<span style="float: right;" @click="activeCode()"><img :src="codeurl"></span>
				</el-form-item>
				<!-- 记录密码 -->
				<el-form-item label="" style="margin-bottom: 0px;">
					<el-checkbox v-model="ruleForm.checkd">记录密码1天</el-checkbox>
				</el-form-item>
				<!-- 登录按钮 -->
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')" class="bt_login">登录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<style>
	.bg {
		background-repeat: no-repeat;
		background-size: 100%;
		min-height: 100vh;
		display: flex;
	}

	.login_main {
		padding: 20px;
		background: #fff;
		border-radius: 2px;
		box-shadow: 0 3px 6px -1px rgb(0 0 0 / 19%);
		box-sizing: border-box;
		width: 400px;
		height: 380px;
		margin: 100px auto;
	}

	.bt_login {
		width: 100%;
	}

	.login_main .el-form-item__content {
		margin-left: 0px !important;
	}
</style>

<script>
	import {
		login
	} from '../../comoon/api/admin.js'
	export default {
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					// if (this.ruleForm.checkPass !== '') {
					//   this.$refs.ruleForm.validateField('checkPass');
					// }
					callback();
				}
			};
			return {
				bgdata: [
					'../../static/bg/1.jpg',
					'../../static/bg/2.jpg',
					'../../static/bg/3.jpg',
					'../../static/bg/4.jpg',
				],
				bg: '',
				codeurl: 'https://tou.ueoa.net/index/captcha/h/40/w/120/bc/1a78c2/c/ffffff/random/', //验证码
				ruleForm: {
					code: '',
					name: '',
					pass: '',
					// 记住密码
					checkd: false,
				},
				rules: {
					pass: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					name: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 20,
							message: '长度在 3 到 20 个字符',
							trigger: 'blur'
						}
					],
					code: [{
							required: true,
							message: '请输入验证码',
							trigger: 'blur'
						}

					],
				}
			};
		},
		methods: {
			// 验证码,点击之后切换
			activeCode() {
				this.codeurl = 'https://tou.ueoa.net/index/captcha/h/40/w/120/bc/1a78c2/c/ffffff/random/' + Math.random();
			},
			// 点击登录按钮
			submitForm(formName) {
				//验证
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.subLogin(); //调用登录方法
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			//登录
			subLogin() {
				let that = this;
				//请求登录接口
				let params = {
					name: this.ruleForm['name'],
					password: this.ruleForm['pass']
				}
				//登录接口
				login(params).then(function(response) {
					if (response.code == 200) {
						that.$message({
							type: 'success',
							message: '登录成功'
						})
						//保存记录
						//判定是否记录密码
						if (that.ruleForm.checkd == true) {
							var time = 3600;
						} else {
							var time = 360;
						}
						that.$cookie.set('uid', response.data.uid, time); //登录获取UID状态
						that.$cookie.set('token', response.data.token, time); //登录后生成token
						//localStorage.setItem('token',response.data.token);
						that.$cookie.set('name', response.data.manager, time); //登录时间一小时
						localStorage.setItem('menuList', '');
						that.$router.push({
							path: '/index'
						}); //跳转到框架首页

					} else {
						that.$message.error(response.msg);
					}
				});
				return;

			},
		},
		mounted: function() {
			// console.log(Math.floor(Math.random() * 3));
			this.bg = this.bgdata[Math.floor(Math.random() * 4)];
		}
	}
</script>
