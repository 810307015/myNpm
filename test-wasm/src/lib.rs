mod utils;

use std::collections::HashMap;
use std::io::prelude::*;
use std::io::{Cursor, SeekFrom};
use std::mem::transmute;
use std::thread;
use std::time::Duration;

use image::*;
use serde::{Deserialize, Serialize};
use utils::{frost, gaussian_blur, handler_image, mirror, sketch, Direction, Operate};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

// #[wasm_bindgen]
// pub enum TransformType {
//     Gray = "gray",
//     Thumbnail = "thumbnail",
//     Invert = "invert",
//     Unsharpen = "unsharpen",
//     Contrast = "contrast",
//     Brighten = "brighten",
//     Huerotate = "huerotate",
// }

#[derive(Serialize, Deserialize)]
pub struct TransformOption {
    transform_type: String,
    transform_opts: [f32; 4],
}

// impl JsObject for TransformOption {}

// impl JsCast for TransformOption {
//     fn instanceof(val: &JsValue) -> bool {
//         true
//     }

//     fn unchecked_from_js(val: JsValue) -> Self {
//         Data::Gray()
//     }

//     fn unchecked_from_js_ref(val: &JsValue) -> &Self {
//         todo!()
//     }
// }

// impl AsRef<JsValue> for TransformOption {
//     fn as_ref(&self) -> &JsValue {
//         todo!()
//     }
// }

// 将image库生成的对象转换成base64字符串输出
pub fn get_image_base64_string(img: DynamicImage) -> String {
    let mut c = Cursor::new(Vec::new());
    img.write_to(&mut c, ImageOutputFormat::Png).unwrap();
    let mut out = Vec::new();
    c.seek(SeekFrom::Start(0)).unwrap();
    c.read_to_end(&mut out).unwrap();
    let stt = base64::encode(&mut out);
    return format!("{}{}", "data:image/png;base64,", stt);
}

// 将img转换成vec
pub fn transform_u8_to_vec(img: DynamicImage) -> Vec<u8> {
    let mut c = Cursor::new(Vec::new());
    img.write_to(&mut c, ImageOutputFormat::Png).unwrap();
    let mut out = Vec::new();
    c.seek(SeekFrom::Start(0)).unwrap();
    c.read_to_end(&mut out).unwrap();
    return out;
}

/**
 * 获取图片的base64编码
 */
#[wasm_bindgen(js_name = getBase64)]
pub fn get_base64_image(_array: &mut [u8]) -> String {
    let img = image::load_from_memory(_array).unwrap();

    return get_image_base64_string(img);
}

/**
 * 灰度
 */
#[wasm_bindgen(js_name = gray)]
pub fn gray_image(_array: &mut [u8]) -> Vec<u8> {
    let mut img = image::load_from_memory(_array).unwrap();

    return transform_u8_to_vec(handler_image(img, Operate::Gray));
}

/**
 * 黑白
 */
#[wasm_bindgen(js_name = blackAndWhite)]
pub fn black_and_white_image(_array: &mut [u8]) -> Vec<u8> {
    let mut img = image::load_from_memory(_array).unwrap();

    return transform_u8_to_vec(handler_image(img, Operate::BlackAndWhite));
}

/**
 * 卡通
 */
#[wasm_bindgen(js_name = cartoon)]
pub fn cartoon_image(_array: &mut [u8]) -> Vec<u8> {
    let mut img = image::load_from_memory(_array).unwrap();

    return transform_u8_to_vec(handler_image(img, Operate::Cartoon));
}

/**
 * 熔铸
 */
#[wasm_bindgen(js_name = founding)]
pub fn founding_image(_array: &mut [u8]) -> Vec<u8> {
    let mut img = image::load_from_memory(_array).unwrap();

    return transform_u8_to_vec(handler_image(img, Operate::Founding));
}

/**
 * 反色
 */
