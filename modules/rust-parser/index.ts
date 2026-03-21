import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'rust-parser' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// In a real Expo Module or TurboModule, you would import the native turbo module here.
/*
const RustParser = NativeModules.RustParser
  ? NativeModules.RustParser
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );
*/

export interface TextSegment {
    text: string;
    is_bold: boolean;
    is_italic: boolean;
    is_math: boolean;
    is_link: boolean;
    link_url?: string;
}

/**
 * Parses the raw markdown/latex text string into formatting segments natively using Rust via JSI.
 * This skips the regex-heavy JS mapping in InteractiveText.tsx to maintain 60FPS UI performance.
 * 
 * @param text The raw string from the session.
 * @returns Array of cleanly segmented chunks with formatting booleans attached.
 */
export function parseInteractiveText(text: string): TextSegment[] {
    // -----------------------------------------------------------------------------------------
    // RUST FFI INTEGRATION POINT:
    // Once the bridge is compiled (e.g. via rust-android-gradle), you would replace this 
    // mock with an exact cross-call:
    // 
    // const jsonResponse = RustParser.process_text_ffi(text);
    // return JSON.parse(jsonResponse);
    // -----------------------------------------------------------------------------------------
    
    console.warn("Native Rust mapping is pending C++ compilation. Falling back to simple JS mapping.");
    
    // Fallback logic until Native Module is compiled and linked natively
    return [{
       text,
       is_bold: false,
       is_italic: false,
       is_math: false,
       is_link: false
    }];
}
