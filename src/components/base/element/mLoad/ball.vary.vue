<template>
	<ul class="loading">
		<li id='a'></li>
		<li id='b'></li>
		<li id='c'></li>
		<li id='d'></li>
		<li id='e'></li>
		<li id='f'></li>
		<li id='g'></li>
		<li id='h'></li>
		<li id='i'></li>
	</ul>
</template>
<script>
export default {
	name:'m-loading'
}
</script>
<style>
ul.loading {
  position: absolute;
  left: 50%;
  top: 400px;
  transform: rotate(45deg) translate(0, -50%);
}

ul.loading li {
  list-style-type: none;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 20px;
  height: 20px;
  background: #f1f1f1;
  border-radius: 50%;
}

#a {
  animation: a .8s ease-in-out infinite;
  top: -40px;
  left: -40px;
}

#b {
  animation: b .8s ease-in-out infinite;
  top: -40px;
  left: 0px;
}

#c {
  animation: c .8s ease-in-out infinite;
  top: -40px;
  left: 40px;
}

#d {
  animation: d .8s ease-in-out infinite;
  top: 0px;
  left: -40px;
}

#e {
  animation: e .8s ease-in-out infinite;
  top: 0px;
  left: 0px;
}

#f {
  animation: f .8s ease-in-out infinite;
  top: 0px;
  left: 40px;
}

#g {
  animation: g .8s ease-in-out infinite;
  top: 40px;
  left: -40px;
}

#h {
  animation: h .8s ease-in-out infinite;
  top: 40px;
  left: 0px;
}

#i {
  animation: i .8s ease-in-out infinite;
  top: 40px;
  left: 40px;
}

@keyframes a {
  50% {
    top: 0px;
    left: -40px;
  }
  100% {
    top: 0px;
    left: -40px;
  }
}
@keyframes b {
  50% {
    top: -40px;
    left: -40px;
  }
  100% {
    top: -40px;
    left: -40px;
  }
}
@keyframes c {
  50% {
    top: -40px;
    left: 0px;
  }
  100% {
    top: -40px;
    left: 0px;
  }
}
@keyframes d {
  50% {
    top: 40px;
    left: -40px;
  }
  100% {
    top: 40px;
    left: -40px;
  }
}
@keyframes f {
  50% {
    top: -40px;
    left: 40px;
  }
  100% {
    top: -40px;
    left: 40px;
  }
}
@keyframes g {
  50% {
    top: 40px;
    left: 0px;
  }
  100% {
    top: 40px;
    left: 0px;
  }
}
@keyframes h {
  50% {
    top: 40px;
    left: 40px;
  }
  100% {
    top: 40px;
    left: 40px;
  }
}
@keyframes i {
  50% {
    top: 0px;
    left: 40px;
  }
  100% {
    top: 0px;
    left: 40px;
  }
}
</style>