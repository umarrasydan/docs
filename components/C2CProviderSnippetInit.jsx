'use client';

import { useEffect } from 'react';


export const C2CProviderSnippetInit = () => {
    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const PROVIDER_CONFIG = {
            bri: {
                key: 'bri',
                androidCall: 'TerminalBRI',
                iosCall: 'TerminalBRI.shared',
                deviceValue: 'BRI',
                androidDependency: 'implementation("co.xendit.terminal:id-bri-android:<latest_version>")',
                iosDependency: 'Add TerminalBRI.xcframework via Xcode (General > Frameworks, Libraries, and Embedded Content). Follow /sdk/c2c/ios-sdk#installation.',
            },
            cashup: {
                key: 'cashup',
                androidCall: 'TerminalCashup',
                iosCall: 'TerminalCashup.shared',
                deviceValue: 'CASHUP',
                androidDependency: 'implementation("co.xendit.terminal:id-cashup-android:<latest_version>")',
                iosDependency: 'Add TerminalCashup.xcframework via Xcode (General > Frameworks, Libraries, and Embedded Content). Follow /sdk/c2c/ios-sdk#installation. Contact Xendit for access.',
            },
            ntt: {
                key: 'ntt',
                androidCall: 'TerminalNTT',
                iosCall: 'TerminalNTT.shared',
                deviceValue: 'NTT',
                androidDependency: 'implementation("co.xendit.terminal:th-ntt-android:<latest_version>")',
                iosDependency: 'Add TerminalNTT.xcframework via Xcode (General > Frameworks, Libraries, and Embedded Content). Follow /sdk/c2c/ios-sdk#installation. Contact Xendit for access.',
            },
            shc: {
                key: 'shc',
                androidCall: 'TerminalSHC',
                iosCall: 'TerminalSHC.shared',
                deviceValue: 'SHC',
                androidDependency: 'implementation("co.xendit.terminal:my-shc-android:<latest_version>")',
                iosDependency: 'Add TerminalSHC.xcframework via Xcode (General > Frameworks, Libraries, and Embedded Content). Follow /sdk/c2c/ios-sdk#installation. Contact Xendit for access.',
            },
        };

        const SUPPORTED_KEYS = Object.keys(PROVIDER_CONFIG);

        function buildAndroidProviderLines(selectedKeys) {
            return selectedKeys
                .map((key) => `    TerminalC2C.addProvider(${PROVIDER_CONFIG[key].androidCall})`)
                .join('\n') || '    TerminalC2C.addProvider(TerminalBRI)';
        }

        function buildIosProviderLines(selectedKeys) {
            return selectedKeys
                .map((key) => `  TerminalC2C.shared.addProvider(provider: ${PROVIDER_CONFIG[key].iosCall})`)
                .join('\n') || '  TerminalC2C.shared.addProvider(provider: TerminalBRI.shared)';
        }

        function buildDeviceLines(selectedKeys) {
            if (!selectedKeys.length) {
                return {
                    android: '  provider = "BRI"',
                    ios: '  provider: "BRI"',
                };
            }

            if (selectedKeys.length === 1) {
                const value = PROVIDER_CONFIG[selectedKeys[0]].deviceValue;
                return {
                    android: `  provider = "${value}"`,
                    ios: `  provider: "${value}"`,
                };
            }

            const primary = PROVIDER_CONFIG[selectedKeys[0]].deviceValue;
            const others = selectedKeys
                .slice(1)
                .map((key) => PROVIDER_CONFIG[key].deviceValue)
                .join(', ');

            return {
                android: `  provider = "${primary}" // or ${others}`,
                ios: `  provider: "${primary}" // or ${others}`,
            };
        }

        function buildAndroidDependencyLines(selectedKeys) {
            const providerKeys = selectedKeys.length ? selectedKeys : ['bri'];

            return [
                '  // Terminal C2C SDK',
                '  implementation("co.xendit.terminal:c2c-android:<latest_version>")',
                '',
                '  // Core Terminal SDK (required)',
                '  implementation("co.xendit.terminal:core-android:<latest_version>")',
                '',
                ...providerKeys.map((key) => `  ${PROVIDER_CONFIG[key].androidDependency}`),
            ].join('\n');
        }

        function buildIosDependencyLines(selectedKeys) {
            return selectedKeys
                .map((key) => `- ${PROVIDER_CONFIG[key].iosDependency}`)
                .join('\n') || '- Add TerminalBRI.xcframework via Xcode (General > Frameworks, Libraries, and Embedded Content). Follow /sdk/c2c/ios-sdk#installation.';
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

        function ensureElements(...elements) {
            return elements.every(Boolean);
        }
        const updateSnippets = () => {
            const androidProviderCode = document.querySelector('#c2c-android-provider-snippet pre code, #c2c-android-provider-snippet code');
            const iosProviderCode = document.querySelector('#c2c-ios-provider-snippet pre code, #c2c-ios-provider-snippet code');
            const androidDeviceCode = document.querySelector('#c2c-android-device-snippet pre code, #c2c-android-device-snippet code');
            const iosDeviceCode = document.querySelector('#c2c-ios-device-snippet pre code, #c2c-ios-device-snippet code');
            const androidDependencyCode = document.querySelector('#c2c-android-dependency-snippet pre code, #c2c-android-dependency-snippet code');
            const iosDependencyCode = document.querySelector('#c2c-ios-dependency-snippet pre code, #c2c-ios-dependency-snippet code');

            if (!ensureElements(androidProviderCode, iosProviderCode, androidDeviceCode, iosDeviceCode, androidDependencyCode, iosDependencyCode)) {
                window.setTimeout(updateSnippets, 100);
                return;
            }

            const providerKeys = getSelectedProviderKeys();
            const effectiveKeys = providerKeys.length ? providerKeys : ['bri'];
            const deviceLines = buildDeviceLines(effectiveKeys);

            androidProviderCode.textContent = `import co.xendit.terminal.c2c.TerminalC2C
import co.xendit.terminal.core.TerminalApp

class App : Application() {
  override fun onCreate() {
    super.onCreate()

    TerminalApp.initialize(
      context = this,
      clientKey = CLIENT_KEY,
      mode = TerminalMode.LIVE // or TerminalMode.INTEGRATION
    )
${buildAndroidProviderLines(effectiveKeys)}
  }
}`;

            iosProviderCode.textContent = `import TerminalC2C
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

            androidDeviceCode.textContent = `val terminalDevice = TerminalDevice.create(
  id = "TID001",
  ipAddress = "192.168.1.100",
${deviceLines.android}
)

TerminalC2C.setTerminalDevice(terminalDevice)`;

            iosDeviceCode.textContent = `let terminalDevice = TerminalDevice.create(
  id: "TID001",
  ipAddress: "192.168.1.100",
${deviceLines.ios}
)

TerminalC2C.shared.setTerminalDevice(terminalDevice)`;

            androidDependencyCode.textContent = `dependencies {
${buildAndroidDependencyLines(effectiveKeys)}
}`;

            iosDependencyCode.textContent = `# Add these provider frameworks to your target
${buildIosDependencyLines(effectiveKeys)}`;

            highlight(androidProviderCode);
            highlight(iosProviderCode);
            highlight(androidDeviceCode);
            highlight(iosDeviceCode);
            highlight(androidDependencyCode);
            highlight(iosDependencyCode);
        };

        const handler = () => {
            updateSnippets();
            window.setTimeout(updateSnippets, 250);
        };

        window.updateC2CProviderSnippets = handler;

        handler();

        return () => {
            if (window.updateC2CProviderSnippets === handler) {
                delete window.updateC2CProviderSnippets;
            }
        };
    }, []);

    return null;
};