#[wasm_bindgen(js_name = invert)]
pub fn invert_image(_array: &mut [u8]) -> Vec<u8> {
    let mut img = image::load_from_memory(_array).unwrap();

    return transform_u8_to_vec(handler_image(img, Operate::Inverse));
}

/**
 * 怀旧
 */
#[wasm_bindgen(js_name = retro)]
pub fn retro_image(_array: &mut [u8]) -> Vec<u8> {
    let mut img = image::load_from_memory(_array).unwrap();

    return transform_u8_to_vec(handler_image(img, Operate::Retro));
}

/**
 * 缩放图片
 */
#[wasm_bindgen(js_name = scale)]
pub fn scale_image(_array: &mut [u8], width: u32, height: u32) -> Vec<u8> {
    let mut img = image::load_from_memory(_array).unwrap();
    img = img.thumbnail(width, height);

    return transform_u8_to_vec(img);
}

/**
 * 图片的锐化蒙版
 */
#[wasm_bindgen(js_name = unsharpen)]
pub fn unsharpen_image(_array: &mut [u8], sigma: f32, threshold: i32) -> Vec<u8> {
    let mut img = image::load_from_memory(_array).unwrap();
    img = img.unsharpen(sigma, threshold);

    return transform_u8_to_vec(img);
}

/**
 * 调整对比度
 */
#[wasm_bindgen(js_name = constrast)]
pub fn constrast_image(_array: &mut [u8], c: f32) -> Vec<u8> {
    let mut img = image::load_from_memory(_array).unwrap();
    img = img.adjust_contrast(c);

    return transform_u8_to_vec(img);
}

/**
 * 调整亮度
 */
#[wasm_bindgen(js_name = brighten)]
pub fn brighten_image(_array: &mut [u8], value: i32) -> Vec<u8> {
    let mut img = image::load_from_memory(_array).unwrap();
    img = img.brighten(value);

    return transform_u8_to_vec(img);
}

/**
 * 色调旋转
 */
#[wasm_bindgen(js_name = huerotate)]
pub fn huerotate_image(_array: &mut [u8], value: i32) -> Vec<u8> {
    let mut img = image::load_from_memory(_array).unwrap();
    img = img.huerotate(value);

    return transform_u8_to_vec(img);
}

/**
 * 进行一整组的变换
 */
#[wasm_bindgen(js_name = transform)]
pub fn transform_image(_array: &mut [u8], options: JsValue) -> Vec<u8> {
    let mut img = image::load_from_memory(_array).unwrap();
    let options: HashMap<String, Vec<f32>> = serde_wasm_bindgen::from_value(options).unwrap();

    for (key, value) in options.iter() {
        match key.as_str() {
            "gray" => img = handler_image(img, Operate::Gray),
            "invert" => img = handler_image(img, Operate::Inverse),
            "cartoon" => img = handler_image(img, Operate::Cartoon),
            "retro" => img = handler_image(img, Operate::Retro),
            "founding" => img = handler_image(img, Operate::Founding),
            "baw" => img = handler_image(img, Operate::BlackAndWhite),
            "contrast" => img = img.adjust_contrast(value[0]),
            "brighten" => img = img.brighten(value[0] as i32),
            "huerotate" => img = img.huerotate(value[0] as i32),
            "thumbnail" => img = img.thumbnail(value[0] as u32, value[1] as u32),
            "unsharpen" => img = img.unsharpen(value[0], value[1] as i32),
            "mirror" => img = mirror(img, unsafe { transmute::<u8, Direction>(value[0] as u8) }),
            "gaussian" => img = gaussian_blur(img, value[0] as u32),
            "frost" => img = frost(img),
            "sketch" => img = sketch(img, value[0] as u32),
            _ => (),
        }
    }

    return transform_u8_to_vec(img);
}

#[wasm_bindgen]
pub fn sleep(time: u64) {
    thread::sleep(Duration::from_secs(time as u64));
}
