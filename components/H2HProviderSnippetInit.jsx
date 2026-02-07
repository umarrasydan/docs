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
                androidDependency: 'implementation("co.xendit.terminal:id-bri-android:<latest_version>")',
                iosDependency: 'Add TerminalBRI.xcframework via Xcode (General > Frameworks, Libraries, and Embedded Content). Follow /sdk/h2h/ios-sdk#installation.',
            },
            cashup: {
                key: 'cashup',
                androidCall: 'TerminalCashup',
                iosCall: 'TerminalCashup.shared',
                androidDependency: 'implementation("co.xendit.terminal:id-cashup-android:<latest_version>")',
                iosDependency: 'Add TerminalCashup.xcframework via Xcode (General > Frameworks, Libraries, and Embedded Content). Follow /sdk/h2h/ios-sdk#installation. Contact Xendit for access.',
            },
            ntt: {
                key: 'ntt',
                androidCall: 'TerminalNTT',
                iosCall: 'TerminalNTT.shared',
                androidDependency: 'implementation("co.xendit.terminal:th-ntt-android:<latest_version>")',
                iosDependency: 'Add TerminalNTT.xcframework via Xcode (General > Frameworks, Libraries, and Embedded Content). Follow /sdk/h2h/ios-sdk#installation. Contact Xendit for access.',
            },
            shc: {
                key: 'shc',
                androidCall: 'TerminalSHC',
                iosCall: 'TerminalSHC.shared',
                androidDependency: 'implementation("co.xendit.terminal:my-shc-android:<latest_version>")',
                iosDependency: 'Add TerminalSHC.xcframework via Xcode (General > Frameworks, Libraries, and Embedded Content). Follow /sdk/h2h/ios-sdk#installation. Contact Xendit for access.',
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

        function buildAndroidDependencyLines(selectedKeys) {
            const providerKeys = selectedKeys.length ? selectedKeys : ['bri'];

            return [
                '  // Terminal H2H SDK',
                '  implementation("co.xendit.terminal:h2h-android:<latest_version>")',
                '',
                '  // Core Terminal SDK (required)',
                '  implementation("co.xendit.terminal:core-android:<latest_version>")',
                '',
                ...providerKeys.map((key) => `  ${PROVIDER_CONFIG[key].androidDependency}`),
            ].join('\n');
        }

        function buildIosDependencyLines(selectedKeys) {
            if (!selectedKeys.length) {
                return '- Add TerminalBRI.xcframework via Xcode (General > Frameworks, Libraries, and Embedded Content). Follow /sdk/h2h/ios-sdk#installation.';
            }

            return selectedKeys
                .map((key) => `- ${PROVIDER_CONFIG[key].iosDependency}`)
                .join('\n');
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
            const androidDependencyCode = document.querySelector('#h2h-android-dependency-snippet pre code, #h2h-android-dependency-snippet code');
            const iosDependencyCode = document.querySelector('#h2h-ios-dependency-snippet pre code, #h2h-ios-dependency-snippet code');

            if (!androidProviderCode || !iosProviderCode || !androidDependencyCode || !iosDependencyCode) {
                window.setTimeout(updateSnippets, 100);
                return;
            }
            const providerKeys = getSelectedProviderKeys();
            const effectiveKeys = providerKeys.length ? providerKeys : ['bri'];

            androidProviderCode.textContent = `import co.xendit.terminal.core.TerminalApp
import co.xendit.terminal.h2h.TerminalH2H

class App : Application() {
  override fun onCreate() {
    super.onCreate()

    TerminalApp.initialize(
      application = this,
      clientKey = CLIENT_KEY,
      mode = TerminalMode.LIVE // or TerminalMode.INTEGRATION
    )
${buildAndroidProviderLines(effectiveKeys)}
  }
}`;

            iosProviderCode.textContent = `import TerminalH2H
import TerminalCore

func application(
  _ application: UIApplication,
  didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
) -> Bool {
  TerminalApp.shared.initialize(
    clientKey: CLIENT_KEY,
    mode: TerminalMode.live // or TerminalMode.integration
  )
${buildIosProviderLines(effectiveKeys)}
  return true
}`;

            androidDependencyCode.textContent = `dependencies {
${buildAndroidDependencyLines(effectiveKeys)}
}`;

            iosDependencyCode.textContent = `# Add these provider frameworks using Xcode (General > Frameworks, Libraries, and Embedded Content).
# See /sdk/h2h/ios-sdk#installation for installation steps.

${buildIosDependencyLines(effectiveKeys)}`;

            highlight(androidProviderCode);
            highlight(iosProviderCode);
            highlight(androidDependencyCode);
            highlight(iosDependencyCode);
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
