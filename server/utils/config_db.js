import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Koneksi berhasil ke db");
  } catch (error) {
    console.log(`Koneksi gagal : ${error.message}`);
  }
};
export default connectDb;
