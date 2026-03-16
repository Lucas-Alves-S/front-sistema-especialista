<template>
    <div class="background" v-if="model == true">
        <div class="spinner">
        </div>
        <img class="logo" src="@/assets/images/rhLogo.png">
    </div>
</template>

<script setup lang="ts">
const model = defineModel<unknown>()
</script>

<style scoped>
.background {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.389);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
}

.spinner {
    position: fixed;
    align-self: center;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px;
    width: 150px;
    height: 150px;
    background: var(--color-surface);
    -webkit-animation-name: spin;
    -webkit-animation-duration: 4000ms;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
    -moz-animation-name: spin;
    -moz-animation-duration: 4000ms;
    -moz-animation-iteration-count: infinite;
    -moz-animation-timing-function: linear;
    -ms-animation-name: spin;
    -ms-animation-duration: 4000ms;
    -ms-animation-iteration-count: infinite;
    -ms-animation-timing-function: linear;

    animation-name: spin;
    animation-duration: 6000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}

.spinner::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 100%;
    background: repeating-conic-gradient(from 0deg,
            var(--color-primary) 0deg 45deg,
            /* tamanho do traço */
            transparent 45deg 90deg
            /* espaçamento */
        );
    /* cria o “anel” */
    -webkit-mask: radial-gradient(farthest-side,
            transparent calc(100% - 5px),
            black calc(100% - 4px));
    mask: radial-gradient(farthest-side,
            transparent calc(100% - 5px),
            black calc(100% - 4px));
}

.logo {
    position: fixed;
    align-self: center;
    height: 100px;
    width: 100px;
}

@-ms-keyframes spin {
    from {
        -ms-transform: rotate(0deg);
    }

    to {
        -ms-transform: rotate(360deg);
    }
}

@-moz-keyframes spin {
    from {
        -moz-transform: rotate(0deg);
    }

    to {
        -moz-transform: rotate(360deg);
    }
}

@-webkit-keyframes spin {
    from {
        -webkit-transform: rotate(0deg);
    }

    to {
        -webkit-transform: rotate(360deg);
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>