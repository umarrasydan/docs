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

        var STEP_IDS = [
            'step1-type',
            'step1-standalone',
            'step2-path',
            'step3-providers',
            'step3-h2h-content',
            'step3-c2c-fork',
            'step3-c2c-api-content',
            'step3-c2c-sdk-content',
        ];

        window._wizardPath = window._wizardPath || 'h2h';

        function getCheckedProviderCount() {
            return document.querySelectorAll('#step3-providers input[type="checkbox"]:checked').length;
        }

        function updateProviderContinueState() {
            var continueButton = document.getElementById('provider-continue-button');
            var helperText = document.getElementById('provider-continue-hint');
            if (!continueButton || !helperText) return;

            var hasSelection = getCheckedProviderCount() > 0;
            continueButton.disabled = !hasSelection;
            continueButton.setAttribute('aria-disabled', hasSelection ? 'false' : 'true');
            helperText.style.display = hasSelection ? 'none' : 'block';
        }

        function applyPathPresentation(path) {
            var effectivePath = path === 'c2c' ? 'c2c' : 'h2h';
            window._wizardPath = effectivePath;

            var atomSection = document.getElementById('provider-atom-section');
            var atomCheckbox = document.getElementById('atom-checkbox');
            var atomCard = document.getElementById('provider-atom');
            var h2hBanner = document.getElementById('path-banner-h2h');
            var c2cBanner = document.getElementById('path-banner-c2c');

            if (effectivePath === 'c2c') {
                if (atomSection) atomSection.style.display = 'none';
                if (atomCheckbox) atomCheckbox.checked = false;
                if (atomCard) atomCard.classList.remove('selected');
                if (h2hBanner) h2hBanner.style.display = 'none';
                if (c2cBanner) c2cBanner.style.display = 'flex';
            } else {
                if (atomSection) atomSection.style.display = '';
                if (h2hBanner) h2hBanner.style.display = 'flex';
                if (c2cBanner) c2cBanner.style.display = 'none';
            }
        }

        function setVisibleStep(stepId) {
            STEP_IDS.forEach(function (id) {
                var section = document.getElementById(id);
                if (!section) return;
                section.style.display = id === stepId ? 'block' : 'none';
            });
        }

        function resolvePathFromStep(stepId) {
            if (stepId.indexOf('c2c') >= 0) return 'c2c';
            if (stepId.indexOf('h2h') >= 0) return 'h2h';
            return window._wizardPath || 'h2h';
        }

        function restoreFromHash() {
            var rawHash = (window.location.hash || '').replace('#', '');
            var stepId = STEP_IDS.indexOf(rawHash) >= 0 ? rawHash : 'step1-type';
            var resolvedPath = resolvePathFromStep(stepId);

            applyPathPresentation(resolvedPath);
            setVisibleStep(stepId);
            updateProviderContinueState();
        }

        window._updateProviderContinueState = updateProviderContinueState;

        window._toggleProvider = function (id) {
            var cb = document.getElementById(id + '-checkbox');
            var card = document.getElementById('provider-' + id);
            if (!cb || !card) return;
            cb.checked = !cb.checked;
            card.classList.toggle('selected', cb.checked);
            updateProviderContinueState();
            if (window.updateC2CProviderSnippets) window.updateC2CProviderSnippets();
            if (window.updateH2HProviderSnippets) window.updateH2HProviderSnippets();
        };

        window.addEventListener('hashchange', restoreFromHash);
        restoreFromHash();

        return () => {
            window.removeEventListener('hashchange', restoreFromHash);
            if (window._updateProviderContinueState === updateProviderContinueState) {
                delete window._updateProviderContinueState;
            }
            delete window._toggleProvider;
        };
    }, []);

    return null;
};
