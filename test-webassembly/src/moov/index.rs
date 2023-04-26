use std::fmt;

use super::vec_to_number;

#[derive(Debug)]
pub struct MoovHeader {
    pub box_size: Vec<u8>, // 4 
    pub box_type: Vec<u8>, // 4
    pub large_size: Vec<u8>, // size == 1 时存在，8位
}
impl MoovHeader {
    pub fn get_box_size(&self) -> usize {
        vec_to_number(self.box_size.clone())
    }

    pub fn get_box_type(&self) -> String {
        String::from_utf8_lossy(&self.box_type).to_string()
    }

    pub fn get_large_size(&self) -> usize {
        vec_to_number(self.large_size.clone())
    }
}

impl fmt::Display for MoovHeader {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "box_size = {}, box_type = {}, large_size = {}", self.get_box_size(), self.get_box_type(), self.get_large_size())
    }
}

#[derive(Debug)]
pub struct MvhdBox {
    pub box_size: Vec<u8>, // 4 
    pub box_type: Vec<u8>, // 4
    pub large_size: Vec<u8>, // size == 1 时存在，8位
    pub version: Vec<u8>, // 1 版本，0或1，一般为0
    pub flags: Vec<u8>, // 3 
    pub create_time: Vec<u8>, // 创建时间，相当于UTC时间1904--01-01零点的秒数，version == 1 ? 8 : 4; 
    pub modification_time: Vec<u8>, // 修改时间, version == 1 ? 8 : 4; 
    pub time_scale: Vec<u8>, // 4 时间缩放因子
    pub duration: Vec<u8>, // 4 视频的时长, version == 1 ? 8 : 4; 
    pub rate: Vec<u8>, // 4 推荐播放速率，高16位和低16位分别为小数点的证书部分和小数部分，即[16.16]格式，该值为1.0(0x00010000)表示正常前向播放
    pub volume: Vec<u8>, // 2 与rate类似，[8.8]格式，1.0(0x0100)表示最大音量
    pub reserved: Vec<u8>, // 10 保留位
    pub matrix: Vec<u8>, // 36 视频变换矩阵
    pub pre_defined: Vec<u8>, // 24
    pub next_track_id: Vec<u8>, // 4 下一个track使用的id号
}

impl MvhdBox {
    pub fn get_box_size(&self) -> usize {
        vec_to_number(self.box_size.clone())
    }

    pub fn get_box_type(&self) -> String {
        String::from_utf8_lossy(&self.box_type).to_string()
    }

    pub fn get_version(&self) -> usize {
        vec_to_number(self.version.clone())
    }

    pub fn get_large_size(&self) -> usize {
        vec_to_number(self.large_size.clone())
    }

    pub fn get_flags(&self) -> usize {
        vec_to_number(self.flags.clone())
    }

    pub fn get_create_time(&self) -> usize {
        vec_to_number(self.create_time.clone())
    }

    pub fn get_modification_time(&self) -> usize {
        vec_to_number(self.modification_time.clone())
    }

    pub fn get_time_scale(&self) -> usize {
        vec_to_number(self.time_scale.clone())
    }

    pub fn get_duration(&self) -> usize {
        vec_to_number(self.duration.clone())
    }

    pub fn get_rate(&self) -> String {
        format!("{}.{}", vec_to_number((&self.rate[0..2]).to_vec()), vec_to_number((&self.rate[2..4]).to_vec()))
    }

    pub fn get_volume(&self) -> String {
        format!("{}.{}", vec_to_number((&self.volume[0..1]).to_vec()), vec_to_number((&self.volume[1..2]).to_vec()))
    }

    pub fn get_next_track_id(&self) -> usize {
        vec_to_number(self.next_track_id.clone())
    }
}

impl fmt::Display for MvhdBox {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, 
            "box_size = {},\nbox_type = {},\nversion = {},\nlarge_size = {},\nflags = {},\ncreate_time = {},\nmodification_time = {},\ntime_scale = {},\nduration = {},\nrate = {},\nvolume = {},\nnext_track_id = {},\n", self.get_box_size(), self.get_box_type(), self.get_version(),self.get_large_size(), self.get_flags(),self.get_create_time(),self.get_modification_time(),self.get_time_scale(),self.get_duration(), self.get_rate(), self.get_volume(),self.get_next_track_id()
        )
    }
}


#[derive(Debug,Clone)]
pub struct TrackBox {
    pub box_size: Vec<u8>, // 4 
    pub box_type: Vec<u8>, // 4
    pub large_size: Vec<u8>, // size == 1 时存在，8位
    pub tkhd: TkhdBox, // 单个track的meta信息，包含时长、音量、宽高等
}

impl TrackBox {
    pub fn get_box_size(&self) -> usize {
        vec_to_number(self.box_size.clone())
    }

