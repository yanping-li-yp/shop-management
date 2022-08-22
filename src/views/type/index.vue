<template>
	<div>
		<el-row>
			<el-button type="success" icon="el-icon-plus" size="small">添加</el-button>
		</el-row>

		<!-- 数据表格 -->
		<el-table :data="typeList" style="width: 100%">
			<el-table-column prop="id" label="编号" width="180">
			</el-table-column>
			<el-table-column prop="name" label="名称" width="180">
			</el-table-column>
			<el-table-column prop="" label="属性">
			</el-table-column>
			<el-table-column fixed="right" width="200">
				<template slot-scope="scope">
					<el-button type="success" size="small" icon="el-icon-edit">编辑</el-button>
					<el-button type="danger" size="small" icon="el-icon-delete" @click="delType(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>



	</div>
</template>

<script>
	import {
		goodsTypeList,
		goodsTypeSave,
		goodsTypeDel
	} from '../../comoon/api/goodstype.js';
	import {
		specList
	} from '../../comoon/api/spec.js'
	export default {
	      data() {
	        return {
			  page: 1,
			  typeList: [],
	        }
	      }, //data
		  mounted() {
		  	this.initData();
		  }, //mounted
		  methods:{
			async initData(){
				let params = {
					page: this.page
				};
				let res = await goodsTypeList(params);
				// console.log(res)
				if(res.code == 200){
					this.typeList = res.data.data;
					console.log(this.typeList)
				}else{
					this.$message.info(res.msg)
				}
			},
			delType(id){
				console.log(id)
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).then(async value => {
						  let res = await goodsTypeDel(parseInt(id));
						  if(res.code == 200){
							  this.$message({
							    type: 'success',
							    message: '删除成功!'
							  });
						  }else {
							  this.$message.info(res.msg)
						  }
				          
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
			},
		  },
	    }
</script>

<style>
</style>
