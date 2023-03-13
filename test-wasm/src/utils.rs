use std::fs::File;

use image::{
    codecs::hdr::rgbe8, DynamicImage, GenericImage, GenericImageView, GrayImage,RgbImage, ImageBuffer, Rgb,
    Rgba,
};
use js_sys::Math::random;
// pub struct Rgb(f32, f32, f32);
// pub struct Point(u32, u32);

pub enum Operate {
    Gray,
    BlackAndWhite,
    Inverse,
    Cartoon,
    Retro,
    Founding,
}

pub enum Direction {
    Horizontal = 1,
    Vertical,
    Corner,
}

/**
 * 拓展，看看opencv
 * png图片不支持f32的rgb色值，遇到这样的色值会解析失败
 * 三原色在各种显示器中的配比 1 : 1.5^2.2 : 0.6^2.2 ( 1 : 2.44 : 0.325 )
 */
pub fn handler_image(img: DynamicImage, operate: Operate) -> DynamicImage {
    let mut image_data = img.to_rgb8();

    for (x, y, pixels) in image_data.enumerate_pixels_mut() {
        match operate {
            Operate::Gray => {
                let Rgb([r, g, b]) = *pixels;
                let Rgb([_r, _g, _b]) = gray(Rgb([r as f32, g as f32, b as f32]));
                *pixels = Rgb([_r as u8, _g as u8, _b as u8]);
            }
            Operate::BlackAndWhite => {
                let Rgb([r, g, b]) = *pixels;
                let Rgb([_r, _g, _b]) = black_and_white(Rgb([r as f32, g as f32, b as f32]));
                *pixels = Rgb([_r as u8, _g as u8, _b as u8]);
            }
            Operate::Inverse => {
                let Rgb([r, g, b]) = *pixels;
                let Rgb([_r, _g, _b]) = inverse(Rgb([r as f32, g as f32, b as f32]));
                *pixels = Rgb([_r as u8, _g as u8, _b as u8]);
            }
            Operate::Cartoon => {
                let Rgb([r, g, b]) = *pixels;
                let Rgb([_r, _g, _b]) = cartoon(Rgb([r as f32, g as f32, b as f32]));
                *pixels = Rgb([_r as u8, _g as u8, _b as u8]);
            }
            Operate::Retro => {
                let Rgb([r, g, b]) = *pixels;
                let Rgb([_r, _g, _b]) = retro(Rgb([r as f32, g as f32, b as f32]));
                *pixels = Rgb([_r as u8, _g as u8, _b as u8]);
            }
            Operate::Founding => {
                let Rgb([r, g, b]) = *pixels;
                let Rgb([_r, _g, _b]) = founding(Rgb([r as f32, g as f32, b as f32]));
                *pixels = Rgb([_r as u8, _g as u8, _b as u8]);
            }
        }
    }

    return image::DynamicImage::from(image_data);
}

/**
 * 灰度算法，一共有三种
 * 0.3 * R + 0.59 * B + 0.11 * B
 * (r + g + b) / 3
 * max(r, g, b)
 */
pub fn gray(rgb: Rgb<f32>) -> Rgb<f32> {
    let data = rgb.0;
    let [r, g, b] = data;
    let v = 0.3 * r + 0.59 * g + 0.11 * b;
    Rgb([v, v, v])
}

/**
 * 黑白效果
 * avg(R + G + B) > 100 ? 255 : 0
 */
pub fn black_and_white(rgb: Rgb<f32>) -> Rgb<f32> {
    let data = rgb.0;
    let [r, g, b] = data;
    if ((r + g + b) / 3.0) > 100.0 {
        Rgb([255_f32, 255_f32, 255_f32])
    } else {
        Rgb([0_f32, 0_f32, 0_f32])
    }
}

/**
 * 反色效果
 * 255-R, 255-G, 255-B
 */
pub fn inverse(rgb: Rgb<f32>) -> Rgb<f32> {
    let data = rgb.0;
    let [r, g, b] = data;
    Rgb([255.0 - r, 255.0 - g, 255.0 - b])
}

/**
 * 卡通效果
 * r' = |2g - b + r| / 256
 * g' = |2b - g + r| / 256
 * b' = |2b - g + r| / 256
 */
pub fn cartoon(rgb: Rgb<f32>) -> Rgb<f32> {
    let data = rgb.0;
    let [r, g, b] = data;
    Rgb([
        (2.0 * g - b + r).abs() % 256.0,
        (2.0 * b - r + g).abs() % 256.0,
        (2.0 * r - g + b).abs() % 256.0,
    ])
}

