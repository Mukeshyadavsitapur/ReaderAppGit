pub mod ffi;

use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct TextSegment {
    pub text: String,
    pub is_bold: bool,
    pub is_italic: bool,
    pub is_math: bool,
    pub is_link: bool,
    pub link_url: Option<String>,
}

pub fn parse_interactive_text(raw_text: &str) -> Vec<TextSegment> {
    // This is a simplified high-speed Rust implementation of the logic currently 
    // bottlenecking the JS thread in InteractiveText.tsx.
    // In production, you would use regex or a robust markdown parser here (e.g. `pulldown-cmark`).
    
    let mut segments = Vec::new();
    
    // Very basic split logic for demonstration purposes
    for word in raw_text.split_whitespace() {
        let is_bold = word.starts_with("**") && word.ends_with("**");
        let is_italic = word.starts_with('*') && word.ends_with('*') && !is_bold;
        let is_math = word.starts_with('$') && word.ends_with('$');
        
        let clean_text = if is_bold {
            word.trim_matches('*').to_string()
        } else if is_italic {
            word.trim_matches('*').to_string()
        } else if is_math {
            word.trim_matches('$').to_string()
        } else {
            word.to_string()
        };

        segments.push(TextSegment {
            text: format!("{} ", clean_text),
            is_bold,
            is_italic,
            is_math,
            is_link: false,
            link_url: None,
        });
    }
    
    segments
}
