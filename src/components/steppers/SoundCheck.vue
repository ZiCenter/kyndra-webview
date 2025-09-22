<script setup lang="ts">
import soundCheck from '@/assets/mp3/sound-check.mp3'

defineEmits(['complete'])
</script>

<template>
    <v-container fluid class="fill-height bg-black px-8 py-16">
        <div class="mr-6">
            <div class="text-h2 font-weight-light mb-6">Sound <br> Test</div>
            <div class="text-subtitle-1">
                You need audio enabled in order to perform this activity.
            </div>
        </div>
        <v-spacer />
        <v-img src="@/assets/sound-check.gif" contain width="100%"></v-img>
        <audio :src="soundCheck" v-show="false" autoplay loop />
        <v-spacer />
        <div class="d-flex justify-center w-100 px-16">
            <v-btn
                variant="outlined" rounded="pill"
                class="text-none"
                prepend-icon="mdi-cellphone-sound"
                append-icon="mdi-check-decagram"
                @click="$emit('complete')"
            >
                Sounds Okay
                <template v-slot:append>
                    <v-icon color="warning"/>
                </template>
            </v-btn>
        </div>
    </v-container>
</template>

<style scoped>

</style>
