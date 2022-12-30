<script setup lang="ts">
const props = defineProps<{
  light?: boolean
}>()

const router = useRouter()
const isLoading = ref(false)

router.beforeEach(() => {
  isLoading.value = true
})
router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 200)
})
</script>

<template>
  <svg
    id="OBJECTS"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 322.000000 405.000000"
    style="enable-background: new 0 0 160 160"
    xml:space="preserve"
    :class="[props.light && 'is-light']"
  >
    <g :class="[isLoading && 'is-roll']">
      <g
        transform="translate(0.000000,405.000000) scale(0.100000,-0.100000)"
        fill="#3780ff"
        stroke="none"
      >
        <path
          d="M620 4009 c-277 -71 -500 -296 -570 -574 -19 -78 -20 -111 -20 -1403
            0 -1484 -5 -1389 74 -1557 69 -145 174 -261 316 -345 77 -47 126 -65 240 -91
            80 -17 136 -19 946 -19 939 0 951 1 1094 57 250 100 436 322 486 580 21 110
            21 2645 0 2744 -66 307 -287 533 -602 613 -54 14 -177 16 -975 15 -869 -1
            -918 -2 -989 -20z m1934 -189 c112 -28 190 -73 277 -160 57 -56 85 -94 112
            -150 70 -147 67 -66 67 -1481 0 -1229 -1 -1279 -19 -1351 -58 -225 -215 -386
            -434 -444 -42 -11 -219 -14 -941 -14 -988 0 -945 -3 -1081 68 -126 66 -231
            190 -288 339 l-22 58 -3 1310 c-3 1195 -1 1316 14 1380 51 217 225 393 439
            446 64 16 150 18 936 18 831 1 869 0 943 -19z"
        />
        <path
          d="M925 3231 c-60 -10 -83 -27 -95 -69 -11 -41 -13 -2214 -1 -2266 3
            -16 19 -38 34 -50 28 -21 36 -21 480 -21 431 0 456 1 532 22 123 33 188 60
            267 112 85 55 168 144 204 217 54 111 54 104 54 857 l0 698 -25 76 c-50 149
            -145 252 -298 328 -115 57 -219 83 -372 95 -136 11 -719 11 -780 1z m814 -186
            c173 -30 309 -128 363 -262 l23 -58 0 -701 0 -700 -38 -76 c-55 -113 -136
            -178 -277 -224 -47 -15 -103 -18 -382 -22 l-328 -4 0 1031 0 1031 278 0 c199
            0 300 -4 361 -15z"
        />
      </g>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.right {
  fill: var(--primary-dark-7);
}

.bottom {
  fill: var(--primary);
}

.left {
  fill: var(--primary-light-15);
}

.is-roll,
svg:hover {
  .right {
    animation: is-roll-right 8s ease infinite;
    animation-fill-mode: forwards;
    animation-delay: 0s;
  }

  .left {
    animation: is-roll-left 8s ease infinite;
    animation-fill-mode: forwards;
    animation-delay: 0s;
  }

  .bottom {
    animation: is-roll-bottom 8s ease infinite;
    animation-fill-mode: forwards;
    animation-delay: 0s;
  }
}

.is-light {
  .right {
    fill: var(--white);
    animation: none;
  }

  .bottom {
    fill: #fffc;
    animation: none;
  }

  .left {
    fill: #fffa;
    animation: none;
  }
}

@keyframes is-roll-right {
  0% {
    fill: var(--primary-dark-7);
  }

  33% {
    fill: var(--primary-light-8);
  }

  66% {
    fill: var(--primary-light-40);
  }

  100% {
    fill: var(--primary-dark-7);
  }
}

@keyframes is-roll-bottom {
  0% {
    fill: var(--primary);
  }

  33% {
    fill: var(--primary-light-24); // darken(#1ee8c0, 7%);
  }

  66% {
    fill: var(--primary-light-20);
  }

  100% {
    fill: var(--primary);
  }
}

@keyframes is-roll-left {
  0% {
    fill: var(--primary-light-15);
  }

  33% {
    fill: var(--primary-light-12); // lighten(#1ee8c0, 15%);
  }

  66% {
    fill: var(--primary-light-15);
  }

  100% {
    fill: var(--primary-light-15);
  }
}
</style>
