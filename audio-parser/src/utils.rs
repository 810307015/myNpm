use std::{fs, convert::TryInto, str::Bytes};

use wasm_bindgen::convert::IntoWasmAbi;

#[derive(Debug)]
pub struct AudioData {
    // 头部帧包括ID3头、版本号、副版本号、标志字节、剩余标签帧大小
    header: String, // ID3头
    version: u8, // 版本号
    revision: u8, // 副版本号
    flag: u8, // 标志字节
    size: usize, // 标签除头部帧剩余的大小
    labels: Vec<Label>, // 所有的标签帧
    frame_header: FrameHeader, // 数据帧的帧头
    // data: Vec<u8>, // 数据帧
}

#[derive(Debug)]
pub struct Label {
    header: String,
    size: usize,
    flag: Vec<u8>,
    content: Vec<u8>
}

#[derive(Debug)]
pub struct FrameHeader {
    sync: Vec<u8>,
    version_value: Vec<u8>,
    version_label: String,
    layer_label: String,
    layer_value: Vec<u8>,
    crc_label: String,
    crc_value: u8,
    bit_rate_label: usize,
    bit_rate_value: Vec<u8>,
    sampling_frequency_label: usize,
    sampling_frequency_value: Vec<u8>,
    adjust_flag: u8,
    reverse: u8,
    mode_value: Vec<u8>,
    mode_label: String,
    extend_mode_label: String,
    extend_mode_value: Vec<u8>,
    copyright_label: String,
    copyright_value: u8,
    original_label: String,
    original_value: u8,
    emphasis_label: String,
    emphasis_value: Vec<u8>
}

pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

pub fn read_file(path: String) -> Vec<u8> {
    fs::read(path).unwrap()
}

pub fn write_file(data: Vec<u8>, fileName: String) -> std::io::Result<()> {
    fs::write(fileName, data)?;
    Ok(())
}

pub fn transfer_u8_to_binary_str (num: u8) -> Vec<u8> {
    let mut _num = num;
    let mut list = vec![];
    while _num > 0 {
        let i = _num % 2;
        list.insert(0, i);
        _num = _num / 2;
    }
    let rest = 8 - list.len(); // 不够的补0
    for _ in 0..rest {
        list.insert(0, 0);
    }

    list
}

