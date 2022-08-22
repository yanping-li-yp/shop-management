<template>
	<div>
		<el-row>
			<el-button type="success" icon="el-icon-plus" @click="showAddUser">添加</el-button>
		</el-row>
		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="id" label="编号" width="180"></el-table-column>
			<el-table-column prop="name" label="名称" width="180"></el-table-column>
			<el-table-column prop="money" label="消费金额"></el-table-column>
			<el-table-column fixed="right" label="操作" width="220">
				<template slot-scope="scope">
					<el-button type="success" size="small" @click="editClick(scope.row)" icon="el-icon-edit">编辑
					</el-button>
					<el-button type="danger" size="small" @click="delClick(scope.row.id)" icon="el-icon-delete">删除
					</el-button>
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 添加/编辑弹窗 -->
		<el-dialog :title="title" :visible.sync="showAdd" @close="closeDialog">
			<el-form :model="form" :rules="rules" ref="ruleForm">
				<el-form-item label="名称" prop="name" :label-width="formLabelWidth">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="消费金额" :label-width="formLabelWidth">
					<el-input v-model="form.money"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showAdd = false">取 消</el-button>
				<el-button type="primary" @click="addUser('ruleForm')">确 定</el-button>
			</div>
		</el-dialog>
		
		<!-- 分页 -->
		<div class="block">
		    <el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="currentPage"
		      :page-sizes="[1, 5, 10, 20]"
		      :page-size="pageSize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="total">
		    </el-pagination>
		  </div>

	</div>
</template>

<script>
	import {
		gradeList,
		gradeSave,
		gradeDel
	} from '../../comoon/api/grade.js'; //调用外部JS文件
	export default {
		data() {
			return {
				tableData: [],
				userId: '',
				form: {
					name: '',
					money: '',
				},
				rules: {
					name: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}],
					money: []
				},
				showAdd: false, //显示添加/编辑弹窗
				title: '添加',
				formLabelWidth: '120px',
				optType: 0, //0表示添加，1表示编辑
				currentPage: 1,
				pageSize: 10,
				total: 1
			}
		},
		methods: {
			initData() {
				let that = this;
				let params = {
					page: this.currentPage,
					pagesize: this.pageSize
				}
				gradeList(params).then(res => {
					if (res.code == 200) {
						that.tableData = res.data.data;
						that.total = parseInt(res.data.total);
					}
				});
			},
			// 添加
			showAddUser() {
				this.showAdd = true;
				this.title = '添加';
				this.optType = 0;
			},
			//添加/编辑提交
			addUser(formname) {
				if (this.optType == 0) {
					var params = {
						name: this.form.name,
						money: parseInt(this.form.money)
					}
					var successText = '添加成功';
				} else {
					var params = {
						id: parseInt(this.form.id),
						name: this.form.name,
						money: parseInt(this.form.money)
					};
					var successText = '修改成功';
				}

				this.$refs[formname].validate(async valid => {
					if (valid) {
						var res = await gradeSave(params);
						if (res.code == 200) {
							this.$message.success(successText)
						} else {
							this.$message.error(res.msg)
						}
						this.showAdd = false;
						this.initData();
						return
					} else {
						return false;
					}
				})
			},
			// 对话框关闭时清空对话框内容
			closeDialog() {
				this.form = {}
			},
			// 删除
			delClick(id) {
				let params = {
					id: parseInt(id)
				}
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async value => {
					let res = await gradeDel(params);
					if (res.code == 200) {
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						this.initData();
					} else {
						this.$message.error(res.msg)
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			// 编辑
			editClick(user) {
				this.title = '编辑';
				this.showAdd = true;
				this.optType = 1;
				this.form = user
			},
			// 分页
			handleSizeChange(pagesize){
				this.pageSize = pagesize;
				this.initData()
			},
			handleCurrentChange(currentpage){
				this.currentPage = currentpage;
				this.initData()
			},
		},
		//初始化状态
		created: function() {
			this.initData();
		},
	}
</script>
