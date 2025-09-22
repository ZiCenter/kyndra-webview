/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import {router} from "@/router.ts";
import {MessageRouter} from "@/services/messaging.service.ts";
import {PoseInput} from "@zicenter/kyndra";
import vuetify from './vuetify'

// Types
import {type App} from 'vue'

const messaging = new MessageRouter()
const input = new PoseInput()

export function registerPlugins(app: App) {
    app.use(vuetify)
    app.use(router)
    app.provide('messaging', messaging)
    app.provide('input', input)
}
