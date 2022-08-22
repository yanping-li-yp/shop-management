<template>
  <div id="editor" ref="editor"></div>
</template>

<script>
	import E from 'wangeditor'
	export default {
    name:'WangEditor',
    props:{
      wangEditorContent:{
        type:String,
      },
      isClear: {
        type: Boolean,
        default: false
      },
      upload_config_id:{
        type:Number,
      }
    },
		data() {
		  return {
		    editor: ""
		  }
    },
    watch: {
      isClear(val) {
        if(val) {
          this.editor.txt.clear()
        }
      }
    },
		mounted() {
		  this.$nextTick(function() {
		    const _this = this
        this.editor = new E(this.$refs.editor)
        /*配置文件*/
        this.editor.config.uploadImgMaxLength = 1
        this.editor.config.uploadFileName = 'file'
        this.editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
        this.editor.config.uploadImgMaxSize = 10 * 1024 * 1024
        this.editor.config.uploadImgServer = '#'
        this.editor.create()
        if(_this.wangEditorContent){
          this.editor.txt.html(_this.wangEditorContent)
        }
        this.editor.config.onchange = (html)=>{
          _this.$emit('update:wangEditorContent',html)
        }

        this.editor.config.uploadImgHooks = {
          error: function(xhr, editor, resData) {
              console.log('error', xhr, resData)
          },
          customInsert: function(insertImgFn, result) {
              insertImgFn(result.data)
          }
        }
      //上传图片
        this.editor.config.customUploadImg = function (resultFiles, insertImgFn) {
            let formdata = new FormData()
            formdata.append('file', resultFiles[0])
            formdata.append('edit', true)
            formdata.append('upload_config_id', _this.upload_config_id)
            //上传服务端
            _this.$axios.post('/Upload/upload', formdata).then(res => {
              insertImgFn(res.data.data)
            })
        }
		  });
		}
	}
</script>