    pub fn get_box_type(&self) -> String {
        String::from_utf8_lossy(&self.box_type).to_string()
    }

    pub fn get_large_size(&self) -> usize {
        vec_to_number(self.large_size.clone())
    }
}

impl fmt::Display for TrackBox {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "box_size = {}, box_type = {},\n tkhd = {}", self.get_box_size(), self.get_box_type(), self.tkhd)
    }
}

// Track header box
#[derive(Debug,Clone)]
pub struct TkhdBox {
    pub box_size: Vec<u8>, // 4 
    pub box_type: Vec<u8>, // 4
    pub large_size: Vec<u8>, // size == 1 时存在，8位
    pub version: Vec<u8>, // 1 版本，0或1，一般为0
    pub flags: Vec<u8>, // 3 
    pub create_time: Vec<u8>, // 创建时间，相当于UTC时间1904--01-01零点的秒数，version == 1 ? 8 : 4; 
    pub modification_time: Vec<u8>, // 修改时间, version == 1 ? 8 : 4; 
    pub track_id: Vec<u8>, // 4 id号，不能重复，不能为0
    pub reserved_1: Vec<u8>, // 4 保留位
    pub duration: Vec<u8>, // 4 视频的时长, version == 1 ? 8 : 4; 
    pub reserved_2: Vec<u8>, // 8 保留位
    pub layer: Vec<u8>, // 2 视频层，默认为0
    pub alternate_group: Vec<u8>, // 2 track分组信息，默认为0表示该track与其他track有群组关系
    pub volume: Vec<u8>, // 2 [8.8]格式，如果音频为track，1.0表示最大音量，否则为0
    pub reserved_3: Vec<u8>, // 2 保留位
    pub matrix: Vec<u8>, // 36 视频变换矩阵
    pub width: Vec<u8>, // 4 视频的宽
    pub height: Vec<u8>, // 4 视频的高
}

impl TkhdBox {
    pub fn get_box_size(&self) -> usize {
        vec_to_number(self.box_size.clone())
    }

    pub fn get_box_type(&self) -> String {
        String::from_utf8_lossy(&self.box_type).to_string()
    }

    pub fn get_large_size(&self) -> usize {
        vec_to_number(self.large_size.clone())
    }

    pub fn get_version(&self) -> usize {
        vec_to_number(self.version.clone())
    }

    pub fn get_flags(&self) -> usize {
        vec_to_number(self.flags.clone())
    }

    pub fn get_create_time(&self) -> usize {
        vec_to_number(self.create_time.clone())
    }

    pub fn get_modification_time(&self) -> usize {
        vec_to_number(self.modification_time.clone())
    }

    pub fn get_track_id(&self) -> usize {
        vec_to_number(self.track_id.clone())
    }

    pub fn get_duration(&self) -> usize {
        vec_to_number(self.duration.clone())
    }

    pub fn get_layer(&self) -> usize {
        vec_to_number(self.layer.clone())
    }

    pub fn get_alternate_group(&self) -> usize {
        vec_to_number(self.alternate_group.clone())
    }

    pub fn get_volume(&self) -> String {
        format!("{}.{}", vec_to_number((&self.volume[0..1]).to_vec()), vec_to_number((&self.volume[1..2]).to_vec()))
    }

    pub fn get_width(&self) -> usize {
        vec_to_number(self.width.clone())
    }

    pub fn get_height(&self) -> usize {
        vec_to_number(self.height.clone())
    }
}

impl fmt::Display for TkhdBox {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, 
            "box_size = {},\n
            box_type = {},\n
            version = {},\n
            flags = {},\n
            create_time = {},\n
            modification_time = {},\n
            track_id = {},\n
            duration = {},\n
            layer = {},\n
            alternate_group = {},\n
            volume = {},\n
            width = {},\n
            height = {},\n", 
            self.get_box_size(),
            self.get_box_type(),
            self.get_version(),
            self.get_flags(),
            self.get_create_time(),
            self.get_modification_time(),
            self.get_track_id(),
            self.get_duration(),
            self.get_layer(),
            self.get_alternate_group(),
            self.get_volume(),
            self.get_width(),
            self.get_height(),
        )
    }
}

