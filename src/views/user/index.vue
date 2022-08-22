<template>
	<div>
		<!-- 顶部搜索框和按钮 -->
		<el-row style="margin-bottom: 15px;">
			<el-col :span="8" style="margin-right: 15px;">
				<el-input placeholder="请输入内容" v-model="queryInfo.name">
					<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
				</el-input>
			</el-col>
			<el-col :span="8">
				<el-button type="primary" icon="el-icon-plus" @click="addDialogVisible=true">添加</el-button>
				<el-button type="danger" icon="el-icon-delete" @click="deleteUserById(delType='checkbox', id = '')">删除</el-button>
			</el-col>
		</el-row>

		<!-- 列表数据 -->
		<el-table :data="userList"  @selection-change="handleSelectionChange">
			<el-table-column type="selection"></el-table-column>
			<el-table-column label="编号" prop="user_id" width="60px"></el-table-column>
			<el-table-column label="用户名" prop="name" width="100px"></el-table-column>
			<el-table-column label="真实姓名" prop="real_name" width="100px"></el-table-column>
			<el-table-column label="联系电话" prop="phone" width="120px"></el-table-column>
			<el-table-column label="推荐人" width="100px">
				<template slot-scope="scope">
					{{scope.row.tuijian==null?'无':scope.row.tuijian}}
				</template>
			</el-table-column>
			<el-table-column label="金额" prop="balance" width="120px"></el-table-column>
			<el-table-column label="积分" prop="point" width="100px"></el-table-column>
			<el-table-column label="状态" width="80px">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.status" :active-value="'1'" :inactive-value="'0'" :disabled="true">
					</el-switch>
				</template>
			</el-table-column>
			<el-table-column label="会员等级" prop="group_id" width="80px"></el-table-column>
			<el-table-column label="注册时间" prop="reg_time"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
					<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserById(delType='', id=scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页区域 -->
		<el-pagination :page-size="10" background layout="prev, pager, next" :total="total"
			style="margin-top: 15px; float: right;" @current-change="handleCurrentChange" :current-page="currentPage">
		</el-pagination>


		<!-- 添加对话框 -->
		<el-dialog title="添加" :visible.sync="addDialogVisible" width="30%" :before-close="handleClose">
			<!-- 验证表单 -->
			<el-form :model="addRuleForm" :rules="addRules" ref="AddRuleForm" label-width="100px">
				<el-form-item label="用户名: " prop="name">
					<el-input v-model="addRuleForm.name"></el-input>
				</el-form-item>
				<el-form-item label="密码: " prop="password">
					<el-input v-model="addRuleForm.password"></el-input>
				</el-form-item>
				<el-form-item label="确认密码: " prop="repassword">
					<el-input v-model="addRuleForm.repassword"></el-input>
				</el-form-item>
				<el-form-item label="手机号码: " prop="phone">
					<el-input v-model="addRuleForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="真实姓名: " prop="real_name">
					<el-input v-model="addRuleForm.real_name"></el-input>
				</el-form-item>
				<el-form-item label="金额: " prop="balance">
					<el-input v-model="addRuleForm.balance"></el-input>
				</el-form-item>
				<el-form-item label="状态: " prop="status">
					<el-switch v-model="addRuleForm.status" :active-value="'1'" :inactive-value="'0'"></el-switch>
				</el-form-item>
			</el-form>
			<!-- 底部按钮 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addSubmit">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 编辑对话框 -->
		<el-dialog title="编辑" :visible.sync="editDialogVisible" width="30%" :before-close="handleClose">
			<!-- 验证表单 -->
			<el-form :model="editRuleForm" :rules="editRules" ref="EditRuleForm" label-width="100px">
				<el-form-item label="用户名: " prop="name">
					<el-input v-model="editRuleForm.name" clearable></el-input>
				</el-form-item>
				<el-form-item label="密码: " prop="password">
					<el-input v-model="editRuleForm.password" clearable type="password"></el-input>
				</el-form-item>
<!-- 				<el-form-item label="确认密码: " prop="repassword">
					<el-input v-model="editRuleForm.repassword" clearable type="password"></el-input> -->
				</el-form-item>
				<el-form-item label="手机号码: " prop="phone">
					<el-input v-model="editRuleForm.phone" clearable></el-input>
				</el-form-item>
				<el-form-item label="真实姓名: " prop="real_name">
					<el-input v-model="editRuleForm.real_name" clearable></el-input>
				</el-form-item>
				<el-form-item label="金额: " prop="balance">
					<el-input v-model="editRuleForm.balance" clearable></el-input>
				</el-form-item>
				<el-form-item label="状态: " prop="status">
					<el-switch v-model="editRuleForm.status" :active-value="'1'" :inactive-value="'0'"></el-switch>
				</el-form-item>
			</el-form>
			<!-- 底部按钮 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editSubmit">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		userList,
		userSave,
		userDel
	} from '../../comoon/api/user.js'
	export default {
		data() {
			// 验证/确认密码/表单
			var checkRepassword = (rule, value, callback) => {
				if(value === ''){
					callback(new Error('请再次输入密码'))
				}else if (value !== this.addRuleForm.password){
					callback(new Error('两次输入密码不一致！'))
				}else{
					callback();
				}
			};
			var checkRepassword_edit = (rule, value, callback) => {
				let password = this.editRuleForm.password==''?undefined:this.editRuleForm.password
				if (value !== password){
					callback(new Error('两次输入密码不一致！'))
				}else{
					callback();
				}
			};
			// 验证手机号码
			var checkPhone = (rule, value, callback) => {
			  setTimeout(() => {
			    if (!(/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(value))) {
			      callback(new Error('请输入正确的手机号！'));
			    } else {
			      callback();
			    }
			  }, 500);
			};
			return {
				queryInfo: {
					name: '',
					pagenum: 1
				},
				userList: [],
				total: 0,
				currentPage: 1,
				addDialogVisible: false,
				addRuleForm: {
					name: '',
					password: '',
					// repassword: '',
					phone: '',
					real_name: '',
					balance: '',
					status: ''
				},
				addRules: {
					name: [{required:true, message: '请输入用户名！', trigger:'blur'}],
					password: [{required:true, message: '请输入密码！', trigger:'blur'},
					{min: 3, max:16, message: '密码长度在6~16之间！', trigger:'blur'}],
					repassword: [{validator: checkRepassword, trigger: 'blur'}],
					phone: [{validator: checkPhone, trigger: 'blur'}]
				},
				editDialogVisible: false,
				editRuleForm: {
					name: '',
					password: '',
					// repassword: '',
					phone: '',
					real_name: '',
					balance: '',
					status: '',
					id: ''
				},
				editRules: {
					name: [{required:true, message: '请输入用户名！', trigger:'blur'}],
					// password: [{min: 3, max:16, message: '密码长度在6~16之间！', trigger:'blur'}],
					phone: [{validator: checkPhone, trigger: 'blur'}]
				},
				delId:[]
			}
		},
		methods: {
			// 获取列表参数
			getUserList() {
				let params = {
					page: this.pagenum
				}
				userList(params).then(res => {
					// console.log(res.data)
					if (res.code !== 200) {
						return this.$message.error('获取列表数据失败！')
					}
					this.userList = res.data.data
					this.total = parseInt(res.data.total)
				})
			},
			// 点击页数跳转
			handleCurrentChange(currentPage) {
				this.pagenum = currentPage
				this.getUserList()
			},
			// 添加对话框关闭
			handleClose() {
				this.addRuleForm = {}
				this.addDialogVisible = false;
				// this.$refs['AddRuleForm'].resetFields();
				this.editRuleForm = {}
				this.editDialogVisible = false;
				// this.$refs['EditRuleForm'].resetFields();
			},
			addSubmit(){
				this.$refs['AddRuleForm'].validate(valid => {
					if(valid) {
						let params = this.addRuleForm;
						// console.log(params)
						userSave(params).then(res => {
							this.$message({
								message: res.msg,
								duration: 1000,
								type: 'success'
							});
							if(res.code == 200){
								this.addDialogVisible = false;
								this.addRuleForm = {}
								this.getUserList();
							}
						})
					}
				})
			},
			// 点击编辑按钮显示表单
			showEditDialog(userInfo){
				// console.log(userInfo)
				this.editDialogVisible = true;
				this.editRuleForm = userInfo
			},
			editSubmit(){
				this.$refs['EditRuleForm'].validate(valid => {
					if(valid) {
						let params = this.editRuleForm;
						// console.log(params)
						userSave(params).then(res => {
							console.log(res)
							this.$message({
								message: res.msg,
								duration: 1000,
								type: 'success'
							});
							if(res.code == 200){
								// console.log(121212)
								this.editDialogVisible = false;
								this.editRuleForm = {}
								this.getUserList();
							}
						})
					}
				})
				this.editDialogVisible = false
			},
			deleteUserById(delType, id){
				let params = {}
				if(delType === 'checkbox'){
					if(this.delId.length == 0){
						return this.$message.warning('请先选择要删除的用户！')
					}
					params = {
						id: this.delId
						}
				}else{
				params = {
					id: id
					}
				}
				 this.$confirm('此操作将永久删除一个或多个用户, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(() => {
				          userDel(params).then(res => {
				          	if(res.code == 200){
				          		this.$message({
				          			message: res.msg,
				          			duration: 2000,
				          			type: 'success'
				          		});
				          		this.delId = [];
				          		this.getUserList()
				          	}
				          })
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
			},
			handleSelectionChange(val) {
				// console.log(val)
				for(let i=0; i<val.length; i++){
					val[i] = parseInt(val[i].id)
				}
			        this.delId = val;
			      }
			// userStatusChange(userInfo){
			// 	console.log(userInfo)
			// 	let params = {
			// 		phone: userInfo.phone,
			// 		name: userInfo.name,
			// 		id: userInfo.user_id,
			// 		status: status=='1'? '0': '1'
			// 	}
			// 	//
			// 	userSave(params).then(res => {
			// 		console.log(res)
			// 	})
			// }
		}, //methods
		created() {
			this.getUserList();
		}
	}
</script>

<style>
</style>
