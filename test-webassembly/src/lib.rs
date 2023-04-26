mod utils;

use std::io::{Cursor};

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn gray(_array: &mut [u8]) -> Vec<u8> {
    let mut img = image::load_from_memory(_array).unwrap();
    img = img.grayscale();
    let mut bytes: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut bytes), image::ImageOutputFormat::Png).unwrap();
    bytes
}