pub fn read_mvhd(data: &Vec<u8>, offset: usize) -> MvhdBox {
    let mut pos = offset;
    let box_size = (&data[pos..pos+4]).to_vec();
    pos += 4;
    let box_type = (&data[pos..pos+4]).to_vec();
    pos += 4;
    let size = vec_to_number(box_size.clone());
    let step = if size == 1 {
        8
    } else {
        0
    };
    let large_size = (&data[pos..pos+step]).to_vec();
    pos += step;
    let version = (&data[pos..pos+1]).to_vec();
    pos += 1;
    let flags = (&data[pos..pos+3]).to_vec();
    pos += 3;
    let version_number = vec_to_number(version.clone());
    let step: usize = if version_number == 1 {
        8
    } else {
        4
    };
    let create_time = (&data[pos..pos+step]).to_vec();
    pos += step;
    let modification_time = (&data[pos..pos+step]).to_vec();
    pos += step;
    let time_scale = (&data[pos..pos+4]).to_vec();
    pos += 4;
    let duration = (&data[pos..pos+step]).to_vec();
    pos += step;
    let rate = (&data[pos..pos+4]).to_vec();
    pos += 4;
    let volume = (&data[pos..pos+2]).to_vec();
    pos += 2;
    let reserved = (&data[pos..pos+10]).to_vec();
    pos += 10;
    let matrix = (&data[pos..pos+36]).to_vec();
    pos += 36;
    let pre_defined = (&data[pos..pos+24]).to_vec();
    pos += 24;
    let next_track_id = (&data[pos..pos+4]).to_vec();
    pos += 4;

    MvhdBox {
        box_size,
        box_type,
        large_size,
        version,
        flags,
        create_time,
        modification_time,
        time_scale,
        duration,
        rate,
        volume,
        reserved,
        matrix,
        pre_defined,
        next_track_id,
    }
}

pub fn read_tkhd(data: &Vec<u8>, offset: usize) -> TkhdBox {
    let mut pos = offset;
    let box_size = (&data[pos..pos+4]).to_vec();
    pos += 4;
    let box_type = (&data[pos..pos+4]).to_vec();
    pos += 4;
    let size = vec_to_number(box_size.clone());
    let step = if size == 1 {
        8
    } else {
        0
    };
    let large_size = (&data[pos..pos+step]).to_vec();
    pos += step;
    let version = (&data[pos..pos+1]).to_vec();
    pos += 1;
    let flags = (&data[pos..pos+3]).to_vec();
    pos += 3;
    let version_number = vec_to_number(version.clone());
    let step: usize = if version_number == 1 {
        8
    } else {
        4
    };
    let create_time = (&data[pos..pos+step]).to_vec();
    pos += step;
    let modification_time = (&data[pos..pos+step]).to_vec();
    pos += step;
    let track_id = (&data[pos..pos+4]).to_vec();
    pos += 4;
    let reserved_1 = (&data[pos..pos+4]).to_vec();
    pos += 4;
    let duration = (&data[pos..pos+step]).to_vec();
    pos += step;
    let reserved_2 = (&data[pos..pos+8]).to_vec();
    pos += 8;
    let layer = (&data[pos..pos+2]).to_vec();
    pos += 2;
    let alternate_group = (&data[pos..pos+2]).to_vec();
    pos += 2;
    let volume = (&data[pos..pos+2]).to_vec();
    pos += 2;
    let reserved_3 = (&data[pos..pos+2]).to_vec();
    pos += 2;
    let matrix = (&data[pos..pos+36]).to_vec();
    pos += 36;
    let width = (&data[pos..pos+4]).to_vec();
    pos += 4;
    let height = (&data[pos..pos+4]).to_vec();
    pos += 4;

    TkhdBox {
        box_size,
        box_type,
        large_size,
        version,
        flags,
        create_time,
        modification_time,
        track_id,
        reserved_1,
        duration,
        reserved_2,
        layer,
        alternate_group,
        volume,
        reserved_3,
        matrix,
        width,
        height,
    }
}

pub fn read_track(data: &Vec<u8>, offset: usize) -> TrackBox {
    let mut pos = offset;
    let box_size = (&data[pos..pos+4]).to_vec();
    pos += 4;
    let box_type = (&data[pos..pos+4]).to_vec();
    pos += 4;
    let size = vec_to_number(box_size.clone());
    let step = if size == 1 {
        8
    } else {
        0
    };
    let large_size = (&data[pos..pos+step]).to_vec();
    pos += step;

    let tkhd = read_tkhd(data, pos);

    TrackBox {
        box_size,
        box_type,
        large_size,
        tkhd
    }
}

pub fn read_moov(data: &Vec<u8>, offset: usize) {
    let mut pos = offset;
    let box_size = (&data[pos..pos+4]).to_vec();
    pos += 4;
    let box_type = (&data[pos..pos+4]).to_vec();
    pos += 4;
    let size = vec_to_number(box_size.clone());
    let step = if size == 1 {
        8
    } else {
        0
    };
    let large_size = (&data[pos..pos+step]).to_vec();
    pos += step;

    let moov_header = MoovHeader {
        box_size,
        box_type,
        large_size,
    };

    let mvhd = read_mvhd(data, pos);

    pos += mvhd.get_box_size();

    let mut tracks = vec![];

    while pos < size {
        let track = read_track(data, pos);
        tracks.push(track.clone());
        pos += track.get_box_size();
        println!("{}", track);
    }

    println!("{}", tracks.len());
}