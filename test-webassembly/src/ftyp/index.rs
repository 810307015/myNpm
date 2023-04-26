use std::fmt;

use super::vec_to_number;

#[derive(Debug)]
pub struct FtypHeader {
    pub box_size: Vec<u8>, // 4个字节
    pub box_type: Vec<u8>, // 4个字节
    pub large_size: Vec<u8> // 8个字节，当box_size为1时才存在这个字段
}

impl FtypHeader {
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

impl fmt::Display for FtypHeader {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "box_size = {}, box_type = {}, large_size = {}", self.get_box_size(), self.get_box_type(), self.get_large_size())
    }
}

#[derive(Debug)]
pub struct FtypBody {
    pub major_brand: Vec<u8>, // 4个字节
    pub minor_version: Vec<u8>, // 4个字节
    pub compatible_brands: Vec<u8>, // 4个字节
}

impl FtypBody {
    pub fn get_major_brand(&self) -> String {
        String::from_utf8_lossy(&self.major_brand).to_string()
    }

    pub fn get_minor_version(&self) -> usize {
        vec_to_number(self.minor_version.clone())
    }

    pub fn get_compatible_brands(&self) -> String {
        String::from_utf8_lossy(&self.compatible_brands).to_string()
    }
}

impl fmt::Display for FtypBody {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "major_brand = {}, minor_version = {}, compatible_brands = {}", self.get_major_brand(), self.get_minor_version(), self.get_compatible_brands())
    }
}

#[derive(Debug)]
pub struct FtypBox {
    pub ftyp_header: FtypHeader,
    pub ftyp_body: FtypBody,
}

impl fmt::Display for FtypBox {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}, {}", self.ftyp_header, self.ftyp_body)
    }
}

pub fn read_ftyp(data: &Vec<u8>) -> FtypBox {
    let mut pos = 0;
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

    let ftyp_header = FtypHeader {
        box_size,
        box_type,
        large_size
    };
    let major_brand = (&data[pos..pos+4]).to_vec();
    pos += 4;
    let minor_version = (&data[pos..pos+4]).to_vec();
    pos += 4;
    let compatible_brands = (&data[pos..ftyp_header.get_box_size()]).to_vec();

    let ftyp_body = FtypBody {
        major_brand,
        minor_version,
        compatible_brands
    };

    FtypBox {
        ftyp_header,
        ftyp_body
    }
}