/**
 * 怀旧效果
 * r' = 0.393 * r + 0.769 * g + 0.189 * b
 * g' = 0.349 * r + 0.686 * g + 0.168 * b
 * b' = 0.272 * r + 0.534 * g + 0.131 * b
 */
pub fn retro(rgb: Rgb<f32>) -> Rgb<f32> {
    let data = rgb.0;
    let [r, g, b] = data;
    Rgb([
        0.393 * r + 0.769 * g + 0.189 * b,
        0.349 * r + 0.686 * g + 0.168 * b,
        0.272 * r + 0.534 * g + 0.131 * b,
    ])
}

/**
 * 熔铸效果
 * r' = (r * 128)/(g + b + 1)
 * g' = (g * 128)/(r + b + 1)
 * b' = (b * 128)/(g + r + 1)
 */
pub fn founding(rgb: Rgb<f32>) -> Rgb<f32> {
    let data = rgb.0;
    let [r, g, b] = data;
    Rgb([
        (r * 128.0) / (g + b + 1.0),
        (g * 128.0) / (r + b + 1.0),
        (b * 128.0) / (g + r + 1.0),
    ])
}

/**
 * 镜像效果
 * 把图片上 Y 对称轴左边的每一个像素，转移到对称点 (x' = width - x) 即可。
 */
pub fn mirror(img: DynamicImage, direction: Direction) -> DynamicImage {
    let (width, height) = img.dimensions();
    let mut _img = img.clone();

    match direction {
        Direction::Horizontal => {
            for x in 0..width {
                for y in 0..height {
                    _img.put_pixel(x, y, img.get_pixel(width - 1 - x, y));
                }
            }
        }
        Direction::Vertical => {
            for x in 0..width {
                for y in 0..height {
                    _img.put_pixel(x, y, img.get_pixel(x, height - 1 - y));
                }
            }
        }
        Direction::Corner => {
            for x in 0..width {
                for y in 0..height {
                    _img.put_pixel(x, y, img.get_pixel(width - 1 - x, height - 1 - y));
                }
            }
        }
    }

    return _img;
}

/**
 * 浮雕效果
 * 按个扫描图像单元，分别用后一个图像单元的 R、G、B 减去前一个单元，得到的结果再进行灰度处理(不然会有色彩残留)，
 * 此算法原理就是相当于绘制 R、G、B 相差特别大的轮廓。
 */
// pub fn relief() {}

/**
 * 毛玻璃效果
 * 遍历每一个图像单元，然后取其附近的单元(如随机数取左右 1-8 个中任意一个)，
 * 将这个随机单元数据填充到原始单元中，就会造成一种毛毛糙糙的感觉。
 */
pub fn frost(img: DynamicImage) -> DynamicImage {
    let (width, height) = img.dimensions();
    let mut _img = img.clone();

    let mut delta = (random() * 8.0 + 1.0) as u32;

    for x in 10..width - 10 {
        for y in 10..height - 10 {
            _img.put_pixel(x, y, img.get_pixel(x + delta, y));
            delta = (random() * 8.0 + 1.0) as u32;
        }
    }

    return _img;
}

/**
 * 高斯模糊
 * 高斯模糊首先要确定模糊半径，原理就是让每个像素挨个去计算半径内其他像素的平均值，色彩平均了那就看起来是模糊的效果。
 * https://www.ruanyifeng.com/blog/2012/11/gaussian_blur.html
 */
