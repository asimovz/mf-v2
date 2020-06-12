<template>
  <div class="ball-beat">
    <div class="a"></div>
    <div class="b"></div>
    <div class="c"></div>
  </div>
</template>
<script>
export default {}
</script>
<style>
.loader {
    box-sizing: border-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex: 0 1 auto;
    flex: 0 1 auto;
    -ms-flex-direction: column;
    flex-direction: column;
    -ms-flex-positive: 1;
    flex-grow: 1;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    -ms-flex-preferred-size: 25%;
    flex-basis: 25%;
    max-width: 25%;
    height: 200px;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;
}

@-webkit-keyframes ball-beat {
    50% {
        opacity: .2;
        -webkit-transform: scale(.75);
        transform: scale(.75)
    }

    100% {
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1)
    }
}

@keyframes ball-beat {
    50% {
        opacity: .2;
        -webkit-transform: scale(.75);
        transform: scale(.75)
    }

    100% {
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1)
    }
}

.ball-beat {
  width: 100%;
  text-align: center;
}
.ball-beat>div {
    width: 12px;
    height: 12px;
    margin: 2px;
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: ball-beat .7s 0s infinite linear;
    animation: ball-beat .7s 0s infinite linear;
}

.ball-beat .a {
    background: #DE7165
}
.ball-beat .b {
    background: #EFC465
}
.ball-beat .c {
    background: #7CC363
}


.ball-beat>div:nth-child(2n-1) {
    -webkit-animation-delay: -.35s!important;
    animation-delay: -.35s!important
}

</style>
