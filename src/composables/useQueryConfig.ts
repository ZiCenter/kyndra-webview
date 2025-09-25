import {reactive, readonly} from 'vue'
import {useRoute} from 'vue-router'

interface WebViewConfig {
    ui: boolean
    showResultsInRest: boolean
}

export function useQueryConfig(): WebViewConfig {
    const route = useRoute()

    return readonly(
        reactive({
            ui: route.query.ui !== 'false',
            showResultsInRest: route.query.showResultsInRest === 'true'
        })
    )
}
