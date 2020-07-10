<script>
import { Carousel } from 'element-ui'

export default {
  name: 'm-carousel',
  extends: Carousel,
  methods: {
    // 修复继成后item不显示为题
    updateItems () {
      this.items = this.$children.filter(child => child.$options.name === 'm-carousel-item')
    }
  }
}
</script>