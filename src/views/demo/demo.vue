<template>
  <div>

    <WangEditor v-if="show"  :isClear="isClear" :wangEditorContent.sync="form.detail"></WangEditor>
  </div>
</template>

<script>
import WangEditor from '@/components/editor/WangEditor.vue'
export default {
  props: {
  	show: {
  		type: Boolean,
  		default: false
  	},
  	size: {
  		type: String,
  		default: 'small'
  	},
  },
  components: {
  	WangEditor
  },
  data(){
    return {
    	isClear:false,
     }
  }
}
</script>
