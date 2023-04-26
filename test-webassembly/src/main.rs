mod utils;
use std::{fs::File, io::{BufReader, Read}, os::unix::prelude::FileExt};

use utils:: *;

pub fn main() {
    let mut f = File::open("./demo.mp4").unwrap();
    let mut buf = vec![];
    f.read_to_end(&mut buf).unwrap();
    // println!("{:?}", buf.len());
    read_info(buf);

    // let mut new_f = File::create("./new.mp4").unwrap();
    // new_f.write_all_at(&mut buf, 0).unwrap();
}