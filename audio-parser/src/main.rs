mod utils;

use utils::{read_file, write_file, translate};

pub fn main() {
    // write_file(), "test_01.mp3".into());
    let result = translate(read_file("./test.mp3".into()));
    println!("{:#?}", result);
}