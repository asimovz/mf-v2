<template>
	<component ref="component" :is="curComponent"></component> 
</template>
<script>
import ballBeat from './ball.beat'
import ballVary from './ball.vary'
export default {
	name: 'm-loading',
    components: {
        "ball-beat":ballBeat,
        "ball-vary": ballVary,
    },
    props: {
        type:{
            type:String,
            default:'ball-beat'
        }
    },
    data() {
        return {
            curComponent: this.type
        }
    }

}

</script>