pub fn gaussian_blur(img: DynamicImage, radius: u32) -> DynamicImage {
    let (width, height) = img.dimensions();
    let mut _img = img.clone();

    for x in 0..width {
        for y in 0..height {
            // let mut x_list = vec![];
            // let mut y_list = vec![];
            let mut R: u32 = 0;
            let mut G: u32 = 0;
            let mut B: u32 = 0;
            let mut A: u32 = 0;
            for r in 0..radius {
                let Rgba([r1, g1, b1, a1]) = img.get_pixel(
                    if x >= r { x - r } else { x + width - r },
                    if y >= r { y - r } else { y + height - r },
                );
                let Rgba([r2, g2, b2, a2]) =
                    img.get_pixel(if x >= r { x - r } else { x + width - r }, y);
                let Rgba([r3, g3, b3, a3]) =
                    img.get_pixel(if x + r >= width { x + r - width } else { x + r }, y);
                let Rgba([r4, g4, b4, a4]) =
                    img.get_pixel(if x >= r { x - r } else { x + width - r }, y);
                let Rgba([r5, g5, b5, a5]) =
                    img.get_pixel(if x + r >= width { x + r - width } else { x + r }, y);
                let Rgba([r6, g6, b6, a6]) = img.get_pixel(
                    if x >= r { x - r } else { x + width - r },
                    if y + r >= height {
                        y + r - height
                    } else {
                        y + r
                    },
                );
                let Rgba([r7, g7, b7, a7]) =
                    img.get_pixel(x, if y >= r { y - r } else { y + height - r });
                let Rgba([r8, g8, b8, a8]) = img.get_pixel(
                    if x + r >= width { x + r - width } else { x + r },
                    if y + r >= height {
                        y + r - height
                    } else {
                        y + r
                    },
                );
                let _r = r1 as u32
                    + r2 as u32
                    + r3 as u32
                    + r4 as u32
                    + r5 as u32
                    + r6 as u32
                    + r7 as u32
                    + r8 as u32;
                let _g = (g1 as u32
                    + g2 as u32
                    + g3 as u32
                    + g4 as u32
                    + g5 as u32
                    + g6 as u32
                    + g7 as u32
                    + g8 as u32);
                let _b = (b1 as u32
                    + b2 as u32
                    + b3 as u32
                    + b4 as u32
                    + b5 as u32
                    + b6 as u32
                    + b7 as u32
                    + b8 as u32);
                let _a = (a1 as u32
                    + a2 as u32
                    + a3 as u32
                    + a4 as u32
                    + a5 as u32
                    + a6 as u32
                    + a7 as u32
                    + a8 as u32);
                R += _r;
                G += _g;
                B += _b;
                A += _a;
            }
            let total = radius * 8;
            _img.put_pixel(
                x,
                y,
                Rgba([
                    (R / total) as u8,
                    (G / total) as u8,
                    (B / total) as u8,
                    (A / total) as u8,
                ]),
            );
        }
    }

    return _img;
}

/**
 * 素描效果
 * 这里需要两个图层，A 图层是原图经过一次灰度效果后形成。
 * 然后拷贝 A 图层，应用反色处理生成 B 图层，再对 B 图层应用高斯模糊。A、B 图层合并的时候，分别对 R、G、B 采用如下公式计算。
 * v= a.v + (a.v ∗ b.v)/(255 − b.v)
 */
pub fn sketch(img: DynamicImage, radius: u32) -> DynamicImage {
    let (width, height) = img.dimensions();
    let mut _img1 = img.clone();
    let mut _img = img.clone();

    // _img1灰度生成A图层
    _img1 = handler_image(img, Operate::Gray);

    // 拷贝A图层
    let mut _img2 = _img1.clone();
    // 反色处理
    _img2 = handler_image(_img2, Operate::Inverse);
    // 高斯模糊
    _img2 = gaussian_blur(_img2, radius);
    // 合并图层
    for x in 0..width {
        for y in 0..height {
            // a为通道，没有透明度就是255，取值范围是0-255，跟css的透明度有区别
            let Rgba([r1, g1, b1, a1]) = _img1.get_pixel(x, y);
            let Rgba([r2, g2, b2, a2]) = _img2.get_pixel(x, y);
            let r: u32 = r1 as u32 + r1 as u32 / (256 - r2 as u32) * r2 as u32;
            let g: u32 = g1 as u32 + g1 as u32 / (256 - g2 as u32) * g2 as u32;
            let b: u32 = b1 as u32 + b1 as u32 / (256 - b2 as u32) * b2 as u32;
            // let a: u32 = a1 as u32 + a1 as u32 / (256 - a2 as u32) * a2 as u32;
            _img.put_pixel(
                x,
                y,
                Rgba([(r % 256) as u8, (g % 256) as u8, (b % 256) as u8, 255]),
            );
        }
    }

    return _img;
}

/**
 * 计算二值化的阈值，采用otsu算法，获取最大方差时的阈值
 */
pub fn get_threshold(img: DynamicImage) -> u8 {
    let (width, height) = img.dimensions();
    let mut max: f32 = 0.0;
    let mut rgb: usize = 0;
    let mut arr: [usize; 256] = [0; 256];
    for x in 0..width {
        for y in 0..height {
            let r = img.get_pixel(x, y).0[0] as usize;
            arr[r] = arr[r] + 1;
        }
    }
    for _c in 0..=255 as usize {
        // 阈值以下的像素个数
        let mut n = 0;
        // 阈值以下的像素总数
        let mut n_r = 0;
        // 阈值及以上的像素个数
        let mut m = 0;
        // 阈值及以上的像素总数
        let mut m_r = 0;
        for (index, c) in arr.iter().enumerate() {
            if _c < index {
                n += c;
                n_r += index * (*c as usize);
            } else {
                m += c;
                m_r += index * (*c as usize);
            }
        }
        let u0 = if n == 0 {
            0
        } else {
            n_r / n as usize
        };
        let u1 = if m == 0 {
            0
        } else {
            m_r / m as usize
        };
        let u = if u0 > u1 {
            u0 - u1
        } else {
            u1 - u0
        };
        let w0 = n as f32 / (width * height) as f32;
        let w1 = m as f32 / (width * height) as f32;
        let maxinum: f32 = w0 * w1 * u.pow(2) as f32;
        if max < maxinum {
            max = maxinum;
            rgb = _c;
        }
    }
    rgb as u8
}

