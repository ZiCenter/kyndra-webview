import {useTheme} from 'vuetify'

export function useQueryTheme() {
    const theme = useTheme()

    const applyTheme = () => {
        const urlParams = new URLSearchParams(window.location.search)
        let themeName = urlParams.get('theme') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        if (['dark', 'light'].includes(themeName)) theme.change(themeName)
    }

    applyTheme()

    return applyTheme
}