pub fn get_bit_rate_label(bit_rate_value: Vec<u8>, version_value: Vec<u8>, layer_value: Vec<u8>) -> usize {
    match format!("{:?}", bit_rate_value).as_str() {
        "[0, 0, 0, 0]" => 0, // free(位率可变)
        "[0, 0, 0, 1]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" | "[1, 0]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 8000, // 8(8)
                        "[1, 0]" => 32000, // 32(8)
                        "[1, 1]" => 32000, // 32(32)
                        _ => 0
                    }
                },
                "[1, 1]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" | "[1, 0]" | "[1, 1]" => 32, // 32
                        _ => 0
                    }
                },
                _ => 0
            }
        },
        "[0, 0, 1, 0]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" | "[1, 0]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 16000, // 16(16)
                        "[1, 0]" => 48000, // 48(16)
                        "[1, 1]" => 64000, // 64(48)
                        _ => 0
                    }
                },
                "[1, 1]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 40000, // 40
                        "[1, 0]" => 48000, // 48
                        "[1, 1]" => 64000, // 64
                        _ => 0
                    }
                },
                _ => 0
            }
        },
        "[0, 0, 1, 1]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" | "[1, 0]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 24000, // 24(24)
                        "[1, 0]" => 56000, // 56(24)
                        "[1, 1]" => 90000, // 96(56)
                        _ => 0
                    }
                },
                "[1, 1]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 48000, // 48
                        "[1, 0]" => 56000, // 56
                        "[1, 1]" => 96000, // 96
                        _ => 0
                    }
                },
                _ => 0
            }
        },
        "[0, 1, 0, 0]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" | "[1, 0]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 32000, // 32(32)
                        "[1, 0]" => 64000, // 64(32)
                        "[1, 1]" => 128000, // 128(64)
                        _ => 0
                    }
                },
                "[1, 1]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 56000, // 56
                        "[1, 0]" => 64000, // 64
                        "[1, 1]" => 128000, // 128
                        _ => 0
                    }
                },
                _ => 0
            }
        },
        "[0, 1, 0, 1]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" | "[1, 0]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 64000, // 64(40)
                        "[1, 0]" => 80000, // 80(40)
                        "[1, 1]" => 160000, // 160(80)
                        _ => 0
                    }
                },
                "[1, 1]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 64000, // 64
                        "[1, 0]" => 80000, // 80
                        "[1, 1]" => 160000, // 160
                        _ => 0
                    }
                },
                _ => 0
            }
        },
        "[0, 1, 1, 0]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" | "[1, 0]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 80000, // 80(48)
                        "[1, 0]" => 96000, // 96(48)
                        "[1, 1]" => 192000, // 192(96)
                        _ => 0
                    }
                },
                "[1, 1]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 80000, // 80
                        "[1, 0]" => 96000, // 96
                        "[1, 1]" => 192000, // 192
                        _ => 0
                    }
                },
                _ => 0
            }
        },
        "[0, 1, 1, 1]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" | "[1, 0]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 56000, // 56(56)
                        "[1, 0]" => 112000, // 112(56)
                        "[1, 1]" => 224000, // 224(112)
                        _ => 0
                    }
                },
                "[1, 1]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 96000, // 96
                        "[1, 0]" => 112000, // 112
                        "[1, 1]" => 224000, // 224
                        _ => 0
                    }
                },
                _ => 0
            }
        },
        "[1, 0, 0, 0]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" | "[1, 0]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 64000, // 64(64)
                        "[1, 0]" => 128000, // 128(64)
                        "[1, 1]" => 256000, // 256(128)
                        _ => 0
                    }
                },
                "[1, 1]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 112000, // 112
                        "[1, 0]" => 128000, // 128
                        "[1, 1]" => 256000, // 256
                        _ => 0
                    }
                },
                _ => 0
            }
        },
        "[1, 0, 0, 1]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" | "[1, 0]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 128000, // 128(80)
                        "[1, 0]" => 160000, // 160(80)
                        "[1, 1]" => 288000, // 288(144)
                        _ => 0
                    }
                },
                "[1, 1]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 128000, // 128
                        "[1, 0]" => 160000, // 160
                        "[1, 1]" => 288000, // 288
                        _ => 0
                    }
                },
                _ => 0
            }
        },
        "[1, 0, 1, 0]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" | "[1, 0]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 160000, // 160(96)
                        "[1, 0]" => 192000, // 192(96)
                        "[1, 1]" => 320000, // 320(160)
                        _ => 0
                    }
                },
                "[1, 1]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 160000, // 160
                        "[1, 0]" => 192000, // 192
                        "[1, 1]" => 320000, // 320
                        _ => 0
                    }
                },
                _ => 0
            }
        },
        "[1, 0, 1, 1]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" | "[1, 0]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 112000, // 112(112)
                        "[1, 0]" => 224000, // 224(112)
                        "[1, 1]" => 352000, // 352(176)
                        _ => 0
                    }
                },
                "[1, 1]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 192000, // 192
                        "[1, 0]" => 224000, // 224
                        "[1, 1]" => 352000, // 352
                        _ => 0
                    }
                },
                _ => 0
            }
        },
        "[1, 1, 0, 0]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" | "[1, 0]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 128000, // 128(128)
                        "[1, 0]" => 256000, // 256(128)
                        "[1, 1]" => 384000, // 384(192)
                        _ => 0
                    }
                },
                "[1, 1]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 224000, // 224
                        "[1, 0]" => 256000, // 256
                        "[1, 1]" => 384000, // 384
                        _ => 0
                    }
                },
                _ => 0
            }
        },
        "[1, 1, 0, 1]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" | "[1, 0]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 256000, // 256(144)
                        "[1, 0]" => 320000, // 320(144)
                        "[1, 1]" => 416000, // 416(224)
                        _ => 0
                    }
                },
                "[1, 1]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 256000, // 256
                        "[1, 0]" => 320000, // 320
                        "[1, 1]" => 416000, // 416
                        _ => 0
                    }
                },
                _ => 0
            }
        },
        "[1, 1, 1, 0]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" | "[1, 0]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 320000, // 320(160)
                        "[1, 0]" => 384000, // 384(160)
                        "[1, 1]" => 448000, // 448(256)
                        _ => 0
                    }
                },
                "[1, 1]" => {
                    match format!("{:?}", layer_value).as_str() {
                        "[0, 1]" => 320000, // 320
                        "[1, 0]" => 384000, // 384
                        "[1, 1]" => 448000, // 448
                        _ => 0
                    }
                },
                _ => 0
            }
        },
        "[1, 1, 1, 1]" => 0, // bad(不允许值)
        _ => 0
    }
}

