'use client';

import { useEffect } from 'react';

export const H2HProviderSnippetInit = () => {
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const PROVIDER_CONFIG = {
            bri: {
                key: 'bri',
                androidCall: 'TerminalBRI',
                iosCall: 'TerminalBRI.shared',
            },
            cashup: {
                key: 'cashup',
                androidCall: 'TerminalCashup',
                iosCall: 'TerminalCashup.shared',
            },
            ntt: {
                key: 'ntt',
                androidCall: 'TerminalNTT',
                iosCall: 'TerminalNTT.shared',
            },
        };

        const SUPPORTED_KEYS = Object.keys(PROVIDER_CONFIG);

        function buildAndroidProviderLines(selectedKeys) {
            const lines = selectedKeys.map((key) => `    TerminalH2H.addProvider(${PROVIDER_CONFIG[key].androidCall})`);
            return lines.length ? lines.join('\n') : '    TerminalH2H.addProvider(TerminalBRI)';
        }

        function buildIosProviderLines(selectedKeys) {
            const lines = selectedKeys.map((key) => `  TerminalH2H.shared.addProvider(provider: ${PROVIDER_CONFIG[key].iosCall})`);
            return lines.length ? lines.join('\n') : '  TerminalH2H.shared.addProvider(provider: TerminalBRI.shared)';
        }

        function highlight(codeElement) {
            if (typeof window === 'undefined' || !codeElement) {
                return;
            }

            if (window.Prism?.highlightElement) {
                window.Prism.highlightElement(codeElement);
            }
        }

        function getSelectedProviderKeys() {
            return SUPPORTED_KEYS.filter((key) => {
                const checkbox = document.getElementById(`${key}-checkbox`);
                return checkbox ? checkbox.checked : false;
            });
        }

        const updateSnippets = () => {
            const androidProviderCode = document.querySelector('#h2h-android-provider-snippet pre code, #h2h-android-provider-snippet code');
            const iosProviderCode = document.querySelector('#h2h-ios-provider-snippet pre code, #h2h-ios-provider-snippet code');

            if (!androidProviderCode || !iosProviderCode) {
                window.setTimeout(updateSnippets, 100);
                return;
            }

            const providerKeys = getSelectedProviderKeys();
            const effectiveKeys = providerKeys.length ? providerKeys : ['bri'];

            androidProviderCode.textContent = `import co.xendit.terminal.core.TerminalApp\nimport co.xendit.terminal.h2h.TerminalH2H\n\nclass App : Application() {\n  override fun onCreate() {\n    super.onCreate()\n\n    TerminalApp.initialize(\n      application = this,\n      clientKey = CLIENT_KEY,\n      mode = TerminalMode.LIVE // or TerminalMode.INTEGRATION\n    )\n${buildAndroidProviderLines(effectiveKeys)}\n  }\n}`;

            iosProviderCode.textContent = `import TerminalH2H\nimport TerminalCore\n\nfunc application(\n  _ application: UIApplication,\n  didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?\n) -> Bool {\n  TerminalApp.shared.initialize(\n    clientKey: CLIENT_KEY,\n    mode: .live // or .integration\n  )\n${buildIosProviderLines(effectiveKeys)}\n  return true\n}`;

            highlight(androidProviderCode);
            highlight(iosProviderCode);
        };

        const handler = () => {
            updateSnippets();
            window.setTimeout(updateSnippets, 250);
        };

        window.updateH2HProviderSnippets = handler;

        handler();

        return () => {
            if (window.updateH2HProviderSnippets === handler) {
                delete window.updateH2HProviderSnippets;
            }
        };
    }, []);

    return null;
};
