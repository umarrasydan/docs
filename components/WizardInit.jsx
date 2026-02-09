'use client';

const useEffect = globalThis.React?.useEffect ?? ((effect) => {
    if (typeof window !== 'undefined') {
        effect();
    }
});

export const WizardInit = () => {
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        window._wizardPath = window._wizardPath || 'h2h';

        window._toggleProvider = function (id) {
            var cb = document.getElementById(id + '-checkbox');
            var card = document.getElementById('provider-' + id);
            if (!cb || !card) return;
            cb.checked = !cb.checked;
            card.classList.toggle('selected', cb.checked);
            if (window.updateC2CProviderSnippets) window.updateC2CProviderSnippets();
            if (window.updateH2HProviderSnippets) window.updateH2HProviderSnippets();
        };

        return () => {
            delete window._toggleProvider;
        };
    }, []);

    return null;
};