pub fn parse_frame_header (data: Vec<u8>) -> FrameHeader {
    let mut binary_list = vec![];
    for item in data {
        let list = transfer_u8_to_binary_str(item);
        binary_list = [binary_list, list].concat();
    }
    // 同步信息 11位，所有位均为1，第一字节恒为FF
    let sync = binary_list[0..11].to_vec();
    // 版本 2位 00-MPEG2.5 01-未定义 10-MPEG2 11-MPEG 1
    let version_value = binary_list[11..13].to_vec();
    let version_label = match format!("{:?}", version_value).as_str() {
        "[0, 0]" => String::from("MPEG2.5"),
        "[0, 1]" => String::from("未定义"),
        "[1, 0]" => String::from("MPEG 2"),
        "[1, 1]" => String::from("MPEG 1"),
        _ => String::from("未知")
    };
    // // 层，2位
    let layer_value = binary_list[13..15].to_vec();
    let layer_label = match format!("{:?}", layer_value).as_str() {
        "[0, 0]" => String::from("未定义"),
        "[0, 1]" => String::from("Layer 3"),
        "[1, 0]" => String::from("Layer 2"),
        "[1, 1]" => String::from("Layer 1"),
        _ => String::from("未知")
    };
    // // CRC校验，1位
    let crc_value = binary_list[15];
    let crc_label = if crc_value == 1 {
        String::from("不校检")
    } else {
        String::from("校检")
    };
    // // 位率，4位
    let bit_rate_value = binary_list[16..20].to_vec();
    let bit_rate_label = get_bit_rate_label(bit_rate_value.clone(), version_value.clone(), layer_value.clone());
    // 采样频率， 2位
    let sampling_frequency_value = binary_list[20..22].to_vec();
    let sampling_frequency_label = match format!("{:?}", layer_value).as_str() {
        "[0, 0]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" => 11025, // 11.025khz
                "[1, 0]" => 22050, // 22.05khz
                "[1, 1]" => 44100, // 44.1khz
                _ => 0
            }
        },
        "[0, 1]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" => 12000, // 12khz
                "[1, 0]" => 24000, // 24khz
                "[1, 1]" => 48000, // 48khz
                _ => 0
            }
        },
        "[1, 0]" => {
            match format!("{:?}", version_value).as_str() {
                "[0, 0]" => 8000, // 8khz
                "[1, 0]" => 16000, // 16khz
                "[1, 1]" => 32000, // 32khz
                _ => 0
            }
        },
        _ => 0
    };
    // 帧长调节，1位，0 无需调整， 1调整
    let adjust_flag = binary_list[22];
    // 保留字，1位
    let reverse = binary_list[23];
    // 声道模式，2位，00-立体声stereo 01-Joint Stereo 10-双声道 11-单声道
    let mode_value = binary_list[24..26].to_vec();
    let mode_label = match format!("{:?}", mode_value).as_str() {
        "[0, 0]" => String::from("立体声Stereo"),
        "[0, 1]" => String::from("Joint Stereo"),
        "[1, 0]" => String::from("双声道"),
        "[1, 1]" => String::from("单声道"),
        _ => String::from("未知")
    };
    // 扩充模式，当声道模式为01时使用，2位
    let extend_mode_value = binary_list[26..28].to_vec();
    let extend_mode_label = match format!("{:?}", extend_mode_value).as_str() {
        "[0, 0]" => String::from("强度立体声-off，MS立体声-off"),
        "[0, 1]" => String::from("强度立体声-on，MS立体声-off"),
        "[1, 0]" => String::from("强度立体声-off，MS立体声-on"),
        "[1, 1]" => String::from("强度立体声-on，MS立体声-on"),
        _ => String::from("未知")
    };
    // 版权，1位
    let copyright_value = binary_list[28];
    let copyright_label = if copyright_value == 1 {
        String::from("合法")
    } else {
        String::from("不合法")
    };
    // 原版标志，1位
    let original_value = binary_list[29];
    let original_label = if original_value == 1 {
        String::from("原版")
    } else {
        String::from("非原版")
    };
    // 强调方式，2位
    let emphasis_value = binary_list[30..32].to_vec();
    let emphasis_label = match format!("{:?}", extend_mode_value).as_str() {
        "[0, 1]" => String::from("50/15ms"),
        "[1, 0]" => String::from("保留"),
        "[1, 1]" => String::from("C CIT T J.17"),
        _ => String::from("未知")
    };
    FrameHeader{
        sync,
        version_value,
        version_label,
        layer_label,
        layer_value,
        crc_label,
        crc_value,
        bit_rate_label,
        bit_rate_value,
        sampling_frequency_label,
        sampling_frequency_value,
        adjust_flag,
        reverse,
        mode_value,
        mode_label,
        extend_mode_label,
        extend_mode_value,
        copyright_label,
        copyright_value,
        original_label,
        original_value,
        emphasis_label,
        emphasis_value
    }
}

