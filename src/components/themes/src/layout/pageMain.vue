<template>
  <div class="aw-page-wrapper">
    <mHeader>
      <slot slot="tools" name="header"></slot>
    </mHeader>
    <div class="aw-container">
      <div class="aw-content">
        <home></home>
      </div>
    </div>
  </div>
</template>
<script>
import home from './home'
import mHeader from '../header'

export default {
  name: 'm-page-main',
  components: {
    home,
    mHeader
  }
}

</script>