/**
 * sobel边缘检测
 * [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]] Gx
 * [[1, 2, 1], [0, 0, 0], [-1, -2, -1]] Gy
 * <0 = 0    >255 = 255
 */
pub fn sobel_edge_detection(img: DynamicImage) -> DynamicImage {
    let (width, height) = img.dimensions();
    let mut _img = img.clone();
    let threshold = get_threshold(img.clone()) as u32;
    for x in 1..width-1 {
        for y in 1..height-1 {
            // 水平方向的梯度
            let c1 = img.get_pixel(x + 1, y - 1).0[0] as u32;
            let c2 = img.get_pixel(x + 1, y).0[0] as u32 * 2;
            let c3 = img.get_pixel(x + 1, y + 1).0[0] as u32;
            let c4 = img.get_pixel(x - 1, y - 1).0[0] as u32;
            let c5 = img.get_pixel(x - 1, y).0[0] as u32 * 2;
            let c6 = img.get_pixel(x - 1, y + 1).0[0] as u32;

            let mut Gx = 0;
            if (c1 + c2 + c3 < c4 + c5 + c6) {
                Gx = 0;
            } else if (c1 + c2 + c3 > c4 + c5 + c6 + 255) {
                Gx = 255;
            } else {
                Gx = c1 + c2 + c3 - c4 - c5 - c6;
            }
        
            // 垂直方向上的梯度
            let c1 = img.get_pixel(x - 1, y - 1).0[0] as u32;
            let c2 = img.get_pixel(x, y - 1).0[0] as u32 * 2;
            let c3 = img.get_pixel(x + 1, y - 1).0[0] as u32;
            let c4 = img.get_pixel(x - 1, y + 1).0[0] as u32;
            let c5 = img.get_pixel(x, y + 1).0[0] as u32 * 2;
            let c6 = img.get_pixel(x + 1, y + 1).0[0] as u32;

            let mut Gy = 0;
            if (c1 + c2 + c3 < c4 + c5 + c6) {
                Gy = 0;
            } else if (c1 + c2 + c3 > c4 + c5 + c6 + 255) {
                Gy = 255;
            } else {
                Gy = c1 + c2 + c3 - c4 - c5 - c6;
            }

            let mut s = Gx + Gy;

            // 目前的阈值，可以使用Otsu 算法(大津算法)等来确定阈值
            if s < threshold {
                s = 0;
            } else {
                s = 255;
            }
            
            let c = s as u8;
            _img.put_pixel(x, y, Rgba([c, c, c, 255]));
        }
    }

    _img
}


fn get_rgb(color: u8) -> u8 {
    if color < 64 {
        32
    } else if color < 128 {
        96
    } else if color < 192 {
        160
    } else {
        224
    }
}

pub fn color_for_image(img: DynamicImage, origin_img: DynamicImage) -> DynamicImage {
    let mut _img = origin_img.clone();
    let (width, height) = img.dimensions();
    for x in 0..width {
        for y in 0..height {
            let c = img.get_pixel(x, y).0[0];
            let Rgba([r1, g1, b1, a1]) = origin_img.get_pixel(x, y);
            let mut color = Rgba([255, 255, 255, 255]);
            if c == 0 {
                // 背景，进行背景的色彩量化
                color = Rgba([get_rgb(r1), get_rgb(g1), get_rgb(b1), 255]);
            } else {
                color = Rgba([r1, g1, b1, a1]);
            }
            _img.put_pixel(x, y, color);
        } 
    }
    _img
}

/**
 * 真正的卡通图片
 * 1. 先进行灰度处理
 * 2. 边缘检测
 * 3. 二值化
 * 4. 色彩量化
 * 5. 颜色填充
 */
pub fn cartoonize(img: DynamicImage) -> DynamicImage {
    let origin_img = img.clone();
    // 先生成灰度图片
    let img = handler_image(img, Operate::Gray);
    // 再进行边缘检测，绘制出其边缘轮廓
    let img = sobel_edge_detection(img);
    // 根据边缘化的图片进行背景的色彩量化，减少图片色值，并且填充边缘
    let img = color_for_image(img, origin_img);
    img
}