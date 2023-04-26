// use std::{path::Path, fs::File, io::BufReader};
// use mp4::{Mp4Reader, Mp4Box, Result};

// #[derive(Debug, Clone, PartialEq, Default)]
// pub struct Box {
//     pub name: String,
//     pub size: u64,
//     pub summary: String,
//     pub indent: u32,
// }

// pub fn get_boxes(file: File) -> Result<Vec<Box>> {
//     let size = file.metadata()?.len();
//     let reader = BufReader::new(file);
//     let mp4 = mp4::Mp4Reader::read_header(reader, size)?;

//     // collect known boxes
//     let mut boxes = vec![
//         build_box(&mp4.ftyp),
//         build_box(&mp4.moov),
//         build_box(&mp4.moov.mvhd),
//     ];

//     if let Some(ref mvex) = &mp4.moov.mvex {
//         boxes.push(build_box(mvex));
//         if let Some(mehd) = &mvex.mehd {
//             boxes.push(build_box(mehd));
//         }
//         boxes.push(build_box(&mvex.trex));
//     }

//     // trak.
//     for track in mp4.tracks().values() {
//         boxes.push(build_box(&track.trak));
//         boxes.push(build_box(&track.trak.tkhd));
//         if let Some(ref edts) = track.trak.edts {
//             boxes.push(build_box(edts));
//             if let Some(ref elst) = edts.elst {
//                 boxes.push(build_box(elst));
//             }
//         }

//         // trak.mdia
//         let mdia = &track.trak.mdia;
//         boxes.push(build_box(mdia));
//         boxes.push(build_box(&mdia.mdhd));
//         boxes.push(build_box(&mdia.hdlr));
//         boxes.push(build_box(&track.trak.mdia.minf));

//         // trak.mdia.minf
//         let minf = &track.trak.mdia.minf;
//         if let Some(ref vmhd) = &minf.vmhd {
//             boxes.push(build_box(vmhd));
//         }
//         if let Some(ref smhd) = &minf.smhd {
//             boxes.push(build_box(smhd));
//         }

//         // trak.mdia.minf.stbl
//         let stbl = &track.trak.mdia.minf.stbl;
//         boxes.push(build_box(stbl));
//         boxes.push(build_box(&stbl.stsd));
//         if let Some(ref avc1) = &stbl.stsd.avc1 {
//             boxes.push(build_box(avc1));
//         }
//         if let Some(ref hev1) = &stbl.stsd.hev1 {
//             boxes.push(build_box(hev1));
//         }
//         if let Some(ref mp4a) = &stbl.stsd.mp4a {
//             boxes.push(build_box(mp4a));
//         }
//         boxes.push(build_box(&stbl.stts));
//         if let Some(ref ctts) = &stbl.ctts {
//             boxes.push(build_box(ctts));
//         }
//         if let Some(ref stss) = &stbl.stss {
//             boxes.push(build_box(stss));
//         }
//         boxes.push(build_box(&stbl.stsc));
//         boxes.push(build_box(&stbl.stsz));
//         if let Some(ref stco) = &stbl.stco {
//             boxes.push(build_box(stco));
//         }
//         if let Some(ref co64) = &stbl.co64 {
//             boxes.push(build_box(co64));
//         }
//     }

//     // If fragmented, add moof boxes.
//     for moof in mp4.moofs.iter() {
//         boxes.push(build_box(moof));
//         boxes.push(build_box(&moof.mfhd));
//         for traf in moof.trafs.iter() {
//             boxes.push(build_box(traf));
//             boxes.push(build_box(&traf.tfhd));
//             if let Some(ref trun) = &traf.trun {
//                 boxes.push(build_box(trun));
//             }
//         }
//     }

//     Ok(boxes)
// }

// pub fn build_box<M: Mp4Box + std::fmt::Debug>(m: &M) -> Box {
//     Box {
//         name: m.box_type().to_string(),
//         size: m.box_size(),
//         summary: m.summary().unwrap(),
//         indent: 0,
//     }
// }
// pub fn get_mp4_by_path (filename: &str) -> Mp4Reader<BufReader<File>> {
//     let f = File::open(filename).unwrap();
//     let size = f.metadata().unwrap().len();
//     let reader = BufReader::new(f);
//     mp4::Mp4Reader::read_header(reader, size).unwrap()
// }
use std::fmt;

#[path="./ftyp/index.rs"]
mod ftmp;
use ftmp::*;
#[path="./moov/index.rs"]
mod moov;
use moov::*;

pub struct BoxHeader {
    pub box_size: Vec<u8>, // 4
    pub box_type: Vec<u8>, // 4
    pub large_size: Vec<u8>, // box_size === 1 ? 8 : 0
}

pub fn vec_to_number(data: Vec<u8>) -> usize {
    let len = data.len() as u32;
    let mut result = 0;
    let base = 256_usize;
    for (index, num) in data.iter().enumerate() {
        result += base.pow(len - index as u32 - 1) * (*num) as usize;
    }
    result
}

pub fn read_info(data: Vec<u8>) {
    let ftyp = read_ftyp(&data);
    let offset = ftyp.ftyp_header.get_box_size();
    let moov = read_moov(&data, offset);
}