use std::ffi::{CStr, CString};
use std::os::raw::c_char;
use crate::parse_interactive_text;

/// Safely free memory allocated by Rust's CString when C++ is done with it.
#[unsafe(no_mangle)]
pub extern "C" fn free_rust_string(s: *mut c_char) {
    if s.is_null() {
        return;
    }
    unsafe {
        let _ = CString::from_raw(s);
    }
}

/// Takes a raw C string, parses it using the Rust engine, and returns a JSON string C pointer.
#[unsafe(no_mangle)]
pub extern "C" fn process_text_ffi(input: *const c_char) -> *mut c_char {
    if input.is_null() {
        return std::ptr::null_mut();
    }

    let c_str = unsafe { CStr::from_ptr(input) };
    let r_str = match c_str.to_str() {
        Ok(s) => s,
        Err(_) => return std::ptr::null_mut(),
    };

    // Call the heavy computation core
    let segments = parse_interactive_text(r_str);

    // Serialize to JSON to pass back over the FFI boundary
    let json = serde_json::to_string(&segments).unwrap_or_else(|_| "[]".to_string());
    
    let c_string = CString::new(json).unwrap();
    c_string.into_raw()
}