/**
 * 计算公式
 * Layer 1：Len(字节) = ((每帧采样数/8*比特率)/采样频率)+填充*4
 * Layer2/3：Len(字节) = ((每帧采样数/8*比特率)/采样频率)+填充
 */
pub fn get_frame_len(frame_header: &FrameHeader) -> usize {
    // 每帧采样数
    let frame_len: usize = match format!("{:?}", frame_header.version_value).as_str() {
        // MPEG 2.5 | MPEG 2
        "[0, 0]" | "[1, 0]" => {
            match format!("{:?}", frame_header.layer_value).as_str() {
                // layer 3
                "[0, 1]" => 576,
                // layer 2
                "[1, 0]" => 1152,
                // layer 1
                "[1, 1]" => 384,
                _ => 0
            }
        },
        // MPEG 1
        "[1, 1]" => {
            match format!("{:?}", frame_header.layer_value).as_str() {
                // layer 3
                "[0, 1]" => 1152,
                // layer 2
                "[1, 0]" => 1152,
                // layer 1
                "[1, 1]" => 384,
                _ => 0
            }
        },
        _ => 0
    };
    
    // 帧长度
    let total_len: usize = match format!("{:?}", frame_header.layer_value).as_str() {
        // layer 3 | layer 2
        "[0, 1]" | "[1, 0]" => (frame_len / 8 * frame_header.bit_rate_label) / frame_header.sampling_frequency_label + frame_header.adjust_flag as usize,
        // layer 1
        "[1, 1]" => (frame_len / 8 * frame_header.bit_rate_label) / frame_header.sampling_frequency_label + frame_header.adjust_flag as usize * 4,
        _ => 0
    };

    total_len
}

pub fn translate(data: Vec<u8>) -> AudioData {
    let mut cur = 0;
    // 获取ID3帧
    let header = String::from_utf8_lossy(&data[cur..cur+3]).to_string();
    cur += 3;
    // 获取版本号
    let version = data[cur];
    cur += 1;
    // 获取副版本号
    let revision = data[cur];
    cur += 1;
    // 标志字节
    let flag = data[cur];
    cur += 1;
    // 标签大小
    let size = (data[cur] & 127) as usize * 2097152 + (data[cur + 1] & 127) as usize * 1024 + (data[cur + 2] & 127) as usize * 128 + (data[cur + 3] & 127) as usize;
    cur += 4;
    let mut labels = vec![];
    while cur < size + 10 {
         // 标识帧
         let header = String::from_utf8_lossy(&data[cur..cur+4]).to_string();
         let size = data[cur + 4] as usize * 2097152 + data[cur + 5] as usize * 1024 + data[cur + 6] as usize * 128 + data[cur + 7] as usize;
         let flag = (&data[cur+8..cur+10]).to_vec();
         let content = (&data[cur+10..cur+10+size]).to_vec();
         println!("{}, {:#?}", header, String::from_utf8_lossy(&content[0..content.len()]));
         labels.push(Label {
            header,
            size,
            flag,
            content
         });
         cur += size + 10;
    }
    // 数据帧帧头
    let frame_header_data = (&data[cur..cur+4]).to_vec();
    let frame_header = parse_frame_header(frame_header_data);
    cur += 4;
    let frame_len = get_frame_len(&frame_header);
    let frame_duration = frame_header.sampling_frequency_label * 1000 / frame_header.bit_rate_label; // 帧持续时间 单位ms
    println!("帧长{}", frame_len);
    println!("帧持续时间{}", frame_duration);
    let data = (&data[cur..data.len()]).to_vec();
    AudioData { 
        header,
        version,
        revision,
        flag,
        size,
        labels,
        frame_header,
        // data
    }
}